// blocks.js

// Definição dos tipos de blocos
const TIPOS_BLOCOS = {
    MOVIMENTO: 'movimento',
    CONTROLE: 'controle',
    REPETICAO: 'repeticao',
    CONDICIONAL: 'condicional',
    ESPELHAMENTO: 'espelhamento',
    ESPERAR: 'esperar',
    AGUARDAR: 'aguardar', // Novo tipo de bloco
    VOLTAR_INICIO: 'voltarInicio',
    VERIFICAR_PAREDE: 'verificarParede' // Novo tipo de bloco
};

// Configuração dos blocos disponíveis
const BLOCOS_CONFIG = [
    // Blocos de Movimento
    {
        tipo: TIPOS_BLOCOS.MOVIMENTO,
        id: 'frente',
        texto: 'Andar para Frente',
        cor: '#4CAF50'
    },
    {
        tipo: TIPOS_BLOCOS.MOVIMENTO,
        id: 'tras',
        texto: 'Andar para Trás',
        cor: '#4CAF50'
    },
    {
        tipo: TIPOS_BLOCOS.MOVIMENTO,
        id: 'direita',
        texto: 'Virar à Direita',
        cor: '#4CAF50'
    },
    {
        tipo: TIPOS_BLOCOS.MOVIMENTO,
        id: 'esquerda',
        texto: 'Virar à Esquerda',
        cor: '#4CAF50'
    },

    // Blocos de Espelhamento
    {
        tipo: TIPOS_BLOCOS.ESPELHAMENTO,
        id: 'espelharH',
        texto: 'Espelhar Horizontal',
        cor: '#E91E63'
    },
    {
        tipo: TIPOS_BLOCOS.ESPELHAMENTO,
        id: 'espelharV',
        texto: 'Espelhar Vertical',
        cor: '#E91E63'
    },

    // Blocos de Repetição
    {
        tipo: TIPOS_BLOCOS.REPETICAO,
        id: 'repetir',
        texto: 'Repetir',
        cor: '#2196F3',
        temContainer: true,
        input: {
            tipo: 'number',
            min: 1,
            max: 10,
            valor: 2
        }
    },

    // Blocos de Controle
    {
        tipo: TIPOS_BLOCOS.CONTROLE,
        id: 'paraSempre',
        texto: 'Para Sempre',
        cor: '#ff9800',
        temContainer: true
    },

    // Blocos Condicionais
    {
        tipo: TIPOS_BLOCOS.CONDICIONAL,
        id: 'se',
        texto: 'Se',
        cor: '#9c27b0',
        temContainer: true,
        select: {
            opcoes: ['caminho livre', 'parede à frente']
        }
    },
    {
        tipo: TIPOS_BLOCOS.CONDICIONAL,
        id: 'senaoSe',
        texto: 'SENÃO SE',
        cor: '#FF9800',
        temContainer: true,
        select: {
            opcoes: ['caminho livre', 'parede à frente', 'algo mais']
        },
        podeAninhar: ['bloco-condicional']
    },
    {
        tipo: TIPOS_BLOCOS.CONDICIONAL,
        id: 'senao',
        texto: 'SENÃO',
        cor: '#FF5722',
        temContainer: true,
        podeAninhar: ['movimento', 'espelhamento', 'repeticao', 'controle', 'esperar', 'voltarInicio', 'aguardar']
    },

    // Novos Blocos para Verificar Paredes
    {
        tipo: TIPOS_BLOCOS.VERIFICAR_PAREDE,
        id: 'temParedeDireita',
        texto: 'Tem Parede Direita',
        cor: '#795548',
        temContainer: true,
        select: {
            opcoes: ['sim', 'não']
        },
        podeAninhar: ['movimento', 'espelhamento', 'repeticao', 'controle', 'esperar', 'voltarInicio', 'aguardar']
    },
    {
        tipo: TIPOS_BLOCOS.VERIFICAR_PAREDE,
        id: 'temParedeEsquerda',
        texto: 'Tem Parede Esquerda',
        cor: '#6D4C41',
        temContainer: true,
        select: {
            opcoes: ['sim', 'não']
        },
        podeAninhar: ['movimento', 'espelhamento', 'repeticao', 'controle', 'esperar', 'voltarInicio', 'aguardar']
    },
    {
        tipo: TIPOS_BLOCOS.VERIFICAR_PAREDE,
        id: 'temParedeTras',
        texto: 'Tem Parede Trás',
        cor: '#5D4037',
        temContainer: true,
        select: {
            opcoes: ['sim', 'não']
        },
        podeAninhar: ['movimento', 'espelhamento', 'repeticao', 'controle', 'esperar', 'voltarInicio', 'aguardar']
    },

    // Novo Bloco para Aguardar Milissegundos
    {
        tipo: TIPOS_BLOCOS.AGUARDAR,
        id: 'aguardar',
        texto: 'Aguardar X ms',
        cor: '#3F51B5',
        temContainer: false,
        input: {
            tipo: 'number',
            min: 100,
            max: 10000,
            valor: 1000
        }
    },
    {
        tipo: TIPOS_BLOCOS.AUDIO,
        id: 'emitirTom',
        texto: 'Emitir Tom de X Hz',
        cor: '#FF9800',
        temContainer: false,
        input: {
            tipo: 'number',
            min: 20,
            max: 20000,
            valor: 440
        }
    },
    {
        tipo: TIPOS_BLOCOS.AUDIO,
        id: 'pararTom',
        texto: 'Parar Tom',
        cor: '#FF5722',
        temContainer: false
    }
];

// Classe para gerenciar os blocos
class GerenciadorBlocos {
    constructor() {
        this.blocosDisponiveis = new Set();
        this.blocoArrastado = null;
        this.inicializarBlocos();
        this.configurarLixeira();
        this.configurarDragDrop();
        this.configurarSalvarAbrir(); // Configurar botões de salvar e abrir
    }

    inicializarBlocos() {
        const container = document.getElementById('blocos-disponiveis');

        // Criar fragmento para inserção eficiente
        const fragment = document.createDocumentFragment();

        // Agrupar blocos por tipo
        const blocosPorTipo = BLOCOS_CONFIG.reduce((acc, bloco) => {
            if (!acc[bloco.tipo]) acc[bloco.tipo] = [];
            acc[bloco.tipo].push(bloco);
            return acc;
        }, {});

        // Criar grupos de blocos
        Object.entries(blocosPorTipo).forEach(([tipo, blocos]) => {
            const grupo = document.createElement('div');
            grupo.className = 'grupo-blocos';
            grupo.innerHTML = `<h3>${this.formatarTipoBloco(tipo)}</h3>`;

            const blocoFragment = document.createDocumentFragment();

            blocos.forEach(config => {
                const bloco = this.criarBloco(config);
                blocoFragment.appendChild(bloco);
                this.blocosDisponiveis.add(config.id);
            });

            grupo.appendChild(blocoFragment);
            fragment.appendChild(grupo);
        });

        container.appendChild(fragment);
    }

    formatarTipoBloco(tipo) {
        const nomes = {
            movimento: 'Movimentos',
            controle: 'Controle',
            repeticao: 'Repetição',
            condicional: 'Condicionais',
            espelhamento: 'Espelhamento',
            esperar: 'Esperar',
            aguardar: 'Aguardar',
            voltarInicio: 'Voltar ao Início',
            verificarParede: 'Verificar Paredes' // Nome para novos blocos
        };
        return nomes[tipo] || tipo;
    }

    criarBloco(config) {
        const bloco = document.createElement('div');
        bloco.className = `bloco bloco-${config.tipo}`;
        bloco.dataset.tipo = config.id;
        bloco.draggable = true;
        bloco.style.backgroundColor = config.cor;

        const handle = document.createElement('div');
        handle.className = 'bloco-handle';
        handle.innerHTML = '⋮';
        bloco.appendChild(handle);

        const conteudo = document.createElement('div');
        conteudo.className = 'bloco-conteudo';

        const span = document.createElement('span');
        span.textContent = config.texto;
        conteudo.appendChild(span);

        if (config.input) {
            const input = document.createElement('input');
            input.type = config.input.tipo;
            input.min = config.input.min;
            input.max = config.input.max;
            input.value = config.input.valor;
            conteudo.appendChild(document.createTextNode(' '));
            conteudo.appendChild(input);
            conteudo.appendChild(document.createTextNode(config.id === 'esperar' || config.id === 'aguardar' || config.id === 'emitirTom' ? (config.id === 'esperar' ? ' segundos' : (config.id === 'emitirTom' ? ' Hz' : ' milissegundos')) : ' vezes'));
        }

        if (config.select) {
            const select = document.createElement('select');
            config.select.opcoes.forEach(opcao => {
                const option = document.createElement('option');
                option.value = opcao;
                option.textContent = opcao;
                select.appendChild(option);
            });
            conteudo.appendChild(document.createTextNode(' '));
            conteudo.appendChild(select);
        }

        bloco.appendChild(conteudo);

        if (config.temContainer) {
            const container = document.createElement('div');
            container.className = 'bloco-container drop-zone';
            const placeholder = document.createElement('div');
            placeholder.className = 'container-placeholder';
            placeholder.textContent = 'Arraste blocos aqui';
            container.appendChild(placeholder);
            bloco.appendChild(container);
        }

        return bloco;
    }

    configurarLixeira() {
        const lixeira = document.getElementById('lixeira');

        if (!lixeira) return; // Evita erros se a lixeira não existir

        lixeira.addEventListener('dragover', e => {
            e.preventDefault();
            lixeira.classList.add('lixeira-ativa');
        });

        lixeira.addEventListener('dragleave', () => {
            lixeira.classList.remove('lixeira-ativa');
        });

        lixeira.addEventListener('drop', e => {
            e.preventDefault();
            lixeira.classList.remove('lixeira-ativa');

            if (this.blocoArrastado) {
                this.blocoArrastado.remove();
                this.blocoArrastado = null;
            }
        });
    }

    configurarDragDrop() {
        const blocosDisponiveisContainer = document.getElementById('blocos-disponiveis');
        const sequenciaBlocos = document.getElementById('sequencia-blocos');

        // Delegação de eventos para dragstart e dragend nos blocos disponíveis
        blocosDisponiveisContainer.addEventListener('dragstart', this.handleDragStart.bind(this));
        blocosDisponiveisContainer.addEventListener('dragend', this.handleDragEnd.bind(this));

        // Delegação de eventos para dragstart e dragend nos blocos dentro de "Meu Programa"
        sequenciaBlocos.addEventListener('dragstart', this.handleDragStart.bind(this));
        sequenciaBlocos.addEventListener('dragend', this.handleDragEnd.bind(this));

        // Delegação de eventos para dragover e drop na área "Meu Programa"
        sequenciaBlocos.addEventListener('dragover', this.handleDragOver.bind(this));
        sequenciaBlocos.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleDragStart(e) {
        const bloco = e.target.closest('.bloco');
        if (bloco) {
            bloco.classList.add('dragging');
            e.dataTransfer.setData('text/plain', bloco.dataset.tipo);
            this.blocoArrastado = bloco;
        }
    }

    handleDragEnd(e) {
        const bloco = e.target.closest('.bloco');
        if (bloco) {
            bloco.classList.remove('dragging');
            this.blocoArrastado = null;
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone) return;

        dropZone.classList.remove('drag-over');

        if (this.blocoArrastado) {
            const tipoBloco = e.dataTransfer.getData('text/plain');
            const configBloco = BLOCOS_CONFIG.find(bloco => bloco.id === tipoBloco);

            if (!configBloco) return;

            // Verificar se o dropZone permite o tipo de bloco
            const parentBloco = dropZone.closest('.bloco');
            if (parentBloco) {
                const parentTipo = parentBloco.dataset.tipo;
                const parentConfig = BLOCOS_CONFIG.find(bloco => bloco.id === parentTipo);
                if (parentConfig && parentConfig.podeAninhar) {
                    const tipoBlocoPai = parentConfig.tipo;
                    const tipoBlocoFilho = configBloco.tipo;
                    if (!parentConfig.podeAninhar.includes(tipoBlocoFilho)) {
                        // Tipo de bloco não permitido dentro do bloco pai
                        mostrarMensagem(`Não é permitido adicionar blocos de tipo "${tipoBloco}" aqui.`, 'error');
                        return;
                    }
                }
            }

            // Se o bloco for da área disponível, clone-o. Caso contrário, mova-o.
            const isFromAvailable = this.blocoArrastado.closest('#blocos-disponiveis') !== null;

            let novoBloco;
            if (isFromAvailable) {
                novoBloco = this.clonarBloco(this.blocoArrastado);
            } else {
                novoBloco = this.blocoArrastado;
            }

            // Remover placeholder se existir
            const placeholder = dropZone.querySelector('.container-placeholder');
            if (placeholder) {
                placeholder.remove();
            }

            dropZone.appendChild(novoBloco);
        }
    }

    clonarBloco(blocoOriginal) {
        const clone = blocoOriginal.cloneNode(true);
        clone.classList.remove('dragging');
        return clone;
    }

    configurarSalvarAbrir() {
        const salvarBtn = document.getElementById('salvar-programa');
        const abrirBtn = document.getElementById('abrir-programa');
        const inputAbrir = document.getElementById('input-abrir-programa');

        // Salvar Programa
        salvarBtn.addEventListener('click', () => {
            const programa = this.serializarPrograma();
            const blob = new Blob([JSON.stringify(programa, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'programa_labirinto.json';
            a.click();
            URL.revokeObjectURL(url);
            mostrarMensagem('Programa salvo com sucesso!', 'success');
        });

        // Abrir Programa
        abrirBtn.addEventListener('click', () => {
            inputAbrir.click();
        });

        inputAbrir.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const programa = JSON.parse(event.target.result);
                    this.carregarPrograma(programa);
                    mostrarMensagem('Programa carregado com sucesso!', 'success');
                } catch (error) {
                    mostrarMensagem('Erro ao carregar o programa. Verifique o arquivo.', 'error');
                }
            };
            reader.readAsText(file);
        });
    }

    serializarPrograma() {
        const sequenciaBlocos = document.getElementById('sequencia-blocos');
        const blocos = Array.from(sequenciaBlocos.children).filter(el => el.classList.contains('bloco'));

        const serializado = blocos.map(bloco => this.serializarBloco(bloco));
        return serializado;
    }

    serializarBloco(bloco) {
        const tipo = bloco.dataset.tipo;
        const configBloco = BLOCOS_CONFIG.find(b => b.id === tipo);
        const blocoData = {
            tipo: tipo,
            texto: configBloco.texto,
            cor: configBloco.cor
        };

        // Capturar input
        if (configBloco.input) {
            const input = bloco.querySelector('input');
            blocoData.valor = input ? input.value : configBloco.input.valor;
        }

        // Capturar select
        if (configBloco.select) {
            const select = bloco.querySelector('select');
            blocoData.selecionado = select ? select.value : configBloco.select.opcoes[0];
        }

        // Verificar se tem container
        if (configBloco.temContainer) {
            const container = bloco.querySelector('.bloco-container');
            const filhos = Array.from(container.children).filter(el => el.classList.contains('bloco'));
            blocoData.filhos = filhos.map(filho => this.serializarBloco(filho));
        }

        return blocoData;
    }

    carregarPrograma(programa) {
        const sequenciaBlocos = document.getElementById('sequencia-blocos');
        sequenciaBlocos.innerHTML = ''; // Limpar programa existente

        programa.forEach(blocoData => {
            const bloco = this.criarBlocoDeserializado(blocoData);
            if (bloco) {
                sequenciaBlocos.appendChild(bloco);
            }
        });

        // Remover placeholder se existir
        const placeholder = sequenciaBlocos.querySelector('.programa-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }

    criarBlocoDeserializado(blocoData) {
        const configBloco = BLOCOS_CONFIG.find(b => b.id === blocoData.tipo);
        if (!configBloco) return null;

        const bloco = document.createElement('div');
        bloco.className = `bloco bloco-${configBloco.tipo}`;
        bloco.dataset.tipo = configBloco.id;
        bloco.draggable = true;
        bloco.style.backgroundColor = configBloco.cor;

        const handle = document.createElement('div');
        handle.className = 'bloco-handle';
        handle.innerHTML = '⋮';
        bloco.appendChild(handle);

        const conteudo = document.createElement('div');
        conteudo.className = 'bloco-conteudo';

        const span = document.createElement('span');
        span.textContent = configBloco.texto;
        conteudo.appendChild(span);

        if (configBloco.input) {
            const input = document.createElement('input');
            input.type = configBloco.input.tipo;
            input.min = configBloco.input.min;
            input.max = configBloco.input.max;
            input.value = blocoData.valor || configBloco.input.valor;
            conteudo.appendChild(document.createTextNode(' '));
            conteudo.appendChild(input);
            conteudo.appendChild(document.createTextNode(configBloco.id === 'esperar' || configBloco.id === 'aguardar' || configBloco.id === 'emitirTom' ? (configBloco.id === 'esperar' ? ' segundos' : (configBloco.id === 'emitirTom' ? ' Hz' : ' milissegundos')) : ' vezes'));
        }

        if (configBloco.select) {
            const select = document.createElement('select');
            configBloco.select.opcoes.forEach(opcao => {
                const option = document.createElement('option');
                option.value = opcao;
                option.textContent = opcao;
                if (opcao === (blocoData.selecionado || configBloco.select.opcoes[0])) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
            conteudo.appendChild(document.createTextNode(' '));
            conteudo.appendChild(select);
        }

        bloco.appendChild(conteudo);

        if (configBloco.temContainer) {
            const container = document.createElement('div');
            container.className = 'bloco-container drop-zone';
            if (blocoData.filhos && blocoData.filhos.length > 0) {
                blocoData.filhos.forEach(filhoData => {
                    const filho = this.criarBlocoDeserializado(filhoData);
                    if (filho) {
                        container.appendChild(filho);
                    }
                });
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'container-placeholder';
                placeholder.textContent = 'Arraste blocos aqui';
                container.appendChild(placeholder);
            }
            bloco.appendChild(container);
        }

        return bloco;
    }
}

// Função para mostrar mensagens (para ser usada fora da classe)
function mostrarMensagem(texto, tipo) {
    const mensagemElement = document.getElementById('mensagem');
    mensagemElement.textContent = texto;
    mensagemElement.className = tipo;
    mensagemElement.style.display = 'block';

    setTimeout(() => {
        mensagemElement.style.display = 'none';
    }, 3000);
}

// Exportar para uso em main.js
export const gerenciadorBlocos = new GerenciadorBlocos();
export { mostrarMensagem };

