// main.js

import { gerenciadorBlocos, mostrarMensagem } from './blocks.js';

// Variáveis para controle de áudio
let oscillator = null;
let gainNode = null;

// Configurações iniciais
const TAMANHO_CELULA = 40;
const CONFIGURACOES_NIVEL = {
    facil: { linhas: 8, colunas: 8 },
    medio: { linhas: 12, colunas: 12 },
    dificil: { linhas: 15, colunas: 15 }
};
let nivelAtual = 'facil';
let posicaoAtual = { x: 1, y: 1 };
let direcaoAtual = 0;
let executandoPrograma = false;
let pausado = false;
let labirintoAtual = null;
let posicaoChegada = { x: 0, y: 0 };

// Elementos DOM
const labirinto = document.getElementById('labirinto');
const nivelSelect = document.getElementById('nivel-select');
const executarBtn = document.getElementById('executar');
const pausarBtn = document.getElementById('pausar');
const pararBtn = document.getElementById('parar');
const limparBtn = document.getElementById('limpar');
const novoLabirintoBtn = document.getElementById('novo-labirinto');
const sequenciaBlocos = document.getElementById('sequencia-blocos');
const mensagemElement = document.getElementById('mensagem');
const programaContainer = document.getElementById('programa-container');
const tutorialElement = document.getElementById('tutorial');
const botaoAjuda = document.getElementById('ajuda');

// Novos Elementos para Salvar e Abrir
const salvarBtn = document.getElementById('salvar-programa');
const abrirBtn = document.getElementById('abrir-programa');
const inputAbrir = document.getElementById('input-abrir-programa');

// Redimensionamento do painel
let isDragging = false;
const resizeHandle = document.getElementById('resize-handle');

resizeHandle.addEventListener('mousedown', initResize);

function initResize(e) {
    isDragging = true;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
}

function resize(e) {
    if (isDragging) {
        const newWidth = e.clientX - programaContainer.getBoundingClientRect().left;
        if (newWidth >= 300 && newWidth <= 800) {
            programaContainer.style.width = `${newWidth}px`;
        }
    }
}

function stopResize() {
    isDragging = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// Funções do labirinto
function gerarLabirinto() {
    const config = CONFIGURACOES_NIVEL[nivelAtual];
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

const CARRO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="30" height="30">
    <!-- Corpo do carro - mais simples e maior -->
    <rect x="5" y="15" width="30" height="15" fill="#FF4444" rx="5"/>
    <!-- Teto -->
    <rect x="10" y="8" width="20" height="10" fill="#FF4444" rx="3"/>
    <!-- Janela -->
    <rect x="12" y="10" width="16" height="6" fill="#87CEEB"/>
    <!-- Rodas -->
    <circle cx="10" cy="30" r="4" fill="#333"/>
    <circle cx="30" cy="30" r="4" fill="#333"/>
</svg>`;

function desenharLabirinto() {
    labirinto.innerHTML = '';
    labirintoAtual = gerarLabirinto();
    const config = CONFIGURACOES_NIVEL[nivelAtual];

    labirinto.style.width = (config.colunas * TAMANHO_CELULA) + 'px';
    labirinto.style.height = (config.linhas * TAMANHO_CELULA) + 'px';

    // Criar células do labirinto
    for (let y = 0; y < config.linhas; y++) {
        for (let x = 0; x < config.colunas; x++) {
            const cell = document.createElement('div');
            cell.className = `celula ${labirintoAtual[y][x] === 1 ? 'parede' : 'caminho'}`;
            cell.style.left = (x * TAMANHO_CELULA) + 'px';
            cell.style.top = (y * TAMANHO_CELULA) + 'px';
            labirinto.appendChild(cell);
        }
    }

    // Adicionar carro com posicionamento absoluto
    const carro = document.createElement('div');
    carro.id = 'carro';
    carro.className = 'carro';
    carro.dataset.espelhadoH = 'false';
    carro.dataset.espelhadoV = 'false';
    carro.innerHTML = CARRO_SVG;
    labirinto.appendChild(carro);

    // Encontrar posição da chegada
    const chegadaPos = encontrarChegada();
    posicaoChegada = { x: chegadaPos.x, y: chegadaPos.y };

    // Adicionar chegada
    const chegada = document.createElement('div');
    chegada.className = 'chegada';
    chegada.innerHTML = '🏁';
    chegada.style.left = (posicaoChegada.x * TAMANHO_CELULA) + 'px';
    chegada.style.top = (posicaoChegada.y * TAMANHO_CELULA) + 'px';
    labirinto.appendChild(chegada);

    resetarPosicao();
}

function encontrarChegada() {
    const config = CONFIGURACOES_NIVEL[nivelAtual];
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
                !visited[newY][newX] && labirintoAtual[newY][newX] === 0) {
                visited[newY][newX] = true;
                queue.push({ x: newX, y: newY });
            }
        });
    }

    return farthest;
}

function resetarPosicao() {
    posicaoAtual = { x: 1, y: 1 };
    direcaoAtual = 0;
    atualizarPosicaoCarro();
}

function atualizarPosicaoCarro() {
    const carro = document.getElementById('carro');
    if (carro) {
        // Centralizar o carro na célula
        const x = (posicaoAtual.x * TAMANHO_CELULA) + (TAMANHO_CELULA / 2);
        const y = (posicaoAtual.y * TAMANHO_CELULA) + (TAMANHO_CELULA / 2);
        carro.style.left = `${x}px`;
        carro.style.top = `${y}px`;

        // Aplicar transformações mantendo a centralização
        const rotacao = direcaoAtual * 90;
        const escalaX = carro.dataset.espelhadoH === 'true' ? -1 : 1;
        const escalaY = carro.dataset.espelhadoV === 'true' ? -1 : 1;

        carro.style.transform = `translate(-50%, -50%) rotate(${rotacao}deg) scale(${escalaX}, ${escalaY})`;
    }
}

// Atualizar as funções de espelhamento
async function espelharHorizontal() {
    const carro = document.getElementById('carro');
    if (carro) {
        // Inverter o estado do espelhamento horizontal
        carro.dataset.espelhadoH = carro.dataset.espelhadoH !== 'true';

        // Se estiver indo para direita ou esquerda, inverter a direção
        if (direcaoAtual === 0) direcaoAtual = 2;
        else if (direcaoAtual === 2) direcaoAtual = 0;

        atualizarPosicaoCarro();
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

async function espelharVertical() {
    const carro = document.getElementById('carro');
    if (carro) {
        // Inverter o estado do espelhamento vertical
        carro.dataset.espelhadoV = carro.dataset.espelhadoV !== 'true';

        // Se estiver indo para cima ou baixo, inverter a direção
        if (direcaoAtual === 1) direcaoAtual = 3;
        else if (direcaoAtual === 3) direcaoAtual = 1;

        atualizarPosicaoCarro();
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// Novas Funções para Áudio
function iniciarAudio(frequencia) {
    if (oscillator) {
        mostrarMensagem('Já há um tom sendo emitido. Pare-o antes de iniciar outro.', 'error');
        return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequencia, audioContext.currentTime); // Frequência em Hz
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    mostrarMensagem(`Emitindo tom de ${frequencia} Hz`, 'info');
}

function pararAudio() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
        oscillator = null;
        gainNode = null;
        mostrarMensagem('Tom parado.', 'info');
    } else {
        mostrarMensagem('Nenhum tom está sendo emitido.', 'error');
    }
}

// Execução do programa
async function executarPrograma() {
    if (executandoPrograma) return;

    try {
        executandoPrograma = true;
        pausado = false;
        executarBtn.disabled = true;
        pausarBtn.disabled = false;
        pararBtn.disabled = false;

        resetarPosicao();

        const blocos = Array.from(sequenciaBlocos.children).filter(el => el.classList.contains('bloco'));
        for (const bloco of blocos) {
            if (!executandoPrograma || pausado) break;
            await executarBloco(bloco);
        }

        if (!pausado) {
            if (verificarVitoria()) {
                mostrarMensagem('Parabéns! Você chegou ao final! 🎉', 'success');
            } else {
                mostrarMensagem('Programa executado!', 'success');
            }
        }
    } catch (erro) {
        mostrarMensagem(erro.message, 'error');
    } finally {
        finalizarExecucao();
    }
}

async function moverCarro(direcao) {
    const direcoes = {
        0: { x: 1, y: 0 },   // direita
        1: { x: 0, y: 1 },   // baixo
        2: { x: -1, y: 0 },  // esquerda
        3: { x: 0, y: -1 }   // cima
    };
    
    let multiplicador = direcao === 'frente' ? 1 : -1;
    let novaPosX = posicaoAtual.x + (direcoes[direcaoAtual].x * multiplicador);
    let novaPosY = posicaoAtual.y + (direcoes[direcaoAtual].y * multiplicador);
    
    if (verificarColisao(novaPosX, novaPosY)) {
        throw new Error('Oops! O carro bateu em uma parede! 💥');
    }
    
    posicaoAtual.x = novaPosX;
    posicaoAtual.y = novaPosY;
    atualizarPosicaoCarro();
    
    await new Promise(resolve => setTimeout(resolve, 300));
}

async function girarCarro(direcao) {
    if (direcao === 'direita') {
        direcaoAtual = (direcaoAtual + 1) % 4;
    } else {
        direcaoAtual = (direcaoAtual - 1 + 4) % 4;
    }
    
    atualizarPosicaoCarro();
    await new Promise(resolve => setTimeout(resolve, 200));
}

async function executarBloco(bloco) {
    if (!executandoPrograma || pausado) return;

    const tipo = bloco.dataset.tipo;

    try {
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
                for (let i = 0; i < vezes && executandoPrograma && !pausado; i++) {
                    for (const blocoInterno of blocosRepetir) {
                        await executarBloco(blocoInterno);
                    }
                }
                break;
            case 'se':
                await executarCondicional(bloco);
                break;
            case 'paraSempre':
                const blocosSempre = Array.from(bloco.querySelector('.bloco-container').children)
                    .filter(el => el.classList.contains('bloco'));
                while (executandoPrograma && !pausado) {
                    for (const blocoInterno of blocosSempre) {
                        await executarBloco(blocoInterno);
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                break;
            // Novos blocos
            case 'esperar':
                const segundos = parseInt(bloco.querySelector('input').value) || 1;
                await esperar(segundos);
                break;
            case 'aguardar':
                const milisegundos = parseInt(bloco.querySelector('input').value) || 1000;
                mostrarMensagem(`Aguardando por ${milisegundos} milissegundos...`, 'info');
                await new Promise(resolve => setTimeout(resolve, milisegundos));
                break;
            case 'voltarInicio':
                await voltarAoInicio();
                break;
            case 'temParedeDireita':
                await executarCondicionalParede(bloco, 'direita');
                break;
            case 'temParedeEsquerda':
                await executarCondicionalParede(bloco, 'esquerda');
                break;
            case 'temParedeTras':
                await executarCondicionalParede(bloco, 'tras');
                break;
            case 'senaoSe':
                // SENÃO SE é tratado dentro do bloco "Se"
                break;
            case 'senao':
                // SENÃO é tratado dentro do bloco "Se"
                break;
            case 'emitirTom':
                const freq = parseInt(bloco.querySelector('input').value) || 440;
                iniciarAudio(freq);
                await new Promise(resolve => setTimeout(resolve, 300)); // Pequena pausa
                break;
            case 'pararTom':
                pararAudio();
                await new Promise(resolve => setTimeout(resolve, 300)); // Pequena pausa
                break;
        }
    } catch (erro) {
        throw erro;
    }
}

// Função para executar blocos condicionais de parede
async function executarCondicionalParede(blocoCondicional, direcao) {
    let resultado;
    switch(direcao) {
        case 'direita':
            resultado = verificarParedeDireita();
            break;
        case 'esquerda':
            resultado = verificarParedeEsquerda();
            break;
        case 'tras':
            resultado = verificarParedeTras();
            break;
        default:
            resultado = false;
    }

    const opcaoSelecionada = blocoCondicional.querySelector('select').value; // 'sim' ou 'não'
    const condicaoAtendida = (opcaoSelecionada === 'sim' && resultado) || (opcaoSelecionada === 'não' && !resultado);

    if (condicaoAtendida) {
        const blocosDentro = Array.from(blocoCondicional.querySelector('.bloco-container').children)
            .filter(el => el.classList.contains('bloco'));
        for (const blocoInterno of blocosDentro) {
            await executarBloco(blocoInterno);
        }
    }
}

// Função para executar blocos condicionais (Se, Senão Se, Senão)
async function executarCondicional(blocoSe) {
    const condicaoSe = blocoSe.querySelector('select').value;
    const resultadoSe = verificarCondicao(condicaoSe);

    if (resultadoSe) {
        const blocosSe = Array.from(blocoSe.querySelector('.bloco-container').children)
            .filter(el => el.classList.contains('bloco'));
        for (const blocoInterno of blocosSe) {
            await executarBloco(blocoInterno);
        }
    } else {
        // Verificar blocos SENÃO SE
        const blocosSenaoSe = Array.from(blocoSe.querySelectorAll('.bloco-senaoSe'))
            .filter(el => el.classList.contains('bloco'));

        let condicaoSenaoSeAtendida = false;

        for (const blocoSenaoSe of blocosSenaoSe) {
            const condicaoSenaoSe = blocoSenaoSe.querySelector('select').value;
            const resultadoSenaoSe = verificarCondicao(condicaoSenaoSe);

            if (resultadoSenaoSe) {
                const blocosSenaoSe = Array.from(blocoSenaoSe.querySelector('.bloco-container').children)
                    .filter(el => el.classList.contains('bloco'));
                for (const blocoInterno of blocosSenaoSe) {
                    await executarBloco(blocoInterno);
                }
                condicaoSenaoSeAtendida = true;
                break; // Executa apenas o primeiro SENÃO SE atendido
            }
        }

        if (!condicaoSenaoSeAtendida) {
            // Verificar se há bloco SENÃO
            const blocoSenao = blocoSe.querySelector('.bloco-senao');
            if (blocoSenao) {
                const blocosSenao = Array.from(blocoSenao.querySelector('.bloco-container').children)
                    .filter(el => el.classList.contains('bloco'));
                for (const blocoInterno of blocosSenao) {
                    await executarBloco(blocoInterno);
                }
            }
        }
    }
}

// Funções para verificar paredes
function verificarParedeDireita() {
    // Direção atual + 90 graus
    const direcaoDireita = (direcaoAtual + 1) % 4;
    const direcoes = {
        0: { x: 1, y: 0 },   // Direita
        1: { x: 0, y: 1 },   // Baixo
        2: { x: -1, y: 0 },  // Esquerda
        3: { x: 0, y: -1 }   // Cima
    };
    const { x, y } = direcoes[direcaoDireita];
    const novaPosX = posicaoAtual.x + x;
    const novaPosY = posicaoAtual.y + y;
    return verificarColisao(novaPosX, novaPosY);
}

function verificarParedeEsquerda() {
    // Direção atual - 90 graus
    const direcaoEsquerda = (direcaoAtual + 3) % 4;
    const direcoes = {
        0: { x: 1, y: 0 },   // Direita
        1: { x: 0, y: 1 },   // Baixo
        2: { x: -1, y: 0 },  // Esquerda
        3: { x: 0, y: -1 }   // Cima
    };
    const { x, y } = direcoes[direcaoEsquerda];
    const novaPosX = posicaoAtual.x + x;
    const novaPosY = posicaoAtual.y + y;
    return verificarColisao(novaPosX, novaPosY);
}

function verificarParedeTras() {
    // Direção atual oposta
    const direcaoTras = (direcaoAtual + 2) % 4;
    const direcoes = {
        0: { x: 1, y: 0 },   // Direita
        1: { x: 0, y: 1 },   // Baixo
        2: { x: -1, y: 0 },  // Esquerda
        3: { x: 0, y: -1 }   // Cima
    };
    const { x, y } = direcoes[direcaoTras];
    const novaPosX = posicaoAtual.x + x;
    const novaPosY = posicaoAtual.y + y;
    return verificarColisao(novaPosX, novaPosY);
}

// Novos métodos
async function esperar(segundos) {
    mostrarMensagem(`Esperando por ${segundos} segundo(s)...`, 'info');
    await new Promise(resolve => setTimeout(resolve, segundos * 1000));
}

async function aguardar(milisegundos) {
    mostrarMensagem(`Aguardando por ${milissegundos} milissegundo(s)...`, 'info');
    await new Promise(resolve => setTimeout(resolve, milissegundos));
}

async function voltarAoInicio() {
    posicaoAtual = { x: 1, y: 1 };
    direcaoAtual = 0;
    atualizarPosicaoCarro();
    mostrarMensagem('Carro voltou ao início!', 'info');
    await new Promise(resolve => setTimeout(resolve, 300));
}

function verificarColisao(x, y) {
    const config = CONFIGURACOES_NIVEL[nivelAtual];

    if (x < 0 || x >= config.colunas || y < 0 || y >= config.linhas) {
        return true;
    }

    return labirintoAtual[y][x] === 1;
}

function verificarCondicao(condicao) {
    const direcoes = {
        0: { x: 1, y: 0 },
        1: { x: 0, y: 1 },
        2: { x: -1, y: 0 },
        3: { x: 0, y: -1 }
    };

    const novaPosX = posicaoAtual.x + direcoes[direcaoAtual].x;
    const novaPosY = posicaoAtual.y + direcoes[direcaoAtual].y;

    switch(condicao) {
        case 'caminho livre':
            return !verificarColisao(novaPosX, novaPosY);
        case 'parede à frente':
            return verificarColisao(novaPosX, novaPosY);
        case 'algo mais': // Exemplo adicional
            // Implementar lógica adicional conforme necessidade
            return false;
        default:
            return false;
    }
}

function verificarVitoria() {
    return posicaoAtual.x === posicaoChegada.x && posicaoAtual.y === posicaoChegada.y;
}

function finalizarExecucao() {
    executandoPrograma = false;
    pausado = false;
    executarBtn.disabled = false;
    pausarBtn.disabled = true;
    pararBtn.disabled = true;
}

// Event Listeners
nivelSelect.addEventListener('change', () => {
    nivelAtual = nivelSelect.value;
    desenharLabirinto();
});

executarBtn.addEventListener('click', executarPrograma);

pausarBtn.addEventListener('click', () => {
    pausado = true;
    pausarBtn.disabled = true;
    executarBtn.disabled = false;
});

pararBtn.addEventListener('click', () => {
    executandoPrograma = false;
    pausado = false;
    resetarPosicao();
    finalizarExecucao();
});

limparBtn.addEventListener('click', () => {
    sequenciaBlocos.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'programa-placeholder';
    placeholder.textContent = 'Solte os blocos aqui para criar seu programa';
    sequenciaBlocos.appendChild(placeholder);
    resetarPosicao();
});

novoLabirintoBtn.addEventListener('click', desenharLabirinto);

// Novos Event Listeners para Salvar e Abrir Programa
salvarBtn.addEventListener('click', () => {
    gerenciadorBlocos.salvarPrograma();
});

abrirBtn.addEventListener('click', () => {
    gerenciadorBlocos.abrirPrograma();
});

// Manipulação do Tutorial
botaoAjuda?.addEventListener('click', () => {
    tutorialElement.style.display = 'flex';
});

document.getElementById('fechar-tutorial')?.addEventListener('click', () => {
    tutorialElement.style.display = 'none';
});

// Inicialização do jogo
function inicializarJogo() {
    // Configurar área de soltura inicial
    const placeholder = document.createElement('div');
    placeholder.className = 'programa-placeholder';
    placeholder.textContent = 'Solte os blocos aqui para criar seu programa';
    sequenciaBlocos.appendChild(placeholder);

    // Desenhar labirinto inicial
    desenharLabirinto();

    // Configurar estados iniciais dos botões
    pausarBtn.disabled = true;
    pararBtn.disabled = true;
}

// Redimensionamento dos painéis (mantido conforme seu código)
function inicializarRedimensionamento() {
    const paineis = ['blocos-disponiveis', 'programa-container'];

    paineis.forEach(id => {
        const painel = document.getElementById(id);
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        painel.appendChild(handle);

        let isResizing = false;
        let startX, startWidth;

        handle.addEventListener('mousedown', e => {
            isResizing = true;
            startX = e.pageX;
            startWidth = painel.offsetWidth;
            handle.classList.add('active');

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                handle.classList.remove('active');
                document.removeEventListener('mousemove', handleMouseMove);
            }, { once: true });
        });

        function handleMouseMove(e) {
            if (!isResizing) return;

            const deltaX = e.pageX - startX;
            const newWidth = startWidth + deltaX;

            if (newWidth >= 250 && newWidth <= 800) {
                painel.style.width = `${newWidth}px`;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do jogo
    inicializarJogo();
    inicializarRedimensionamento();

    // Verificar suporte a drag and drop
    if (!('draggable' in document.createElement('div'))) {
        mostrarMensagem('Seu navegador não suporta arrastar e soltar. Por favor, use um navegador mais recente.', 'error');
    }

    // Impedir propagação de eventos de arraste nos inputs e selects
    document.querySelectorAll('input, select').forEach(elemento => {
        elemento.addEventListener('dragstart', e => e.stopPropagation());
        elemento.addEventListener('mousedown', e => e.stopPropagation());
    });
});

// Prevenção de perda acidental de programa
window.addEventListener('beforeunload', (e) => {
    if (sequenciaBlocos.children.length > 1) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Tratamento de erros globais
window.addEventListener('error', (e) => {
    console.error('Erro:', e.error);
    mostrarMensagem('Ocorreu um erro inesperado. Tente novamente.', 'error');
});

// Suporte a teclas de atalho
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) { // Ctrl ou Command
        switch(e.key.toLowerCase()) {
            case 'enter':
                e.preventDefault();
                if (!executarBtn.disabled) executarPrograma();
                break;
            case 'p':
                e.preventDefault();
                if (!pausarBtn.disabled) pausarBtn.click();
                break;
            case 's':
                e.preventDefault();
                if (!pararBtn.disabled) pararBtn.click();
                break;
            case 'n':
                e.preventDefault();
                novoLabirintoBtn.click();
                break;
        }
    }
});

// Exportar funções necessárias para outros módulos
export {
    executarPrograma,
    pausarBtn,
    pararBtn,
    executarBtn,
    mostrarMensagem,
    verificarVitoria,
    resetarPosicao
};

