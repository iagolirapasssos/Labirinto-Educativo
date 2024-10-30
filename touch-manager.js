// touch-manager.js

export class TouchManager {
    constructor() {
        this.draggedElement = null;
        this.touchOffset = { x: 0, y: 0 };
        this.lastTouch = null;
        this.scrolling = false;
        this.scrollTimeout = null;
        this.touchStartTime = 0;
    }

    initialize(container, options = {}) {
        this.container = container;
        this.options = {
            dragSelector: '.bloco',
            handleSelector: '.bloco-handle',
            dropZoneSelector: '.drop-zone',
            onDragStart: null,
            onDrag: null,
            onDrop: null,
            scrollSensitivity: 50,
            ...options
        };

        this.setupTouchEvents();
    }

    setupTouchEvents() {
        // Prevent default touch behaviors except for inputs and selects
        this.container.addEventListener('touchstart', (e) => {
            if (!e.target.closest('input, select')) {
                e.preventDefault();
            }
        }, { passive: false });

        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Handle scrolling within containers
        const scrollableContainers = this.container.querySelectorAll('.bloco-container');
        scrollableContainers.forEach(container => {
            container.addEventListener('touchmove', (e) => {
                if (this.scrolling && !this.draggedElement) {
                    e.stopPropagation();
                }
            }, { passive: true });
        });
    }

    handleTouchStart(e) {
        if (e.target.closest('input, select')) return;
        
        this.touchStartTime = Date.now();
        const touch = e.touches[0];
        this.lastTouch = touch;

        const handle = e.target.closest(this.options.handleSelector);
        const draggable = e.target.closest(this.options.dragSelector);

        if (handle && draggable) {
            this.initiateDrag(draggable, touch);
        } else {
            // Check if we should start scrolling
            this.scrolling = true;
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            this.scrollTimeout = setTimeout(() => {
                this.scrolling = false;
            }, 100);
        }
    }

    initiateDrag(element, touch) {
        this.draggedElement = element;
        const rect = element.getBoundingClientRect();
        
        this.touchOffset = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };

        element.classList.add('dragging');
        this.createDragPlaceholder(element);

        if (this.options.onDragStart) {
            this.options.onDragStart(element);
        }
    }

    handleTouchMove(e) {
        if (!this.draggedElement) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        this.lastTouch = touch;

        // Update dragged element position
        const x = touch.clientX - this.touchOffset.x;
        const y = touch.clientY - this.touchOffset.y;

        this.draggedElement.style.position = 'fixed';
        this.draggedElement.style.left = `${x}px`;
        this.draggedElement.style.top = `${y}px`;

        // Find potential drop target
        const dropTarget = this.findDropTarget(touch);
        this.updateDropZones(dropTarget);

        // Auto-scroll when near edges
        this.handleAutoScroll(touch);

        if (this.options.onDrag) {
            this.options.onDrag(this.draggedElement, x, y);
        }
    }

    handleTouchEnd(e) {
        if (!this.draggedElement) return;

        const touchDuration = Date.now() - this.touchStartTime;
        const wasQuickTap = touchDuration < 200;

        if (wasQuickTap) {
            // Handle as a tap/click
            this.resetDragState();
            return;
        }

        // Find final drop target
        const dropTarget = this.findDropTarget(this.lastTouch);
        
        if (dropTarget) {
            this.completeDrop(dropTarget);
        }

        this.resetDragState();
    }

    findDropTarget(touch) {
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        return elements.find(el => el.matches(this.options.dropZoneSelector));
    }

    updateDropZones(currentDropTarget) {
        // Remove highlight from all drop zones
        document.querySelectorAll(this.options.dropZoneSelector).forEach(zone => {
            zone.classList.remove('drag-over');
        });

        // Add highlight to current drop target
        if (currentDropTarget) {
            currentDropTarget.classList.add('drag-over');
        }
    }

    completeDrop(dropTarget) {
        // Remove placeholder
        const placeholder = document.querySelector('.drag-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Reset element styles
        this.draggedElement.style.position = '';
        this.draggedElement.style.left = '';
        this.draggedElement.style.top = '';
        this.draggedElement.classList.remove('dragging');

        // Move element to new container
        dropTarget.appendChild(this.draggedElement);

        if (this.options.onDrop) {
            this.options.onDrop(this.draggedElement, dropTarget);
        }
    }

    resetDragState() {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
            this.draggedElement.style.position = '';
            this.draggedElement.style.left = '';
            this.draggedElement.style.top = '';
        }

        const placeholder = document.querySelector('.drag-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        this.updateDropZones(null);
        this.draggedElement = null;
        this.lastTouch = null;
    }

    createDragPlaceholder(element) {
        const placeholder = element.cloneNode(true);
        placeholder.classList.add('drag-placeholder');
        placeholder.style.opacity = '0.3';
        placeholder.style.pointerEvents = 'none';
        element.parentNode.insertBefore(placeholder, element);
    }

    handleAutoScroll(touch) {
        const scrollContainers = [
            document.getElementById('blocos-disponiveis'),
            document.getElementById('programa')
        ];

        scrollContainers.forEach(container => {
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const sensitivity = this.options.scrollSensitivity;

            if (touch.clientY < rect.top + sensitivity) {
                // Scroll up
                container.scrollTop -= 10;
            } else if (touch.clientY > rect.bottom - sensitivity) {
                // Scroll down
                container.scrollTop += 10;
            }
        });
    }
}

export default new TouchManager();