// blocks.js
import { i18nThemeManager } from './i18n-theme-manager.js';
import touchManager from './touch-manager.js';

// Definição dos tipos de blocos
const TIPOS_BLOCOS = {
    LOGICO: 'logico',
    MOVIMENTO: 'movimento',      // Movimento e espelhamento
    CONTROLE: 'controle',       // Controle de fluxo (Se, Repetir, Para Sempre)
    SENSORES: 'sensores',       // Verificações de parede e condições
    EFEITOS: 'efeitos'         // Áudio e espera
};

// Configuração dos blocos
let BLOCOS_CONFIG = [];

function atualizarBlocosConfig() {
    BLOCOS_CONFIG = [
        // Blocos de Movimento
        {
            tipo: TIPOS_BLOCOS.MOVIMENTO,
            id: 'frente',
            texto: i18nThemeManager.translate('blocks.moveForward'),
            cor: '#4CAF50'
        },
        {
            tipo: TIPOS_BLOCOS.MOVIMENTO,
            id: 'tras',
            texto: i18nThemeManager.translate('blocks.moveBackward'),
            cor: '#4CAF50'
        },
        {
            tipo: TIPOS_BLOCOS.MOVIMENTO,
            id: 'direita',
            texto: i18nThemeManager.translate('blocks.turnRight'),
            cor: '#4CAF50'
        },
        {
            tipo: TIPOS_BLOCOS.MOVIMENTO,
            id: 'esquerda',
            texto: i18nThemeManager.translate('blocks.turnLeft'),
            cor: '#4CAF50'
        },
        // Blocos de Espelhamento
        {
            tipo: TIPOS_BLOCOS.MOVIMENTO,
            id: 'espelharH',
            texto: i18nThemeManager.translate('blocks.mirrorH'),
            cor: '#E91E63'
        },
        {
            tipo: TIPOS_BLOCOS.MOVIMENTO,
            id: 'espelharV',
            texto: i18nThemeManager.translate('blocks.mirrorV'),
            cor: '#E91E63'
        },
        // Blocos de Repetição
        {
            tipo: TIPOS_BLOCOS.CONTROLE,
            id: 'repetir',
            texto: i18nThemeManager.translate('blocks.repeat'),
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
            texto: i18nThemeManager.translate('blocks.forever'),
            cor: '#ff9800',
            temContainer: true
        },
        // Blocos Condicionais
        {
            tipo: TIPOS_BLOCOS.CONTROLE,
            id: 'se',
            texto: i18nThemeManager.translate('blocks.if'),
            cor: '#9c27b0',
            temContainer: true,
            select: {
                opcoes: ['caminho livre', 'parede à frente']
            }
        },
        {
            tipo: TIPOS_BLOCOS.CONTROLE,
            id: 'senaoSe',
            texto: i18nThemeManager.translate('blocks.elseIf'),
            cor: '#FF9800',
            temContainer: true,
            select: {
                opcoes: ['caminho livre', 'parede à frente']
            }
        },
        {
            tipo: TIPOS_BLOCOS.CONTROLE,
            id: 'senao',
            texto: i18nThemeManager.translate('blocks.else'),
            cor: '#FF5722',
            temContainer: true,
            podeAninhar: ['movimento', 'espelhamento', 'repeticao', 'controle', 'esperar', 'voltarInicio', 'aguardar']
        },
        // Verificação de Paredes
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'temParedeDireita',
            texto: i18nThemeManager.translate('blocks.checkRightWall'),
            cor: '#795548',
            temContainer: true,
            select: {
                opcoes: ['sim', 'não']
            }
        },
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'temParedeEsquerda',
            texto: i18nThemeManager.translate('blocks.checkLeftWall'),
            cor: '#6D4C41',
            temContainer: true,
            select: {
                opcoes: ['sim', 'não']
            }
        },
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'temParedeTras',
            texto: i18nThemeManager.translate('blocks.checkBackWall'),
            cor: '#5D4037',
            temContainer: true,
            select: {
                opcoes: ['sim', 'não']
            }
        },
        // Aguardar e Áudio
        {
            tipo: TIPOS_BLOCOS.CONTROLE,
            id: 'aguardar',
            texto: i18nThemeManager.translate('blocks.waitMs'),
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
            tipo: TIPOS_BLOCOS.EFEITOS,
            id: 'emitirTom',
            texto: i18nThemeManager.translate('blocks.emitTone'),
            cor: '#FF9800',
            temContainer: false,
            inputs: {
                frequencia: {
                    tipo: 'number',
                    min: 20,
                    max: 20000,
                    valor: 440,
                    label: 'Frequência',
                    suffix: 'Hz'
                },
                duracao: {
                    tipo: 'number',
                    min: 100,
                    max: 5000,
                    valor: 1000,
                    label: 'Duração',
                    suffix: 'ms'
                },
                volume: {
                    tipo: 'range',
                    min: 0,
                    max: 100,
                    valor: 50,
                    label: 'Volume',
                    suffix: '%'
                }
            },
            presets: [
                { nome: 'Dó', frequencia: 262 },
                { nome: 'Mi', frequencia: 330 },
                { nome: 'Sol', frequencia: 392 }
            ]
        },
        {
            tipo: TIPOS_BLOCOS.EFEITOS,
            id: 'pararTom',
            texto: i18nThemeManager.translate('blocks.stopTone'),
            cor: '#FF5722',
            temContainer: false
        },
        // Bloco SE lógico
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'seLogico',
            texto: i18nThemeManager.translate('blocks.logicalIf'),
            cor: '#9c27b0',
            temContainer: true,
            temContainerLogico: true,
            containerLogicoTitulo: i18nThemeManager.translate('blocks.condition'),
            temContainerExecucao: true
        },

        // Operadores Lógicos AND e OR
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'and',
            texto: 'AND',
            cor: '#FF5722',
            temContainer: false,
            temDoisContainers: true,
            containerTitulos: ['Condição 1', 'Condição 2']
        },
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'or',
            texto: 'OR',
            cor: '#FF5722',
            temContainer: false,
            temDoisContainers: true,
            containerTitulos: ['Condição 1', 'Condição 2']
        },

        // Verificadores de Parede Lógicos
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'verificarParedeFrente',
            texto: i18nThemeManager.translate('blocks.checkWallFront'),
            cor: '#795548',
            retornaLogico: true
        },{
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'verificarParedeDireita',
            texto: i18nThemeManager.translate('blocks.checkWallRight'),
            cor: '#795548',
            retornaLogico: true
        },
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'verificarParedeEsquerda',
            texto: i18nThemeManager.translate('blocks.checkWallLeft'),
            cor: '#795548',
            retornaLogico: true
        },
        {
            tipo: TIPOS_BLOCOS.LOGICO,
            id: 'verificarChegada',
            texto: i18nThemeManager.translate('blocks.checkFlag'),
            cor: '#795548',
            retornaLogico: true
        },
        {
            tipo: TIPOS_BLOCOS.CONTROLE,
            id: 'pararRobo',
            texto: i18nThemeManager.translate('blocks.stopRobot'),
            cor: '#f44336',
            temContainer: false
        }
    ];
}

// Move mostrarMensagem outside the class
function mostrarMensagem(texto, tipo) {
    const mensagemElement = document.getElementById('mensagem');
    if (!mensagemElement) return;

    mensagemElement.textContent = texto;
    mensagemElement.className = tipo;
    mensagemElement.style.display = 'block';

    mensagemElement.animate([
        { transform: 'translateY(-20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
    ], {
        duration: 300,
        easing: 'ease-out'
    });

    setTimeout(() => {
        mensagemElement.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-20px)', opacity: 0 }
        ], {
            duration: 300,
            easing: 'ease-in'
        }).onfinish = () => {
            mensagemElement.style.display = 'none';
        };
    }, 3000);
}

class GerenciadorBlocos {
    constructor() {
        this.blocosDisponiveis = new Set();
        this.blocoArrastado = null;
        this.touchSupported = 'ontouchstart' in window;
        this.isDragging = false;
        this.draggedElement = null;
        this.ghostElement = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchOffsetX = 0;
        this.touchOffsetY = 0;
        
        // Inicializar após carregar traduções
        i18nThemeManager.initialize().then(() => {
            atualizarBlocosConfig();
            this.inicializarBlocos();
            this.configurarLixeira();
            this.configurarDragDrop();
            this.configurarSalvarAbrir();
            this.configurarTouch();
        });

        // Listener para mudanças de idioma
        window.addEventListener('languageChanged', () => {
            atualizarBlocosConfig();
            this.atualizarTextosBlocos();
        });
    }

    // Método auxiliar para melhorar a visualização durante o arraste
    // Atualizar o método configurarDropZoneUnica para incluir a verificação de container
    configurarDropZoneUnica(zone) {
        if (!zone.dataset.dropzoneConfigured) {
            let lastHighlightedBlock = null;

            const clearHighlights = () => {
                if (lastHighlightedBlock) {
                    lastHighlightedBlock.classList.remove('dropping-above', 'dropping-below');
                    lastHighlightedBlock = null;
                }
                zone.classList.remove('drag-over');
            };

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!this.blocoArrastado) return;

                const dropZone = e.target.closest('.drop-zone');
                if (!dropZone) return;

                // Verificar se é um container e se está em Meu Programa
                const isContainerDrop = dropZone.classList.contains('bloco-container') || 
                                      dropZone.classList.contains('bloco-container-logico');
                const isInMeuPrograma = dropZone.closest('#sequencia-blocos') !== null;

                // Se for um container e não estiver em Meu Programa, não mostrar indicador de drop
                if (isContainerDrop && !isInMeuPrograma) {
                    clearHighlights();
                    e.dataTransfer.dropEffect = 'none';
                    return;
                }

                clearHighlights();

                const mouseY = e.clientY;
                const blocos = Array.from(dropZone.children).filter(el => 
                    el.classList.contains('bloco') && el !== this.blocoArrastado
                );

                if (blocos.length && !isContainerDrop) {
                    let targetBlock = null;
                    let position = 'above';

                    for (const block of blocos) {
                        const rect = block.getBoundingClientRect();
                        const blockMiddle = rect.top + (rect.height / 2);
                        
                        if (mouseY <= blockMiddle) {
                            targetBlock = block;
                            position = 'above';
                            break;
                        } else if (mouseY > blockMiddle && mouseY <= rect.bottom) {
                            targetBlock = block;
                            position = 'below';
                            break;
                        }
                    }

                    if (!targetBlock && blocos.length > 0) {
                        targetBlock = blocos[blocos.length - 1];
                        position = 'below';
                    }

                    if (targetBlock) {
                        lastHighlightedBlock = targetBlock;
                        targetBlock.classList.add(`dropping-${position}`);
                    }
                } else if (isInMeuPrograma || !isContainerDrop) {
                    dropZone.classList.add('drag-over');
                }

                e.dataTransfer.dropEffect = this.isBlocoDisponivel(this.blocoArrastado) ? 'copy' : 'move';
            });

            zone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearHighlights();
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearHighlights();
                this.handleDrop(e);
            });

            zone.dataset.dropzoneConfigured = 'true';
        }
    }
    
    inicializarBlocos() {
        const container = document.getElementById('blocos-disponiveis');
        container.innerHTML = '';
        
        const sequenciaBlocos = document.getElementById('sequencia-blocos');
        if (sequenciaBlocos) {
            this.configurarDropZoneUnica(sequenciaBlocos);
        }
        
        const fragment = document.createDocumentFragment();
        const blocosPorTipo = BLOCOS_CONFIG.reduce((acc, bloco) => {
            if (!acc[bloco.tipo]) acc[bloco.tipo] = [];
            acc[bloco.tipo].push(bloco);
            return acc;
        }, {});

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
        this.configurarDropZones();
    }

    formatarTipoBloco(tipo) {
        return i18nThemeManager.translate(`blocks.${tipo.toLowerCase()}`);
    }

    atualizarTextosBlocos() {
        document.querySelectorAll('.bloco').forEach(bloco => {
            const tipo = bloco.dataset.tipo;
            const config = BLOCOS_CONFIG.find(b => b.id === tipo);
            if (config) {
                const texto = bloco.querySelector('span');
                if (texto) {
                    texto.textContent = config.texto;
                }
            }
        });
    }

    criarBloco(config) {
    // Se for o bloco de tom, usar implementação específica
    if (config.id === 'emitirTom') {
        const bloco = document.createElement('div');
        bloco.className = `bloco bloco-${config.tipo} bloco-tom`;
        bloco.dataset.tipo = config.id;
        bloco.draggable = !this.touchSupported;
        bloco.style.backgroundColor = config.cor;

        // Adicionar manipulador
        const handle = document.createElement('div');
        handle.className = 'bloco-handle';
        handle.innerHTML = '⋮';
        bloco.appendChild(handle);

        // Container principal
        const conteudo = document.createElement('div');
        conteudo.className = 'bloco-conteudo';

        // Título do bloco
        const titulo = document.createElement('span');
        titulo.textContent = config.texto;
        conteudo.appendChild(titulo);

        // Container para inputs
        const inputsContainer = document.createElement('div');
        inputsContainer.className = 'inputs-container';

        // Criar inputs
        Object.entries(config.inputs).forEach(([key, input]) => {
            const grupo = document.createElement('div');
            grupo.className = 'input-group';

            const label = document.createElement('label');
            label.textContent = input.label;
            grupo.appendChild(label);

            const inputEl = document.createElement('input');
            inputEl.type = input.tipo;
            inputEl.min = input.min;
            inputEl.max = input.max;
            inputEl.value = input.valor;
            inputEl.className = 'touch-input';
            
            // Prevenir propagação de eventos
            inputEl.addEventListener('mousedown', e => e.stopPropagation());
            inputEl.addEventListener('touchstart', e => e.stopPropagation());
            
            grupo.appendChild(inputEl);

            if (input.suffix) {
                const suffix = document.createElement('span');
                suffix.className = 'input-suffix';
                suffix.textContent = input.suffix;
                grupo.appendChild(suffix);
            }

            inputsContainer.appendChild(grupo);
        });

        // Adicionar presets de tom
        if (config.presets) {
            const presetsContainer = document.createElement('div');
            presetsContainer.className = 'tone-presets';
            
            config.presets.forEach(preset => {
                const button = document.createElement('button');
                button.className = 'tone-preset';
                button.textContent = preset.nome;
                button.onclick = (e) => {
                    e.stopPropagation();
                    const freqInput = inputsContainer.querySelector('input[type="number"]');
                    if (freqInput) {
                        freqInput.value = preset.frequencia;
                    }
                };
                presetsContainer.appendChild(button);
            });

            inputsContainer.appendChild(presetsContainer);
        }

        conteudo.appendChild(inputsContainer);
        bloco.appendChild(conteudo);

        return bloco;
    }

    // Implementação existente para outros blocos
    const bloco = document.createElement('div');
    bloco.className = `bloco bloco-${config.tipo}`;
    bloco.dataset.tipo = config.id;

    if (config.retornaLogico) {
        bloco.dataset.retornaLogico = "true";
    }

    bloco.draggable = !this.touchSupported;
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
        input.className = 'touch-input';
        
        input.addEventListener('mousedown', e => e.stopPropagation());
        input.addEventListener('touchstart', e => e.stopPropagation());
        
        conteudo.appendChild(document.createTextNode(' '));
        conteudo.appendChild(input);
        
        const unidade = this.getUnidade(config.id);
        if (unidade) {
            conteudo.appendChild(document.createTextNode(unidade));
        }
    }

    if (config.select) {
        const select = document.createElement('select');
        select.className = 'touch-select';
        
        select.addEventListener('mousedown', e => e.stopPropagation());
        select.addEventListener('touchstart', e => e.stopPropagation());
        
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
        placeholder.textContent = i18nThemeManager.translate('interface.dragHere');
        container.appendChild(placeholder);
        bloco.appendChild(container);
    }

    if (config.temContainerLogico) {
        const containerLogico = document.createElement('div');
        containerLogico.className = 'bloco-container-logico drop-zone';
        
        const titulo = document.createElement('div');
        titulo.className = 'container-titulo';
        titulo.textContent = config.containerLogicoTitulo;
        containerLogico.appendChild(titulo);
        
        const placeholder = document.createElement('div');
        placeholder.className = 'container-placeholder';
        placeholder.textContent = i18nThemeManager.translate('interface.dropLogicBlocks');
        containerLogico.appendChild(placeholder);
        
        bloco.appendChild(containerLogico);
    }

    if (config.temDoisContainers) {
        config.containerTitulos.forEach(titulo => {
            const container = document.createElement('div');
            container.className = 'bloco-container-logico drop-zone';
            
            const tituloEl = document.createElement('div');
            tituloEl.className = 'container-titulo';
            tituloEl.textContent = titulo;
            container.appendChild(tituloEl);
            
            const placeholder = document.createElement('div');
            placeholder.className = 'container-placeholder';
            placeholder.textContent = i18nThemeManager.translate('interface.dropLogicBlocks');
            container.appendChild(placeholder);
            
            bloco.appendChild(container);
        });
    }

    return bloco;
}

    getUnidade(id) {
        switch(id) {
            case 'esperar': return ' ' + i18nThemeManager.translate('blocks.seconds');
            case 'aguardar': return ' ' + i18nThemeManager.translate('blocks.ms');
            case 'emitirTom': return ' Hz';
            case 'repetir': return ' ' + i18nThemeManager.translate('blocks.times');
            default: return '';
        }
    }

    encontrarDropZone(x, y) {
        const elementos = document.elementsFromPoint(x, y);
        return elementos.find(el => el.classList.contains('drop-zone'));
    }

    configurarDropZones() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            this.configurarDropZoneUnica(zone);
        });
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone || !this.blocoArrastado) return;

        // Verificar se está tentando adicionar em um container
        const isContainerDrop = dropZone.classList.contains('bloco-container') || 
                              dropZone.classList.contains('bloco-container-logico');

        // Verificar se está dentro de Meu Programa
        const isInMeuPrograma = dropZone.closest('#sequencia-blocos') !== null;

        // Se for um container e não estiver em Meu Programa, não permitir o drop
        if (isContainerDrop && !isInMeuPrograma) {
            dropZone.classList.remove('drag-over');
            return;
        }

        // Limpar classes de indicação
        dropZone.classList.remove('drag-over');

        try {
            const isFromAvailable = this.isBlocoDisponivel(this.blocoArrastado);
            let novoBloco;

            if (isFromAvailable) {
                novoBloco = this.clonarBloco(this.blocoArrastado);
            } else {
                novoBloco = this.blocoArrastado;
            }

            // Remover estilos residuais do drag
            novoBloco.style.position = '';
            novoBloco.style.left = '';
            novoBloco.style.top = '';
            novoBloco.classList.remove('dragging');

            if (!isContainerDrop) {
                const mouseY = e.clientY || (e.touches && e.touches[0].clientY);
                
                // Encontrar todos os blocos válidos na dropzone
                const blocos = Array.from(dropZone.children).filter(el => 
                    el.classList.contains('bloco') && el !== novoBloco
                );

                if (blocos.length === 0) {
                    dropZone.appendChild(novoBloco);
                } else {
                    // Encontrar o bloco alvo e sua posição
                    let targetBlock = null;
                    let insertBefore = true;

                    for (const block of blocos) {
                        const rect = block.getBoundingClientRect();
                        const blockMiddle = rect.top + (rect.height / 2);
                        
                        if (mouseY <= blockMiddle) {
                            targetBlock = block;
                            insertBefore = true;
                            break;
                        } else if (mouseY > blockMiddle && mouseY <= rect.bottom) {
                            targetBlock = block;
                            insertBefore = false;
                            break;
                        }
                    }

                    // Se não encontrou um bloco específico, usar o último
                    if (!targetBlock && blocos.length > 0) {
                        targetBlock = blocos[blocos.length - 1];
                        insertBefore = false;
                    }

                    // Realizar a troca de posições
                    if (targetBlock) {
                        const currentIndex = Array.from(dropZone.children).indexOf(novoBloco);
                        const targetIndex = Array.from(dropZone.children).indexOf(targetBlock);

                        // Se o bloco já está na dropzone
                        if (currentIndex !== -1) {
                            novoBloco.remove();
                            
                            if (insertBefore) {
                                dropZone.insertBefore(novoBloco, targetBlock);
                            } else {
                                if (targetBlock.nextSibling) {
                                    dropZone.insertBefore(novoBloco, targetBlock.nextSibling);
                                } else {
                                    dropZone.appendChild(novoBloco);
                                }
                            }
                        } else {
                            if (insertBefore) {
                                dropZone.insertBefore(novoBloco, targetBlock);
                            } else {
                                if (targetBlock.nextSibling) {
                                    dropZone.insertBefore(novoBloco, targetBlock.nextSibling);
                                } else {
                                    dropZone.appendChild(novoBloco);
                                }
                            }
                        }
                    } else {
                        dropZone.appendChild(novoBloco);
                    }
                }
            } else {
                // Inserção em container (só permitido em Meu Programa)
                const placeholder = dropZone.querySelector('.container-placeholder, .programa-placeholder');
                if (placeholder) {
                    placeholder.remove();
                }
                dropZone.appendChild(novoBloco);
            }

            // Animar entrada
            novoBloco.style.opacity = '0';
            novoBloco.style.transform = 'translateY(-10px)';
            requestAnimationFrame(() => {
                novoBloco.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                novoBloco.style.opacity = '1';
                novoBloco.style.transform = 'translateY(0)';
                
                novoBloco.addEventListener('transitionend', () => {
                    novoBloco.style.transition = '';
                }, { once: true });
            });

            // Configurar drop zones para containers se necessário
            if (novoBloco.querySelector('.drop-zone')) {
                const containers = novoBloco.querySelectorAll('.drop-zone');
                containers.forEach(container => {
                    this.configurarDropZoneUnica(container);
                });
            }
        } catch (error) {
            console.error('Erro ao soltar bloco:', error);
            mostrarMensagem(i18nThemeManager.translate('messages.error.unexpected'), 'error');
        }
    }

    configurarDragDrop() {
        const blocosDisponiveisContainer = document.getElementById('blocos-disponiveis');
        const sequenciaBlocos = document.getElementById('sequencia-blocos');

        if (this.touchSupported) {
            this.configurarTouchDragDrop(blocosDisponiveisContainer, sequenciaBlocos);
        } else {
            this.configurarMouseDragDrop(blocosDisponiveisContainer, sequenciaBlocos);
        }

        this.configurarDropZones();

        // Observer para novas drop zones
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList?.contains('drop-zone')) {
                            this.configurarDropZoneUnica(node);
                        }
                        const dropZones = node.querySelectorAll?.('.drop-zone');
                        if (dropZones) {
                            dropZones.forEach(zone => this.configurarDropZoneUnica(zone));
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    configurarTouch() {
        if (!this.touchSupported) return;

        touchManager.initialize(document.body, {
            dragSelector: '.bloco',
            handleSelector: '.bloco-handle',
            dropZoneSelector: '.drop-zone',
            onDragStart: (elemento) => {
                if (!this.isBlocoDisponivel(elemento)) {
                    this.blocoArrastado = elemento;
                    elemento.classList.add('dragging');
                }
            },
            onDrag: (elemento, x, y) => {
                this.atualizarGhostPosition(x, y);
            },
            onDrop: (elemento, destino) => {
                if (destino.classList.contains('drop-zone')) {
                    this.handleDrop({ 
                        preventDefault: () => {}, 
                        target: destino 
                    });
                }
                elemento.classList.remove('dragging');
                this.removerGhost();
            }
        });
    }

    configurarTouchDragDrop(blocosDisponiveisContainer, sequenciaBlocos) {
        let touchTimeout;
        let longPressActive = false;

        const handleTouchStart = (e) => {
            if (e.target.closest('input, select')) return;

            const bloco = e.target.closest('.bloco');
            if (!bloco) return;

            touchTimeout = setTimeout(() => {
                longPressActive = true;
                this.iniciarArrasteBlocoTouch(bloco, e.touches[0]);
            }, 500);

            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            if (!longPressActive) {
                const deltaX = e.touches[0].clientX - this.touchStartX;
                const deltaY = e.touches[0].clientY - this.touchStartY;
                if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                    clearTimeout(touchTimeout);
                }
                return;
            }

            e.preventDefault();
            this.moverBlocoTouch(e.touches[0]);
        };

        const handleTouchEnd = (e) => {
            clearTimeout(touchTimeout);
            if (!longPressActive) return;

            longPressActive = false;
            this.finalizarArrasteBlocoTouch(e);
        };

        blocosDisponiveisContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);
    }

    configurarMouseDragDrop(blocosDisponiveisContainer, sequenciaBlocos) {
        blocosDisponiveisContainer.addEventListener('dragstart', this.handleDragStart.bind(this));
        blocosDisponiveisContainer.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        sequenciaBlocos.addEventListener('dragstart', this.handleDragStart.bind(this));
        sequenciaBlocos.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    iniciarArrasteBlocoTouch(bloco, touch) {
        if (this.isBlocoDisponivel(bloco)) {
            this.blocoArrastado = this.clonarBloco(bloco);
        } else {
            this.blocoArrastado = bloco;
        }

        const rect = bloco.getBoundingClientRect();
        this.criarGhost(this.blocoArrastado);
        
        this.touchOffsetX = touch.clientX - rect.left;
        this.touchOffsetY = touch.clientY - rect.top;
        
        this.atualizarGhostPosition(touch.clientX - this.touchOffsetX, touch.clientY - this.touchOffsetY);
        this.blocoArrastado.classList.add('dragging');
    }

    moverBlocoTouch(touch) {
        if (!this.blocoArrastado || !this.ghostElement) return;
        
        const x = touch.clientX - this.touchOffsetX;
        const y = touch.clientY - this.touchOffsetY;
        
        this.atualizarGhostPosition(x, y);
        
        const dropZone = this.encontrarDropZone(touch.clientX, touch.clientY);
        this.atualizarDropZones(dropZone);
    }

    finalizarArrasteBlocoTouch(e) {
        if (!this.blocoArrastado) return;

        const touch = e.changedTouches[0];
        const dropZone = this.encontrarDropZone(touch.clientX, touch.clientY);

        if (dropZone) {
            this.handleDrop({ 
                preventDefault: () => {}, 
                target: dropZone 
            });
        }

        this.blocoArrastado.classList.remove('dragging');
        this.removerGhost();
        this.blocoArrastado = null;
    }


    criarGhost(elemento) {
        if (this.ghostElement) this.removerGhost();
        
        this.ghostElement = elemento.cloneNode(true);
        this.ghostElement.classList.add('ghost');
        this.ghostElement.style.position = 'fixed';
        this.ghostElement.style.pointerEvents = 'none';
        this.ghostElement.style.opacity = '0.8';
        this.ghostElement.style.zIndex = '9999';
        document.body.appendChild(this.ghostElement);
    }

    atualizarGhostPosition(x, y) {
        if (this.ghostElement) {
            this.ghostElement.style.left = `${x}px`;
            this.ghostElement.style.top = `${y}px`;
        }
    }

    removerGhost() {
        if (this.ghostElement) {
            this.ghostElement.remove();
            this.ghostElement = null;
        }
    }

    configurarLixeira() {
        const lixeira = document.getElementById('lixeira');
        if (!lixeira) return;

        const lixeiraHandlers = {
            ativar: (e) => {
                e.preventDefault();
                const blocoArrastado = document.querySelector('.dragging');
                if (blocoArrastado && !this.isBlocoDisponivel(blocoArrastado)) {
                    lixeira.classList.add('lixeira-ativa');
                }
            },
            desativar: () => {
                lixeira.classList.remove('lixeira-ativa');
            },
            deletar: (e) => {
                e.preventDefault();
                lixeira.classList.remove('lixeira-ativa');
                
                const blocoArrastado = document.querySelector('.dragging');
                if (blocoArrastado && !this.isBlocoDisponivel(blocoArrastado)) {
                    this.deletarBlocoComAnimacao(blocoArrastado);
                }
            }
        };

        if (this.touchSupported) {
            lixeira.addEventListener('touchenter', lixeiraHandlers.ativar);
            lixeira.addEventListener('touchleave', lixeiraHandlers.desativar);
            lixeira.addEventListener('touchend', lixeiraHandlers.deletar);
        }

        lixeira.addEventListener('dragover', (e) => {
            e.preventDefault();
            const blocoArrastado = document.querySelector('.dragging');
            if (blocoArrastado && !this.isBlocoDisponivel(blocoArrastado)) {
                lixeira.classList.add('lixeira-ativa');
                e.dataTransfer.dropEffect = 'move';
            }
        });

        lixeira.addEventListener('dragleave', lixeiraHandlers.desativar);
        lixeira.addEventListener('drop', lixeiraHandlers.deletar);
    }

    deletarBlocoComAnimacao(bloco) {
        if (!bloco || this.isBlocoDisponivel(bloco)) return;

        const blocoClone = bloco.cloneNode(true);
        const rect = bloco.getBoundingClientRect();
        
        Object.assign(blocoClone.style, {
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            margin: '0',
            transition: 'all 0.2s ease-out',
            zIndex: '9999'
        });
        
        document.body.appendChild(blocoClone);
        bloco.remove();

        requestAnimationFrame(() => {
            const lixeira = document.getElementById('lixeira');
            const lixeiraRect = lixeira.getBoundingClientRect();
            
            Object.assign(blocoClone.style, {
                transform: 'scale(0.1)',
                opacity: '0',
                top: (lixeiraRect.top + lixeiraRect.height/2) + 'px',
                left: (lixeiraRect.left + lixeiraRect.width/2) + 'px'
            });

            blocoClone.addEventListener('transitionend', () => {
                blocoClone.remove();
                this.verificarContainersVazios();
            }, { once: true });
        });
    }

    verificarContainersVazios() {
        document.querySelectorAll('.bloco-container').forEach(container => {
            if (!container.querySelector('.bloco')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'container-placeholder';
                placeholder.textContent = i18nThemeManager.translate('interface.dragHere');
                container.innerHTML = '';
                container.appendChild(placeholder);
            }
        });

        const sequenciaBlocos = document.getElementById('sequencia-blocos');
        if (sequenciaBlocos && !sequenciaBlocos.querySelector('.bloco')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'programa-placeholder';
            placeholder.textContent = i18nThemeManager.translate('interface.dropBlocks');
            sequenciaBlocos.innerHTML = '';
            sequenciaBlocos.appendChild(placeholder);
        }
    }

    handleDragStart(e) {
        if (e.target.closest('input, select')) {
            e.preventDefault();
            return;
        }

        const bloco = e.target.closest('.bloco');
        if (!bloco) return;

        // Adicionar classe para identificar o bloco sendo arrastado
        bloco.classList.add('dragging');
        
        // Configurar dados do drag
        e.dataTransfer.effectAllowed = this.isBlocoDisponivel(bloco) ? 'copy' : 'move';
        this.blocoArrastado = bloco;
        
        // Configurar a imagem de drag
        const ghost = bloco.cloneNode(true);
        ghost.style.opacity = '0.7';
        ghost.style.position = 'absolute';
        ghost.style.left = '-9999px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, e.offsetX, e.offsetY);
        setTimeout(() => ghost.remove(), 0);

        // Guardar dados do bloco para verificação de permissão de drop
        e.dataTransfer.setData('text/plain', JSON.stringify({
            tipo: bloco.dataset.tipo,
            isFromAvailable: this.isBlocoDisponivel(bloco)
        }));
    }

    handleDragEnd(e) {
        const bloco = e.target.closest('.bloco');
        if (bloco) {
            bloco.classList.remove('dragging');
        }
        this.blocoArrastado = null;
        this.atualizarDropZones(null);
    }

    handleDragOver(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.drop-zone');
        if (dropZone && this.blocoArrastado) {
            this.atualizarDropZones(dropZone);
            e.dataTransfer.dropEffect = this.isBlocoDisponivel(this.blocoArrastado) ? 'copy' : 'move';
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone || !this.blocoArrastado) return;

        // Limpar classes de indicação
        dropZone.classList.remove('drag-over');

        try {
            const isFromAvailable = this.isBlocoDisponivel(this.blocoArrastado);
            let novoBloco;

            if (isFromAvailable) {
                novoBloco = this.clonarBloco(this.blocoArrastado);
            } else {
                novoBloco = this.blocoArrastado;
            }

            // Remover estilos residuais do drag
            novoBloco.style.position = '';
            novoBloco.style.left = '';
            novoBloco.style.top = '';
            novoBloco.classList.remove('dragging');

            // Determinar se estamos inserindo em um container ou permutando
            const isContainerDrop = dropZone.classList.contains('bloco-container') || 
                                  dropZone.classList.contains('bloco-container-logico');

            if (!isContainerDrop) {
                // Obter a posição Y do mouse/toque
                const mouseY = e.clientY || (e.touches && e.touches[0].clientY);
                
                // Encontrar todos os blocos na dropzone exceto o arrastado
                const blocos = Array.from(dropZone.children).filter(el => 
                    el.classList.contains('bloco') && el !== this.blocoArrastado
                );

                // Se não há outros blocos, apenas append
                if (blocos.length === 0) {
                    dropZone.appendChild(novoBloco);
                    return;
                }

                // Encontrar o bloco mais próximo e a posição relativa
                let closestBlock = null;
                let insertBefore = true;
                let minDistance = Infinity;

                blocos.forEach(block => {
                    const rect = block.getBoundingClientRect();
                    const blockMiddle = rect.top + (rect.height / 2);
                    const distance = Math.abs(mouseY - blockMiddle);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestBlock = block;
                        insertBefore = mouseY < blockMiddle;
                    }
                });

                // Se encontramos um bloco próximo
                if (closestBlock) {
                    const currentIndex = Array.from(dropZone.children).indexOf(novoBloco);
                    const targetIndex = Array.from(dropZone.children).indexOf(closestBlock);
                    
                    // Remover o bloco da sua posição atual se já estiver na dropzone
                    if (currentIndex !== -1) {
                        novoBloco.remove();
                    }

                    // Inserir o bloco na nova posição
                    if (insertBefore) {
                        dropZone.insertBefore(novoBloco, closestBlock);
                    } else {
                        if (closestBlock.nextSibling) {
                            dropZone.insertBefore(novoBloco, closestBlock.nextSibling);
                        } else {
                            dropZone.appendChild(novoBloco);
                        }
                    }
                } else {
                    // Se não encontrou bloco próximo, adiciona ao final
                    dropZone.appendChild(novoBloco);
                }
            } else {
                // Inserção em container
                const placeholder = dropZone.querySelector('.container-placeholder, .programa-placeholder');
                if (placeholder) {
                    placeholder.remove();
                }
                dropZone.appendChild(novoBloco);
            }

            // Animar entrada
            novoBloco.style.opacity = '0';
            novoBloco.style.transform = 'translateY(-10px)';
            requestAnimationFrame(() => {
                novoBloco.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                novoBloco.style.opacity = '1';
                novoBloco.style.transform = 'translateY(0)';
                
                // Limpar transição após a animação
                novoBloco.addEventListener('transitionend', () => {
                    novoBloco.style.transition = '';
                }, { once: true });
            });

            // Configurar drop zones para containers se necessário
            if (novoBloco.querySelector('.drop-zone')) {
                const containers = novoBloco.querySelectorAll('.drop-zone');
                containers.forEach(container => {
                    this.configurarDropZoneUnica(container);
                });
            }
        } catch (error) {
            console.error('Erro ao soltar bloco:', error);
            mostrarMensagem(i18nThemeManager.translate('messages.error.unexpected'), 'error');
        }
    }


    atualizarDropZones(dropZoneAtual) {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });

        if (dropZoneAtual) {
            dropZoneAtual.classList.add('drag-over');
        }
    }

    inserirBlocoEmDropZone(bloco, dropZone) {
        const placeholder = dropZone.querySelector('.container-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        bloco.style.opacity = '0';
        bloco.style.transform = 'translateY(-10px)';
        bloco.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        dropZone.appendChild(bloco);
        
        requestAnimationFrame(() => {
            bloco.style.opacity = '1';
            bloco.style.transform = 'translateY(0)';
        });
    }

    isBlocoDisponivel(bloco) {
        return bloco.closest('#blocos-disponiveis') !== null;
    }

    verificarAninhamentoPermitido(dropZone, configBloco) {
        const blocoPai = dropZone.closest('.bloco');
        if (!blocoPai) return true;

        const configPai = BLOCOS_CONFIG.find(b => b.id === blocoPai.dataset.tipo);
        if (!configPai || !configPai.podeAninhar) return true;

        return configPai.podeAninhar.includes(configBloco.tipo);
    }

    clonarBloco(blocoOriginal) {
        const clone = blocoOriginal.cloneNode(true);
        clone.classList.remove('dragging');

        // Reinicializar inputs e selects
        clone.querySelectorAll('input').forEach(input => {
            const originalInput = blocoOriginal.querySelector(`input[type="${input.type}"]`);
            if (originalInput) {
                input.value = originalInput.value;
            }
        });

        clone.querySelectorAll('select').forEach(select => {
            const originalSelect = blocoOriginal.querySelector('select');
            if (originalSelect) {
                select.value = originalSelect.value;
            }
        });

        if (this.touchSupported) {
            this.configurarTouchParaBloco(clone);
        }

        return clone;
    }

    configurarTouchParaBloco(bloco) {
        const handle = bloco.querySelector('.bloco-handle');
        if (handle) {
            handle.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                this.iniciarArrasteBlocoTouch(bloco, e.touches[0]);
            });
        }

        bloco.querySelectorAll('input, select').forEach(element => {
            element.addEventListener('touchstart', e => e.stopPropagation());
            element.addEventListener('mousedown', e => e.stopPropagation());
        });
    }

    configurarSalvarAbrir() {
        const salvarBtn = document.getElementById('salvar-programa');
        const abrirBtn = document.getElementById('abrir-programa');
        const inputAbrir = document.getElementById('input-abrir-programa');

        salvarBtn?.addEventListener('click', async () => {
            const programa = this.serializarPrograma();
            const blob = new Blob([JSON.stringify(programa, null, 2)], { type: 'application/json' });
            
            try {
                if (window.showSaveFilePicker) {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: 'programa_labirinto.json',
                        types: [{
                            description: 'JSON Files',
                            accept: {'application/json': ['.json']}
                        }]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'programa_labirinto.json';
                    a.click();
                    URL.revokeObjectURL(url);
                }
                mostrarMensagem(i18nThemeManager.translate('messages.saved'), 'success');
            } catch (erro) {
                console.error('Erro ao salvar:', erro);
                mostrarMensagem(i18nThemeManager.translate('messages.error.saving'), 'error');
            }
        });

        abrirBtn?.addEventListener('click', () => {
            if (window.showOpenFilePicker) {
                this.abrirProgramaModerno();
            } else {
                inputAbrir.click();
            }
        });

        inputAbrir?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const programa = JSON.parse(event.target.result);
                    this.carregarPrograma(programa);
                    mostrarMensagem(i18nThemeManager.translate('messages.loaded'), 'success');
                } catch (erro) {
                    console.error('Erro ao carregar:', erro);
                    mostrarMensagem(i18nThemeManager.translate('messages.error.loading'), 'error');
                }
            };
            reader.readAsText(file);
        });
    }

    async abrirProgramaModerno() {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON Files',
                    accept: {'application/json': ['.json']}
                }]
            });
            const file = await fileHandle.getFile();
            const conteudo = await file.text();
            const programa = JSON.parse(conteudo);
            this.carregarPrograma(programa);
            mostrarMensagem(i18nThemeManager.translate('messages.loaded'), 'success');
        } catch (erro) {
            console.error('Erro ao abrir:', erro);
            mostrarMensagem(i18nThemeManager.translate('messages.error.loading'), 'error');
        }
    }

    serializarPrograma() {
        const sequenciaBlocos = document.getElementById('sequencia-blocos');
        const blocos = Array.from(sequenciaBlocos.children).filter(el => el.classList.contains('bloco'));
        return blocos.map(bloco => this.serializarBloco(bloco));
    }

    serializarBloco(bloco) {
       if (!bloco) return null;
       const tipo = bloco.dataset.tipo;
       const configBloco = BLOCOS_CONFIG.find(b => b.id === tipo);
       
       if (!configBloco) return null;

       const blocoData = {
           tipo: tipo,
           texto: configBloco.texto,
           cor: configBloco.cor
       };

       if (configBloco.input) {
           const input = bloco.querySelector('input');
           blocoData.valor = input ? input.value : configBloco.input.valor;
       }

       if (configBloco.select) {
           const select = bloco.querySelector('select');
           blocoData.selecionado = select ? select.value : configBloco.select.opcoes[0];
       }

       if (configBloco.temContainerLogico) {
           const containerLogico = bloco.querySelector('.bloco-container-logico');
           if (containerLogico) {
               const blocosLogicos = Array.from(containerLogico.children)
                   .filter(el => el.classList.contains('bloco'));
               blocoData.logica = blocosLogicos.map(b => this.serializarBloco(b))
                   .filter(b => b !== null);
           }
       }

       if (configBloco.temContainerExecucao) {
           const containerExecucao = bloco.querySelector('.bloco-container:not(.bloco-container-logico)');
           if (containerExecucao) {
               const blocosExecucao = Array.from(containerExecucao.children)
                   .filter(el => el.classList.contains('bloco'));
               blocoData.execucao = blocosExecucao.map(b => this.serializarBloco(b))
                   .filter(b => b !== null);
           }
       }

       if (configBloco.temDoisContainers) {
           const containers = bloco.querySelectorAll('.bloco-container-logico');
           if (containers.length) {
               blocoData.condicoes = Array.from(containers).map(container => {
                   const blocoLogico = container.querySelector('.bloco');
                   return blocoLogico ? this.serializarBloco(blocoLogico) : null;
               }).filter(b => b !== null);
           }
       }

       if (configBloco.temContainer && !configBloco.temContainerExecucao) {
           const container = bloco.querySelector('.bloco-container');
           if (container) {
               const blocos = Array.from(container.children)
                   .filter(el => el.classList.contains('bloco'));
               blocoData.filhos = blocos.map(b => this.serializarBloco(b))
                   .filter(b => b !== null);
           }
       }

       return blocoData;
    }

    carregarPrograma(programa) {
        const sequenciaBlocos = document.getElementById('sequencia-blocos');
        sequenciaBlocos.innerHTML = '';

        programa.forEach(blocoData => {
                const bloco = this.criarBlocoDeserializado(blocoData);
                if (bloco) {
                    sequenciaBlocos.appendChild(bloco);
                }
            });
        }

    criarBlocoDeserializado(blocoData) {
            const configBloco = BLOCOS_CONFIG.find(b => b.id === blocoData.tipo);
        if (!configBloco) return null;

        const bloco = this.criarBloco(configBloco);

        // Configurar valores de input se existirem
        if (blocoData.valor && configBloco.input) {
            const input = bloco.querySelector('input');
            if (input) {
                input.value = blocoData.valor;
            }
        }

        // Configurar valores de select se existirem
        if (blocoData.selecionado && configBloco.select) {
            const select = bloco.querySelector('select');
            if (select) {
                select.value = blocoData.selecionado;
            }
        }

        // Processar filhos em container padrão
        if (blocoData.filhos && configBloco.temContainer) {
            const container = bloco.querySelector('.bloco-container');
            if (container) {
                container.innerHTML = ''; // Limpar placeholder
                blocoData.filhos.forEach(filhoData => {
                    const filho = this.criarBlocoDeserializado(filhoData);
                    if (filho) {
                        container.appendChild(filho);
                    }
                });
            }
        }

        // Processar blocos lógicos
        if (blocoData.logica && configBloco.temContainerLogico) {
            const containerLogico = bloco.querySelector('.bloco-container-logico');
            if (containerLogico) {
                containerLogico.innerHTML = ''; // Limpar placeholder
                blocoData.logica.forEach(logicoData => {
                    const filho = this.criarBlocoDeserializado(logicoData);
                    if (filho) {
                        containerLogico.appendChild(filho);
                    }
                });
            }
        }

        // Processar bloco de execução
        if (blocoData.execucao && configBloco.temContainerExecucao) {
            const containerExecucao = bloco.querySelector('.bloco-container:not(.bloco-container-logico)');
            if (containerExecucao) {
                containerExecucao.innerHTML = ''; // Limpar placeholder
                blocoData.execucao.forEach(execData => {
                    const filho = this.criarBlocoDeserializado(execData);
                    if (filho) {
                        containerExecucao.appendChild(filho);
                    }
                });
            }
        }

        // Processar containers duplos (AND/OR)
        if (blocoData.condicoes && configBloco.temDoisContainers) {
            const containers = bloco.querySelectorAll('.bloco-container-logico');
            blocoData.condicoes.forEach((condicao, index) => {
                if (condicao && containers[index]) {
                    containers[index].innerHTML = ''; // Limpar placeholder
                    const filho = this.criarBlocoDeserializado(condicao);
                    if (filho) {
                        containers[index].appendChild(filho);
                    }
                }
            });
        }

        // Caso especial para o bloco de tom
        if (config.id === 'emitirTom') {
            const bloco = document.createElement('div');
            bloco.className = `bloco bloco-${config.tipo} bloco-tom`;
            bloco.dataset.tipo = config.id;
            bloco.draggable = !this.touchSupported;
            bloco.style.backgroundColor = config.cor;

            // Adicionar manipulador
            const handle = document.createElement('div');
            handle.className = 'bloco-handle';
            handle.innerHTML = '⋮';
            bloco.appendChild(handle);

            // Container principal
            const conteudo = document.createElement('div');
            conteudo.className = 'bloco-conteudo';

            // Título do bloco
            const titulo = document.createElement('span');
            titulo.textContent = config.texto;
            conteudo.appendChild(titulo);

            // Container para inputs
            const inputsContainer = document.createElement('div');
            inputsContainer.className = 'inputs-container';

            // Criar inputs
            Object.entries(config.inputs).forEach(([key, input]) => {
                const grupo = document.createElement('div');
                grupo.className = 'input-group';

                const label = document.createElement('label');
                label.textContent = input.label;
                grupo.appendChild(label);

                const inputEl = document.createElement('input');
                inputEl.type = input.tipo;
                inputEl.min = input.min;
                inputEl.max = input.max;
                inputEl.value = input.valor;
                inputEl.className = 'touch-input';
                
                // Prevenir propagação de eventos
                inputEl.addEventListener('mousedown', e => e.stopPropagation());
                inputEl.addEventListener('touchstart', e => e.stopPropagation());
                
                grupo.appendChild(inputEl);

                if (input.suffix) {
                    const suffix = document.createElement('span');
                    suffix.className = 'input-suffix';
                    suffix.textContent = input.suffix;
                    grupo.appendChild(suffix);
                }

                inputsContainer.appendChild(grupo);
            });

            // Adicionar presets de tom
            if (config.presets) {
                const presetsContainer = document.createElement('div');
                presetsContainer.className = 'tone-presets';
                
                config.presets.forEach(preset => {
                    const button = document.createElement('button');
                    button.className = 'tone-preset';
                    button.textContent = preset.nome;
                    button.onclick = (e) => {
                        e.stopPropagation();
                        const freqInput = inputsContainer.querySelector('input[type="number"]');
                        if (freqInput) {
                            freqInput.value = preset.frequencia;
                        }
                    };
                    presetsContainer.appendChild(button);
                });

                inputsContainer.appendChild(presetsContainer);
            }

            conteudo.appendChild(inputsContainer);
            bloco.appendChild(conteudo);

            return bloco;
        }
        return bloco;   
    }
}

// Exportar para uso em main.js
export const gerenciadorBlocos = new GerenciadorBlocos();
export { mostrarMensagem, BLOCOS_CONFIG };

