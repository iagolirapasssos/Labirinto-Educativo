// main.js
import { gerenciadorBlocos, mostrarMensagem, BLOCOS_CONFIG } from './blocks.js';
import { i18nThemeManager } from './i18n-theme-manager.js';
import touchManager from './touch-manager.js';

// Variáveis para controle de áudio
let oscillator = null;
let gainNode = null;
let audioContext = null;

// Configurações iniciais
const TAMANHO_CELULA = 40;
const CONFIGURACOES_NIVEL = {
    facil: { linhas: 8, colunas: 8 },
    medio: { linhas: 12, colunas: 12 },
    dificil: { linhas: 15, colunas: 15 }
};

// Estado do jogo
const estado = {
    nivelAtual: 'facil',
    posicaoAtual: { x: 1, y: 1 },
    direcaoAtual: 0,
    executandoPrograma: false,
    pausado: false,
    labirintoAtual: null,
    posicaoChegada: { x: 0, y: 0 },
    escalaLabirinto: 1,
    touchStartX: 0,
    touchStartY: 0,
    ultimoToque: null,
    pinchStartDistance: 0
};

// Elementos DOM
const elementos = {
    labirinto: document.getElementById('labirinto'),
    nivelSelect: document.getElementById('nivel-select'),
    executarBtn: document.getElementById('executar'),
    pausarBtn: document.getElementById('pausar'),
    pararBtn: document.getElementById('parar'),
    limparBtn: document.getElementById('limpar'),
    novoLabirintoBtn: document.getElementById('novo-labirinto'),
    sequenciaBlocos: document.getElementById('sequencia-blocos'),
    mensagemElement: document.getElementById('mensagem'),
    programaContainer: document.getElementById('programa-container'),
    tutorialElement: document.getElementById('tutorial'),
    botaoAjuda: document.getElementById('ajuda')
};

// Constantes SVG
const CARRO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="25" height="25">
    <rect x="5" y="15" width="30" height="15" fill="#FF4444" rx="5"/>
    <rect x="10" y="8" width="20" height="10" fill="#FF4444" rx="3"/>
    <rect x="12" y="10" width="16" height="6" fill="#87CEEB"/>
    <circle cx="10" cy="30" r="4" fill="#333"/>
    <circle cx="30" cy="30" r="4" fill="#333"/>
</svg>`;

// Detecção de dispositivo touch
const isTouchDevice = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     navigator.msMaxTouchPoints > 0;

// Configuração do suporte touch para o labirinto
function configurarTouchLabirinto() {
    if (!isTouchDevice) return;

    let ultimoToque = null;
    let pinchStartDistance = 0;
    let isPinching = false;
    let isDragging = false;
    let lastDragX = 0;
    let lastDragY = 0;

    elementos.labirinto.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Início de pinch zoom
            isPinching = true;
            pinchStartDistance = calcularDistanciaToque(e.touches[0], e.touches[1]);
        } else if (e.touches.length === 1) {
            // Início de drag
            isDragging = true;
            lastDragX = e.touches[0].clientX;
            lastDragY = e.touches[0].clientY;
        }
        ultimoToque = e.touches[0];
    }, { passive: true });

    elementos.labirinto.addEventListener('touchmove', (e) => {
        e.preventDefault();

        if (isPinching && e.touches.length === 2) {
            // Pinch zoom
            const distanciaAtual = calcularDistanciaToque(e.touches[0], e.touches[1]);
            const fatorEscala = distanciaAtual / pinchStartDistance;
            aplicarZoomLabirinto(fatorEscala);
            pinchStartDistance = distanciaAtual;
        } else if (isDragging && e.touches.length === 1) {
            // Pan/drag do labirinto
            const deltaX = e.touches[0].clientX - lastDragX;
            const deltaY = e.touches[0].clientY - lastDragY;
            moverLabirinto(deltaX, deltaY);
            lastDragX = e.touches[0].clientX;
            lastDragY = e.touches[0].clientY;
        }
        ultimoToque = e.touches[0];
    }, { passive: false });

    elementos.labirinto.addEventListener('touchend', () => {
        isPinching = false;
        isDragging = false;
    }, { passive: true });
}

function calcularDistanciaToque(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.hypot(dx, dy);
}

function aplicarZoomLabirinto(fator) {
    estado.escalaLabirinto = Math.min(Math.max(estado.escalaLabirinto * fator, 0.5), 2);
    elementos.labirinto.style.transform = `scale(${estado.escalaLabirinto})`;
}

function moverLabirinto(deltaX, deltaY) {
    const rect = elementos.labirinto.getBoundingClientRect();
    const containerRect = elementos.labirinto.parentElement.getBoundingClientRect();
    
    // Calcular os limites de movimento
    const maxX = (rect.width * estado.escalaLabirinto - containerRect.width) / 2;
    const maxY = (rect.height * estado.escalaLabirinto - containerRect.height) / 2;
    
    // Atualizar posição com limites
    const novoLeft = Math.min(Math.max(rect.left + deltaX, -maxX), maxX);
    const novoTop = Math.min(Math.max(rect.top + deltaY, -maxY), maxY);
    
    elementos.labirinto.style.left = `${novoLeft}px`;
    elementos.labirinto.style.top = `${novoTop}px`;
}

// Funções do labirinto
function gerarLabirinto() {
    const config = CONFIGURACOES_NIVEL[estado.nivelAtual];
    const grid = Array(config.linhas).fill().map(() => Array(config.colunas).fill(1));

    function gerarCaminho(x, y) {
        grid[y][x] = 0;

        const direcoes = [
            [0, -2], [2, 0], [0, 2], [-2, 0]
        ].sort(() => Math.random() - 0.5);

        for (let [dx, dy] of direcoes) {
            const novoX = x + dx;
            const novoY = y + dy;

            if (novoX > 0 && novoX < config.colunas - 1 &&
                novoY > 0 && novoY < config.linhas - 1 &&
                grid[novoY][novoX] === 1) {
                grid[y + dy / 2][x + dx / 2] = 0;
                gerarCaminho(novoX, novoY);
            }
        }
    }

    gerarCaminho(1, 1);
    return grid;
}

function desenharLabirinto() {
    elementos.labirinto.innerHTML = '';
    estado.labirintoAtual = gerarLabirinto();
    const config = CONFIGURACOES_NIVEL[estado.nivelAtual];

    elementos.labirinto.style.width = (config.colunas * TAMANHO_CELULA) + 'px';
    elementos.labirinto.style.height = (config.linhas * TAMANHO_CELULA) + 'px';
    elementos.labirinto.style.transform = `scale(${estado.escalaLabirinto})`;

    // Criar grid do labirinto
    const fragment = document.createDocumentFragment();
    for (let y = 0; y < config.linhas; y++) {
        for (let x = 0; x < config.colunas; x++) {
            const cell = document.createElement('div');
            cell.className = `celula ${estado.labirintoAtual[y][x] === 1 ? 'parede' : 'caminho'}`;
            cell.style.left = (x * TAMANHO_CELULA) + 'px';
            cell.style.top = (y * TAMANHO_CELULA) + 'px';
            
            if (isTouchDevice) {
                cell.classList.add('touch-cell');
            }
            
            fragment.appendChild(cell);
        }
    }

    // Adicionar carro
    const carro = document.createElement('div');
    carro.id = 'carro';
    carro.className = 'carro' + (isTouchDevice ? ' touch-carro' : '');
    carro.dataset.espelhadoH = 'false';
    carro.dataset.espelhadoV = 'false';
    carro.innerHTML = CARRO_SVG;
    fragment.appendChild(carro);

    // Encontrar e adicionar chegada
    const chegadaPos = encontrarChegada();
    estado.posicaoChegada = { x: chegadaPos.x, y: chegadaPos.y };

    const chegada = document.createElement('div');
    chegada.className = 'chegada' + (isTouchDevice ? ' touch-chegada' : '');
    chegada.innerHTML = '🏁';
    chegada.style.left = (estado.posicaoChegada.x * TAMANHO_CELULA) + 'px';
    chegada.style.top = (estado.posicaoChegada.y * TAMANHO_CELULA) + 'px';
    fragment.appendChild(chegada);

    elementos.labirinto.appendChild(fragment);
    resetarPosicao();
}

function encontrarChegada() {
    const config = CONFIGURACOES_NIVEL[estado.nivelAtual];
    const start = { x: 1, y: 1 };
    const queue = [start];
    const visited = Array(config.linhas).fill().map(() => Array(config.colunas).fill(false));
    visited[start.y][start.x] = true;
    let farthest = start;

    const direcoes = [
        { x: 1, y: 0 },   // Direita
        { x: -1, y: 0 },  // Esquerda
        { x: 0, y: 1 },   // Baixo
        { x: 0, y: -1 }   // Cima
    ];

    while (queue.length > 0) {
        const current = queue.shift();
        farthest = current;

        direcoes.forEach(dir => {
            const newX = current.x + dir.x;
            const newY = current.y + dir.y;

            if (newX >= 0 && newX < config.colunas && newY >= 0 && newY < config.linhas &&
                !visited[newY][newX] && estado.labirintoAtual[newY][newX] === 0) {
                visited[newY][newX] = true;
                queue.push({ x: newX, y: newY });
            }
        });
    }

    return farthest;
}

async function moverCarro(direcao) {
    const direcoes = {
        0: { x: 1, y: 0 },   // direita
        1: { x: 0, y: 1 },   // baixo
        2: { x: -1, y: 0 },  // esquerda
        3: { x: 0, y: -1 }   // cima
    };
    
    let multiplicador = direcao === 'frente' ? 1 : -1;
    let novaPosX = estado.posicaoAtual.x + (direcoes[estado.direcaoAtual].x * multiplicador);
    let novaPosY = estado.posicaoAtual.y + (direcoes[estado.direcaoAtual].y * multiplicador);
    
    if (verificarColisao(novaPosX, novaPosY)) {
        const msg = i18nThemeManager.translate('messages.error.wall');
        throw new Error(msg);
    }
    
    estado.posicaoAtual.x = novaPosX;
    estado.posicaoAtual.y = novaPosY;
    
    await animarMovimentoCarro();
}

async function animarMovimentoCarro() {
    const carro = document.getElementById('carro');
    if (!carro) return;

    const duracao = 300; // ms
    const inicio = performance.now();
    const posInicial = {
        x: parseFloat(carro.style.left) || (estado.posicaoAtual.x * TAMANHO_CELULA + TAMANHO_CELULA / 2),
        y: parseFloat(carro.style.top) || (estado.posicaoAtual.y * TAMANHO_CELULA + TAMANHO_CELULA / 2)
    };
    const posFinal = {
        x: estado.posicaoAtual.x * TAMANHO_CELULA + TAMANHO_CELULA / 2,
        y: estado.posicaoAtual.y * TAMANHO_CELULA + TAMANHO_CELULA / 2
    };

    return new Promise(resolve => {
        function animar(tempoAtual) {
            const tempoDecorrido = tempoAtual - inicio;
            const progresso = Math.min(tempoDecorrido / duracao, 1);
            
            // Função de easing
            const easeProgresso = 1 - Math.pow(1 - progresso, 3);

            const x = posInicial.x + (posFinal.x - posInicial.x) * easeProgresso;
            const y = posInicial.y + (posFinal.y - posInicial.y) * easeProgresso;

            carro.style.left = `${x}px`;
            carro.style.top = `${y}px`;

            if (progresso < 1) {
                requestAnimationFrame(animar);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animar);
    });
}

async function girarCarro(direcao) {
    estado.direcaoAtual = direcao === 'direita' 
        ? (estado.direcaoAtual + 1) % 4 
        : (estado.direcaoAtual - 1 + 4) % 4;
    
    await animarRotacaoCarro();
}

async function animarRotacaoCarro() {
    const carro = document.getElementById('carro');
    if (!carro) return;

    const duracaoRotacao = 200; // ms
    const inicio = performance.now();
    const rotacaoInicial = (estado.direcaoAtual - 1) * 90;
    const rotacaoFinal = estado.direcaoAtual * 90;

    return new Promise(resolve => {
        function animarRotacao(tempoAtual) {
            const tempoDecorrido = tempoAtual - inicio;
            const progresso = Math.min(tempoDecorrido / duracaoRotacao, 1);
            
            // Função de easing
            const easeProgresso = 1 - Math.pow(1 - progresso, 4);
            
            const rotacaoAtual = rotacaoInicial + (rotacaoFinal - rotacaoInicial) * easeProgresso;
            const escalaX = carro.dataset.espelhadoH === 'true' ? -1 : 1;
            const escalaY = carro.dataset.espelhadoV === 'true' ? -1 : 1;

            carro.style.transform = `translate(-50%, -50%) rotate(${rotacaoAtual}deg) scale(${escalaX}, ${escalaY})`;

            if (progresso < 1) {
                requestAnimationFrame(animarRotacao);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animarRotacao);
    });
}

async function espelharHorizontal() {
    const carro = document.getElementById('carro');
    if (!carro) return;

    carro.dataset.espelhadoH = carro.dataset.espelhadoH !== 'true';

    if (estado.direcaoAtual === 0) estado.direcaoAtual = 2;
    else if (estado.direcaoAtual === 2) estado.direcaoAtual = 0;

    await animarEspelhamento(carro);
}

async function espelharVertical() {
    const carro = document.getElementById('carro');
    if (!carro) return;

    carro.dataset.espelhadoV = carro.dataset.espelhadoV !== 'true';

    if (estado.direcaoAtual === 1) estado.direcaoAtual = 3;
    else if (estado.direcaoAtual === 3) estado.direcaoAtual = 1;

    await animarEspelhamento(carro);
}

async function animarEspelhamento(carro) {
    const duracao = 300;
    const inicio = performance.now();

    return new Promise(resolve => {
        function animar(tempoAtual) {
            const tempoDecorrido = tempoAtual - inicio;
            const progresso = Math.min(tempoDecorrido / duracao, 1);
            
            // Animação de escala com easing
            const escalaProgresso = Math.sin(progresso * Math.PI);
            const escalaX = carro.dataset.espelhadoH === 'true' ? -1 : 1;
            const escalaY = carro.dataset.espelhadoV === 'true' ? -1 : 1;
            const escalaTemp = 1 - escalaProgresso * 0.2;

            carro.style.transform = `
                translate(-50%, -50%) 
                rotate(${estado.direcaoAtual * 90}deg) 
                scale(${escalaX * escalaTemp}, ${escalaY * escalaTemp})
            `;

            if (progresso < 1) {
                requestAnimationFrame(animar);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animar);
    });
}

// Funções de áudio
function iniciarAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

async function iniciarAudio(frequencia) {
    try {
        iniciarAudioContext();
        
        if (oscillator) {
            const msg = i18nThemeManager.translate('messages.error.audioPlaying');
            mostrarMensagem(msg, 'error');
            return;
        }

        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequencia, audioContext.currentTime);
        
        // Fade in suave
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();

        const msg = i18nThemeManager.translate('messages.audio.playing', { frequency: frequencia });
        mostrarMensagem(msg, 'info');
    } catch (erro) {
        console.error('Erro ao iniciar áudio:', erro);
        const msg = i18nThemeManager.translate('messages.error.audio');
        mostrarMensagem(msg, 'error');
    }
}

async function pararAudio() {
    if (!oscillator) {
        const msg = i18nThemeManager.translate('messages.error.noAudio');
        mostrarMensagem(msg, 'error');
        return;
    }

    try {
        // Fade out suave
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        
        setTimeout(() => {
            oscillator.stop();
            oscillator.disconnect();
            gainNode.disconnect();
            oscillator = null;
            gainNode = null;
        }, 100);

        const msg = i18nThemeManager.translate('messages.audio.stopped');
        mostrarMensagem(msg, 'info');
    } catch (erro) {
        console.error('Erro ao parar áudio:', erro);
        const msg = i18nThemeManager.translate('messages.error.audio');
        mostrarMensagem(msg, 'error');
    }
}

// Execução do programa
async function executarPrograma() {
    if (estado.executandoPrograma) return;

    try {
        estado.executandoPrograma = true;
        estado.pausado = false;
        elementos.executarBtn.disabled = true;
        elementos.pausarBtn.disabled = false;
        elementos.pararBtn.disabled = false;

        resetarPosicao();

        const blocos = Array.from(elementos.sequenciaBlocos.children)
            .filter(el => el.classList.contains('bloco'));
            
        for (const bloco of blocos) {
            if (!estado.executandoPrograma || estado.pausado) break;
            await executarBloco(bloco);
        }

        if (!estado.pausado) {
            if (verificarVitoria()) {
                const msg = i18nThemeManager.translate('messages.victory');
                mostrarMensagem(msg, 'success');
                reproduzirSomVitoria();
            } else {
                const msg = i18nThemeManager.translate('messages.programComplete');
                mostrarMensagem(msg, 'success');
            }
        }
    } catch (erro) {
        console.error('Erro na execução:', erro);
        mostrarMensagem(erro.message, 'error');
    } finally {
        finalizarExecucao();
    }
}

async function executarBlocoLogico(bloco) {
    const tipo = bloco.dataset.tipo;
    
    switch(tipo) {
        case 'and':
        case 'or':
            const containers = bloco.querySelectorAll('.bloco-container-logico');
            const resultados = await Promise.all(Array.from(containers).map(async container => {
                const blocoLogico = container.querySelector('.bloco');
                return blocoLogico ? await avaliarCondicaoLogica(blocoLogico) : false;
            }));
            return tipo === 'and' 
                ? resultados.every(r => r === true)
                : resultados.some(r => r === true);
            
        case 'seLogico':
            const containerLogico = bloco.querySelector('.bloco-container-logico');
            const blocoLogico = containerLogico?.querySelector('.bloco');
            return await avaliarCondicaoLogica(blocoLogico);
            
        case 'verificarParedeDireita':
        case 'verificarParedeEsquerda':
        case 'verificarParedeTras':
            const direcao = tipo.replace('verificarParede', '').toLowerCase();
            return verificarParedeEspecifica(direcao);
            
        default:
            return false;
    }
}

async function avaliarAND(bloco) {
    const containers = bloco.querySelectorAll('.bloco-container-logico');
    const resultados = await Promise.all(Array.from(containers).map(async container => {
        const blocoLogico = container.querySelector('.bloco');
        return blocoLogico ? await avaliarCondicaoLogica(blocoLogico) : false;
    }));
    return resultados.every(r => r === true);
}

async function avaliarOR(bloco) {
    const containers = bloco.querySelectorAll('.bloco-container-logico');
    const resultados = await Promise.all(Array.from(containers).map(async container => {
        const blocoLogico = container.querySelector('.bloco');
        return blocoLogico ? await avaliarCondicaoLogica(blocoLogico) : false;
    }));
    return resultados.some(r => r === true);
}


async function executarBloco(bloco) {
    if (!estado.executandoPrograma || estado.pausado) return;

    const tipo = bloco.dataset.tipo;

    try {
        // Destacar bloco sendo executado
        bloco.classList.add('executando');
        
        switch(tipo) {
            case 'frente':
                await moverCarro('frente');
                break;
            case 'tras':
                await moverCarro('tras');
                break;
            case 'direita':
                await girarCarro('direita');
                break;
            case 'esquerda':
                await girarCarro('esquerda');
                break;
            case 'espelharH':
                await espelharHorizontal();
                break;
            case 'espelharV':
                await espelharVertical();
                break;
            case 'repetir':
                const vezes = parseInt(bloco.querySelector('input').value) || 1;
                const blocosRepetir = Array.from(bloco.querySelector('.bloco-container').children)
                    .filter(el => el.classList.contains('bloco'));
                for (let i = 0; i < vezes && estado.executandoPrograma && !estado.pausado; i++) {
                    for (const blocoInterno of blocosRepetir) {
                        await executarBloco(blocoInterno);
                    }
                }
                break;
            case 'se':
            case 'senaoSe':
            case 'senao':
                const condicao = tipo === 'senao' ? true : bloco.querySelector('select')?.value;
                let condicaoAtendida = false;

                if (tipo === 'senao') {
                    // SENAO executes if previous SE or SENAO SE didn't execute
                    const blocoAnterior = bloco.previousElementSibling;
                    condicaoAtendida = blocoAnterior && 
                                     (blocoAnterior.dataset.tipo === 'se' || blocoAnterior.dataset.tipo === 'senaoSe') &&
                                     !blocoAnterior.dataset.executado;
                } else {
                    // SE or SENAO SE
                    condicaoAtendida = verificarCondicao(condicao);
                }

                if (condicaoAtendida) {
                    bloco.dataset.executado = 'true';
                    const container = bloco.querySelector('.bloco-container');
                    const blocosInternos = Array.from(container.children)
                        .filter(el => el.classList.contains('bloco'));
                    
                    for (const blocoInterno of blocosInternos) {
                        await executarBloco(blocoInterno);
                    }
                } else {
                    bloco.dataset.executado = 'false';
                }
                break;
            case 'paraSempre':
                const blocosSempre = Array.from(bloco.querySelector('.bloco-container').children)
                    .filter(el => el.classList.contains('bloco'));
                while (estado.executandoPrograma && !estado.pausado) {
                    for (const blocoInterno of blocosSempre) {
                        await executarBloco(blocoInterno);
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                break;
            case 'temParedeDireita':
            case 'temParedeEsquerda':
            case 'temParedeTras':
                await executarCondicionalParede(bloco, tipo.replace('temParede', '').toLowerCase());
                break;
            case 'aguardar':
                const milisegundos = parseInt(bloco.querySelector('input').value) || 1000;
                const msg = i18nThemeManager.translate('messages.waiting', { ms: milisegundos });
                mostrarMensagem(msg, 'info');
                await new Promise(resolve => setTimeout(resolve, milisegundos));
                break;
            case 'emitirTom':
                const freq = parseInt(bloco.querySelector('input').value) || 440;
                await iniciarAudio(freq);
                await new Promise(resolve => setTimeout(resolve, 300));
                break;
            case 'pararTom':
                await pararAudio();
                await new Promise(resolve => setTimeout(resolve, 300));
                break;
            case 'seLogico':
                const containerLogico = bloco.querySelector('.bloco-container-logico');
                const blocoLogico = containerLogico.querySelector('.bloco');
                const resultado = await avaliarCondicaoLogica(blocoLogico);
                
                if (resultado) {
                    const containerExecucao = bloco.querySelector('.bloco-container:not(.bloco-container-logico)');
                    const blocosExecucao = Array.from(containerExecucao.children)
                        .filter(el => el.classList.contains('bloco'));
                    
                    for (const blocoExec of blocosExecucao) {
                        await executarBloco(blocoExec);
                    }
                }
                break;

            case 'and':
            case 'or':
                // Estes blocos são avaliados apenas como parte de condições
                return await executarBlocoLogico(bloco);

            case 'verificarParedeDireita':
            case 'verificarParedeEsquerda':
                // Estes blocos retornam valores booleanos
                return await executarBlocoLogico(bloco);
            case 'verificarChegada':
                return verificarVitoriaLogica();
            case 'pararRobo':
                estado.executandoPrograma = false;
                estado.pausado = false;
                const msgPararRobo = i18nThemeManager.translate('messages.robotStopped');
                mostrarMensagem(msgPararRobo, 'info');
                break;
            default:
                const msgErro = i18nThemeManager.translate('messages.error.unknownBlock');
                throw new Error(msgErro);
        }
    } finally {
        bloco.classList.remove('executando');

        // Clean up execution flags after all blocks in a conditional chain are processed
        if (tipo === 'se' || tipo === 'senaoSe' || tipo === 'senao') {
            const proximoBloco = bloco.nextElementSibling;
            if (!proximoBloco || (proximoBloco.dataset.tipo !== 'senaoSe' && proximoBloco.dataset.tipo !== 'senao')) {
                limparFlagsExecucao(bloco);
            }
        }
    }

}

function limparFlagsExecucao(blocoAtual) {
    let bloco = blocoAtual;
    while (bloco && (bloco.dataset.tipo === 'se' || bloco.dataset.tipo === 'senaoSe' || bloco.dataset.tipo === 'senao')) {
        delete bloco.dataset.executado;
        bloco = bloco.previousElementSibling;
    }
}

async function avaliarCondicaoLogica(bloco) {
    if (!bloco) return false;
    
    const tipo = bloco.dataset.tipo;
    const configBloco = BLOCOS_CONFIG.find(b => b.id === tipo);
    
    if (!configBloco) return false;
    
    if (configBloco.retornaLogico) {
        switch(tipo) {
            case 'verificarParedeDireita':
                return verificarParedeEspecifica('direita');
            case 'verificarParedeEsquerda':
                return verificarParedeEspecifica('esquerda');
            case 'verificarParedeTras':
                return verificarParedeEspecifica('tras');
        }
    }
    
    if (tipo === 'and' || tipo === 'or') {
        const containers = bloco.querySelectorAll('.bloco-container-logico');
        const resultados = await Promise.all(Array.from(containers).map(async container => {
            const blocoLogico = container.querySelector('.bloco');
            return blocoLogico ? await avaliarCondicaoLogica(blocoLogico) : false;
        }));
        
        return tipo === 'and' 
            ? resultados.every(r => r === true)
            : resultados.some(r => r === true);
    }
    
    return false;
}

// Função auxiliar para verificar paredes específicas
function verificarParedeEspecifica(direcao) {
    const direcoes = {
        0: { x: 1, y: 0 },    // direita
        1: { x: 0, y: 1 },    // baixo
        2: { x: -1, y: 0 },   // esquerda
        3: { x: 0, y: -1 }    // cima
    };

    let direcaoVerificacao = estado.direcaoAtual;

    switch(direcao) {
        case 'direita':
            direcaoVerificacao = (estado.direcaoAtual + 1) % 4;
            break;
        case 'esquerda':
            direcaoVerificacao = (estado.direcaoAtual + 3) % 4;
            break;
        case 'tras':
            direcaoVerificacao = (estado.direcaoAtual + 2) % 4;
            break;
    }

    const novaPosX = estado.posicaoAtual.x + direcoes[direcaoVerificacao].x;
    const novaPosY = estado.posicaoAtual.y + direcoes[direcaoVerificacao].y;

    return verificarColisao(novaPosX, novaPosY);
}

// Função auxiliar para executar blocos condicionais de parede
async function executarCondicionalParede(blocoCondicional, direcao) {
    const temParede = verificarParedeEspecifica(direcao);
    const opcaoSelecionada = blocoCondicional.querySelector('select').value;
    const condicaoAtendida = (opcaoSelecionada === 'sim' && temParede) || 
                            (opcaoSelecionada === 'não' && !temParede);

    if (condicaoAtendida) {
        const blocosDentro = Array.from(blocoCondicional.querySelector('.bloco-container').children)
            .filter(el => el.classList.contains('bloco'));
        
        for (const blocoInterno of blocosDentro) {
            await executarBloco(blocoInterno);
        }
    }
}
async function executarBlocoRepeticao(bloco) {
    const vezes = parseInt(bloco.querySelector('input').value) || 1;
    const blocos = Array.from(bloco.querySelector('.bloco-container').children)
        .filter(el => el.classList.contains('bloco'));
    
    for (let i = 0; i < vezes && estado.executandoPrograma && !estado.pausado; i++) {
        for (const blocoInterno of blocos) {
            await executarBloco(blocoInterno);
        }
    }
}

async function executarBlocoCondicional(bloco) {
    const condicao = bloco.querySelector('select').value;
    if (verificarCondicao(condicao)) {
        const blocos = Array.from(bloco.querySelector('.bloco-container').children)
            .filter(el => el.classList.contains('bloco'));
        
        for (const blocoInterno of blocos) {
            await executarBloco(blocoInterno);
        }
    }
}

async function executarBlocoParaSempre(bloco) {
    const blocos = Array.from(bloco.querySelector('.bloco-container').children)
        .filter(el => el.classList.contains('bloco'));
    
    while (estado.executandoPrograma && !estado.pausado) {
        for (const blocoInterno of blocos) {
            await executarBloco(blocoInterno);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function executarBlocoAguardar(bloco) {
    const milisegundos = parseInt(bloco.querySelector('input').value) || 1000;
    const msg = i18nThemeManager.translate('messages.waiting', { ms: milisegundos });
    mostrarMensagem(msg, 'info');
    await new Promise(resolve => setTimeout(resolve, milisegundos));
}

async function executarBlocoEmitirTom(bloco) {
    const frequencia = parseInt(bloco.querySelector('input').value) || 440;
    await iniciarAudio(frequencia);
}

function verificarVitoria() {
    return estado.posicaoAtual.x === estado.posicaoChegada.x && 
           estado.posicaoAtual.y === estado.posicaoChegada.y;
}

function verificarVitoriaLogica() {
    if (estado.posicaoAtual.x === estado.posicaoChegada.x && 
           estado.posicaoAtual.y === estado.posicaoChegada.y) return true;
    return false;
}

async function reproduzirSomVitoria() {
    const frequencias = [440, 554.37, 659.25, 880];
    const duracao = 200;

    for (const freq of frequencias) {
        await iniciarAudio(freq);
        await new Promise(resolve => setTimeout(resolve, duracao));
        await pararAudio();
    }
}

function verificarColisao(x, y) {
    const config = CONFIGURACOES_NIVEL[estado.nivelAtual];
    if (x < 0 || x >= config.colunas || y < 0 || y >= config.linhas) {
        return true;
    }
    return estado.labirintoAtual[y][x] === 1;
}

function verificarCondicao(condicao) {
    const direcoes = {
        0: { x: 1, y: 0 },
        1: { x: 0, y: 1 },
        2: { x: -1, y: 0 },
        3: { x: 0, y: -1 }
    };

    const novaPosX = estado.posicaoAtual.x + direcoes[estado.direcaoAtual].x;
    const novaPosY = estado.posicaoAtual.y + direcoes[estado.direcaoAtual].y;

    switch(condicao) {
        case 'caminho livre':
            return !verificarColisao(novaPosX, novaPosY);
        case 'parede à frente':
            return verificarColisao(novaPosX, novaPosY);
        default:
            return false;
    }
}

function resetarPosicao() {
    estado.posicaoAtual = { x: 1, y: 1 };
    estado.direcaoAtual = 0;
    const carro = document.getElementById('carro');
    if (carro) {
        // Posição corrigida para o centro da célula livre
        const centerX = (estado.posicaoAtual.x * TAMANHO_CELULA) + (TAMANHO_CELULA / 2);
        const centerY = (estado.posicaoAtual.y * TAMANHO_CELULA) + (TAMANHO_CELULA / 2);
        
        carro.style.left = `${centerX}px`;
        carro.style.top = `${centerY}px`;
        carro.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        carro.dataset.espelhadoH = 'false';
        carro.dataset.espelhadoV = 'false';
    }
}

function finalizarExecucao() {
    estado.executandoPrograma = false;
    estado.pausado = false;
    elementos.executarBtn.disabled = false;
    elementos.pausarBtn.disabled = true;
    elementos.pararBtn.disabled = true;
}

// Inicialização e Event Listeners
async function inicializarJogo() {
    await i18nThemeManager.initialize();
    
    // Configurar interface
    configurarEventListeners();
    configurarTouchLabirinto();

    //Permitir adicionar JSON ao Meu Programa
    configurarDragDropJSON(); // Add this line
    
    // Iniciar jogo
    desenharLabirinto();
    elementos.pausarBtn.disabled = true;
    elementos.pararBtn.disabled = true;
}

function configurarEventListeners() {
    // Controles principais
    elementos.nivelSelect.addEventListener('change', () => {
        estado.nivelAtual = elementos.nivelSelect.value;
        desenharLabirinto();
    });

    elementos.executarBtn.addEventListener('click', executarPrograma);
    
    elementos.pausarBtn.addEventListener('click', () => {
        estado.pausado = true;
        elementos.pausarBtn.disabled = true;
        elementos.executarBtn.disabled = false;
    });

    elementos.pararBtn.addEventListener('click', () => {
        estado.executandoPrograma = false;
        estado.pausado = false;
        resetarPosicao();
        finalizarExecucao();
    });

    elementos.limparBtn.addEventListener('click', () => {
        elementos.sequenciaBlocos.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'programa-placeholder';
        placeholder.textContent = i18nThemeManager.translate('interface.dropBlocks');
        elementos.sequenciaBlocos.appendChild(placeholder);
        resetarPosicao();
    });

    elementos.novoLabirintoBtn.addEventListener('click', desenharLabirinto);

    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'enter':
                    e.preventDefault();
                    if (!elementos.executarBtn.disabled) executarPrograma();
                    break;
                case 'p':
                    e.preventDefault();
                    if (!elementos.pausarBtn.disabled) elementos.pausarBtn.click();
                    break;
                case 's':
                    e.preventDefault();
                    if (!elementos.pararBtn.disabled) elementos.pararBtn.click();
                    break;
                case 'n':
                    e.preventDefault();
                    elementos.novoLabirintoBtn.click();
                    break;
            }
        }
    });

    // Tutorial
    elementos.botaoAjuda?.addEventListener('click', () => {
        elementos.tutorialElement.style.display = 'flex';
    });

    document.getElementById('fechar-tutorial')?.addEventListener('click', () => {
        elementos.tutorialElement.style.display = 'none';
    });
}

// Configurar drag and drop de JSON
// Em main.js, modifique a função configurarDragDropJSON:
function configurarDragDropJSON() {
    const sequenciaBlocos = document.getElementById('sequencia-blocos');
    
    sequenciaBlocos.addEventListener('dragenter', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            sequenciaBlocos.classList.add('drag-over');
        }
    });
    
    sequenciaBlocos.addEventListener('dragover', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }
    });
    
    sequenciaBlocos.addEventListener('dragleave', () => {
        sequenciaBlocos.classList.remove('drag-over');
    });
    
    sequenciaBlocos.addEventListener('drop', async (e) => {
        e.preventDefault();
        sequenciaBlocos.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            try {
                const texto = await file.text();
                const programa = JSON.parse(texto);
                gerenciadorBlocos.carregarPrograma(programa);
                mostrarMensagem(i18nThemeManager.translate('messages.loaded'), 'success');
            } catch (erro) {
                console.error('Erro ao carregar JSON:', erro);
                mostrarMensagem(i18nThemeManager.translate('messages.error.loading'), 'error');
            }
        }
    });
}


// Prevenção de perda acidental de programa
window.addEventListener('beforeunload', (e) => {
    if (elementos.sequenciaBlocos.children.length > 1) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', inicializarJogo);

// Exportações
export { 
    executarPrograma,
    resetarPosicao,
    verificarVitoria,
    mostrarMensagem,
    avaliarCondicaoLogica,
    executarBlocoLogico
};