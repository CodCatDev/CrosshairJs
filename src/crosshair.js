// lib made by CodCatDev
// https://github.com/CodCatDev/CrosshairJs
// Version 1.2.1
class Crosshair {
    constructor(options = {}) {
        this.dotSize = options.dotSize || 6
        this.outlineSpace = options.outlineSpace || 30
        this.dotColor = options.dotColor || '#fff'
        this.outlineColor = options.outlineColor || '#fff'
        this.hoverPadding = options.hoverPadding || { x: 15, y: 10 }
        this.useBlend = options.useBlend !== undefined ? options.useBlend : true
        this.outlineSize = options.outlineSize || 2
        
        const isFinePointer = window.innerWidth >= 768 && window.matchMedia('(pointer:fine)').matches
        if (!isFinePointer) return

        this.init()
    }

    injectStyles() {
        const style = document.createElement('style')
        style.textContent = `
            * { cursor: none !important; }
            .cursorTochka {
                position: fixed; top: 0; left: 0; width: ${this.dotSize}px; height: ${this.dotSize}px;
                background-color: ${this.dotColor} !important; border-radius: 50% !important; 
                pointer-events: none !important; z-index: 10000 !important; 
                transform: translate(-50%, -50%); display: block !important;
            }
            .cursorOutline {
                position: fixed; top: 0; left: 0; pointer-events: none !important; z-index: 9999 !important;
                width: ${this.outlineSpace}px; height: ${this.outlineSpace}px;
                display: flex !important; align-items: center !important; justify-content: center !important;
                ${this.useBlend ? 'mix-blend-mode: difference;' : ''}
            }
            .cursorCorner {
                position: absolute !important; width: 10px !important; height: 10px !important;
                box-sizing: border-box !important; display: block !important;
            }
            .top-left { 
                top: 0; left: 0; 
                border-top: ${this.outlineSize}px solid ${this.outlineColor} !important; 
                border-left: ${this.outlineSize}px solid ${this.outlineColor} !important; 
            }
            .top-right { 
                top: 0; right: 0; 
                border-top: ${this.outlineSize}px solid ${this.outlineColor} !important; 
                border-right: ${this.outlineSize}px solid ${this.outlineColor} !important; 
            }
            .bottom-left { 
                bottom: 0; left: 0; 
                border-bottom: ${this.outlineSize}px solid ${this.outlineColor} !important; 
                border-left: ${this.outlineSize}px solid ${this.outlineColor} !important; 
            }
            .bottom-right { 
                bottom: 0; right: 0; 
                border-bottom: ${this.outlineSize}px solid ${this.outlineColor} !important; 
                border-right: ${this.outlineSize}px solid ${this.outlineColor} !important; 
            }
            .cursorOutline:not(.hovering) .cursorCorner {
                width: 8px !important; height: 8px !important;
                transform: scale(0.8) !important;
            }
        `
        document.head.appendChild(style)
    }

    init() {
        this.injectStyles()
        this.createElements()
        this.setupState()
        this.addEventListeners()
        this.animate()
    }

    createElements() {
        this.dot = document.createElement('div')
        this.dot.className = 'cursorTochka'
        
        this.outline = document.createElement('div')
        this.outline.className = 'cursorOutline'
        this.outline.innerHTML = `
            <div class="cursorCorner top-left"></div>
            <div class="cursorCorner top-right"></div>
            <div class="cursorCorner bottom-left"></div>
            <div class="cursorCorner bottom-right"></div>
        `
        
        document.body.appendChild(this.dot)
        document.body.appendChild(this.outline)
    }

    setupState() {
        this.mouseX = window.innerWidth / 2
        this.mouseY = window.innerHeight / 2
        this.outlineX = this.mouseX
        this.outlineY = this.mouseY
        this.rotation = 0
        this.isHovering = false
        this.targetData = { x: 0, y: 0, w: 0, h: 0 }
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX
            this.mouseY = e.clientY
            this.dot.style.transform = `translate(calc(${this.mouseX}px - 50%), calc(${this.mouseY}px - 50%))`
        })

        const updateInteractables = () => {
            const items = document.querySelectorAll('a, button, .interactable')
            items.forEach(el => {
                if (el.dataset.cursorBound) return
                el.dataset.cursorBound = "true"
                el.addEventListener('mouseenter', () => {
                    this.isHovering = true
                    const rect = el.getBoundingClientRect()
                    this.targetData = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        w: rect.width,
                        h: rect.height
                    }
                    this.outline.classList.add('hovering')
                })
                el.addEventListener('mouseleave', () => {
                    this.isHovering = false
                    this.outline.classList.remove('hovering')
                })
            })
        }

        updateInteractables()
        const observer = new MutationObserver(updateInteractables)
        observer.observe(document.body, { childList: true, subtree: true })
    }

    animate() {
        if (this.isHovering) {
            this.outlineX += (this.targetData.x - this.outlineX) * 0.15
            this.outlineY += (this.targetData.y - this.outlineY) * 0.15
            
            let cw = parseFloat(this.outline.style.width) || this.outlineSpace
            let ch = parseFloat(this.outline.style.height) || this.outlineSpace
            
            this.outline.style.width = `${cw + (this.targetData.w + this.hoverPadding.x - cw) * 0.15}px`
            this.outline.style.height = `${ch + (this.targetData.h + this.hoverPadding.y - ch) * 0.15}px`
            
            let nearest180 = Math.round(this.rotation / 180) * 180
            this.rotation += (nearest180 - this.rotation) * 0.15
        } else {
            this.outlineX += (this.mouseX - this.outlineX) * 0.15
            this.outlineY += (this.mouseY - this.outlineY) * 0.15
            
            let cw = parseFloat(this.outline.style.width) || this.outlineSpace
            let ch = parseFloat(this.outline.style.height) || this.outlineSpace
            
            this.outline.style.width = `${cw + (this.outlineSpace - cw) * 0.15}px`
            this.outline.style.height = `${ch + (this.outlineSpace - ch) * 0.15}px`
            
            this.rotation += 1.5
        }

        this.outline.style.transform = `translate(calc(${this.outlineX}px - 50%), calc(${this.outlineY}px - 50%)) rotate(${this.rotation}deg)`
        
        requestAnimationFrame(() => this.animate())
    }
}