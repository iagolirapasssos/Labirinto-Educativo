// blocks.js
import { i18nThemeManager } from './i18n-theme-manager.js';
import touchManager from './touch-manager.js';

// Definição dos tipos de blocos
const TIPOS_BLOCOS = {
    MOVIMENTO: 'movimento',
    CONTROLE: 'controle',
    REPETICAO: 'repeticao',
    CONDICIONAL: 'condicional',
    ESPELHAMENTO: 'espelhamento',
    ESPERAR: 'esperar',
    AGUARDAR: 'aguardar',
    VOLTAR_INICIO: 'voltarInicio',
    VERIFICAR_PAREDE: 'verificarParede',
    AUDIO: 'audio'
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
            tipo: TIPOS_BLOCOS.ESPELHAMENTO,
            id: 'espelharH',
            texto: i18nThemeManager.translate('blocks.mirrorH'),
            cor: '#E91E63'
        },
        {
            tipo: TIPOS_BLOCOS.ESPELHAMENTO,
            id: 'espelharV',
            texto: i18nThemeManager.translate('blocks.mirrorV'),
            cor: '#E91E63'
        },
        // Blocos de Repetição
        {
            tipo: TIPOS_BLOCOS.REPETICAO,
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
            tipo: TIPOS_BLOCOS.CONDICIONAL,
            id: 'se',
            texto: i18nThemeManager.translate('blocks.if'),
            cor: '#9c27b0',
            temContainer: true,
            select: {
                opcoes: ['caminho livre', 'parede à frente']
            }
        },
        {
            tipo: TIPOS_BLOCOS.CONDICIONAL,
            id: 'senaoSe',
            texto: i18nThemeManager.translate('blocks.elseIf'),
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
            texto: i18nThemeManager.translate('blocks.else'),
            cor: '#FF5722',
            temContainer: true,
            podeAninhar: ['movimento', 'espelhamento', 'repeticao', 'controle', 'esperar', 'voltarInicio', 'aguardar']
        },
        // Verificação de Paredes
        {
            tipo: TIPOS_BLOCOS.VERIFICAR_PAREDE,
            id: 'temParedeDireita',
            texto: i18nThemeManager.translate('blocks.checkRightWall'),
            cor: '#795548',
            temContainer: true,
            select: {
                opcoes: ['sim', 'não']
            }
        },
        {
            tipo: TIPOS_BLOCOS.VERIFICAR_PAREDE,
            id: 'temParedeEsquerda',
            texto: i18nThemeManager.translate('blocks.checkLeftWall'),
            cor: '#6D4C41',
            temContainer: true,
            select: {
                opcoes: ['sim', 'não']
            }
        },
        {
            tipo: TIPOS_BLOCOS.VERIFICAR_PAREDE,
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
            tipo: TIPOS_BLOCOS.AGUARDAR,
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
            tipo: TIPOS_BLOCOS.AUDIO,
            id: 'emitirTom',
            texto: i18nThemeManager.translate('blocks.emitTone'),
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
            texto: i18nThemeManager.translate('blocks.stopTone'),
            cor: '#FF5722',
            temContainer: false
        }
    ];
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
        const bloco = document.createElement('div');
        bloco.className = `bloco bloco-${config.tipo}`;
        bloco.dataset.tipo = config.id;
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

    configurarDropZoneUnica(zone) {
        if (!zone.dataset.dropzoneConfigured) {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.blocoArrastado) {
                    this.atualizarDropZones(zone);
                    e.dataTransfer.dropEffect = this.isBlocoDisponivel(this.blocoArrastado) ? 'copy' : 'move';
                }
            });

            zone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDrop(e);
            });

            zone.dataset.dropzoneConfigured = 'true';
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

        if (this.isBlocoDisponivel(bloco)) {
            e.dataTransfer.effectAllowed = 'copy';
        } else {
            e.dataTransfer.effectAllowed = 'move';
        }

        this.blocoArrastado = bloco;
        bloco.classList.add('dragging');
        e.dataTransfer.setData('text/plain', bloco.dataset.tipo);

        const ghost = bloco.cloneNode(true);
        ghost.style.opacity = '0.7';
        ghost.style.position = 'absolute';
        ghost.style.left = '-9999px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, e.offsetX, e.offsetY);
        setTimeout(() => ghost.remove(), 0);
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

        // Remover classe drag-over
        dropZone.classList.remove('drag-over');

        // Obter configuração do bloco
        const tipoBloco = this.blocoArrastado.dataset.tipo;
        const configBloco = BLOCOS_CONFIG.find(bloco => bloco.id === tipoBloco);
        if (!configBloco) return;

        // Verificar aninhamento permitido
        if (!this.verificarAninhamentoPermitido(dropZone, configBloco)) {
            mostrarMensagem(i18nThemeManager.translate('messages.error.nestedBlock'), 'error');
            return;
        }

        try {
            // Determinar se o bloco vem da área de blocos disponíveis
            const isFromAvailable = this.isBlocoDisponivel(this.blocoArrastado);
            let novoBloco;

            if (isFromAvailable) {
                // Se vier dos blocos disponíveis, criar uma cópia
                novoBloco = this.clonarBloco(this.blocoArrastado);
            } else {
                // Se não, mover o bloco existente
                novoBloco = this.blocoArrastado;
            }

            // Remover o placeholder se existir
            const placeholder = dropZone.querySelector('.container-placeholder, .programa-placeholder');
            if (placeholder) {
                placeholder.remove();
            }

            // Certificar que o bloco não tenha estilos residuais do drag
            novoBloco.style.position = '';
            novoBloco.style.left = '';
            novoBloco.style.top = '';
            novoBloco.classList.remove('dragging');

            // Adicionar o bloco à drop zone com animação
            novoBloco.style.opacity = '0';
            novoBloco.style.transform = 'translateY(-10px)';
            dropZone.appendChild(novoBloco);

            // Aplicar animação de entrada
            requestAnimationFrame(() => {
                novoBloco.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                novoBloco.style.opacity = '1';
                novoBloco.style.transform = 'translateY(0)';
            });

            // Se for um bloco aninhável, configurar sua drop zone interna
            if (configBloco.temContainer) {
                const container = novoBloco.querySelector('.bloco-container');
                if (container) {
                    this.configurarDropZoneUnica(container);
                }
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
        const tipo = bloco.dataset.tipo;
        const configBloco = BLOCOS_CONFIG.find(b => b.id === tipo);
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

        if (configBloco.temContainer) {
            const container = bloco.querySelector('.bloco-container');
            const filhos = Array.from(container.children).filter(el => el.classList.contains('bloco'));
            blocoData.filhos = filhos.map(filho => this.serializarBloco(filho));
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

        if (blocoData.valor) {
            const input = bloco.querySelector('input');
            if (input) input.value = blocoData.valor;
        }

        if (blocoData.selecionado) {
            const select = bloco.querySelector('select');
            if (select) select.value = blocoData.selecionado;
        }

        if (blocoData.filhos && blocoData.filhos.length > 0) {
            const container = bloco.querySelector('.bloco-container');
            if (container) {
                container.innerHTML = '';
                blocoData.filhos.forEach(filhoData => {
                    const filho = this.criarBlocoDeserializado(filhoData);
                    if (filho) container.appendChild(filho);
                });
            }
        }

        return bloco;
    }
}

// Função para mostrar mensagens
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

// Exportar para uso em main.js
export const gerenciadorBlocos = new GerenciadorBlocos();
export { mostrarMensagem };