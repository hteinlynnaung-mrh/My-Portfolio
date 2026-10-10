import { skills } from "../user-data/data.js";

/**
 * SkillSphere Component
 * Creates an interactive 3D sphere of skill labels with colored icons using Three.js.
 */
class SkillSphere {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.group = new THREE.Group();
        this.labels = [];
        
        // Settings
        this.radius = 200; // Increased slightly to accommodate icons
        this.rotationSpeed = 0.005;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        
        this.init();
    }

    async init() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 450;

        // Ensure fonts are loaded before generating labels
        await document.fonts.ready;
        
        await this.createSkills();
        this.scene.add(this.group);

        this.addEventListeners();
        this.animate();
    }

    /**
     * Extracts icon character and font family from CSS classes
     */
    async getIconInfo(iconClass) {
        const el = document.createElement("i");
        el.className = iconClass;
        el.style.position = "absolute";
        el.style.visibility = "hidden";
        document.body.appendChild(el);
        
        // Small delay to ensure styles are applied
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const style = window.getComputedStyle(el, "::before");
        const content = style.content.replace(/['"]/g, "");
        const fontFamily = style.fontFamily;
        
        document.body.removeChild(el);
        
        // Standard check for empty/missing content
        if (!content || content === "none") return null;
        
        return { content, fontFamily };
    }

    /**
     * Creates a high-resolution label with an icon and text as a Three.js Sprite
     */
    async createLabel(text, iconClass, color = "#f9bf3f") {
        const iconInfo = await this.getIconInfo(iconClass);
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const fontSize = 48;
        const iconSize = 54;
        const fontFace = "Montserrat, sans-serif";
        
        // Measure text
        context.font = `Bold ${fontSize}px ${fontFace}`;
        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
        
        // Measure icon if available
        let iconWidth = 0;
        if (iconInfo) {
            context.font = `${iconSize}px ${iconInfo.fontFamily}`;
            iconWidth = context.measureText(iconInfo.content).width + 20; // Plus spacing
        }
        
        // Set canvas size
        canvas.width = textWidth + iconWidth + 40;
        canvas.height = Math.max(fontSize, iconSize) + 40;

        // Draw Icon
        if (iconInfo) {
            context.font = `${iconSize}px ${iconInfo.fontFamily}`;
            context.fillStyle = color;
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.fillText(iconInfo.content, 20, canvas.height / 2);
        }

        // Draw Text
        context.font = `Bold ${fontSize}px ${fontFace}`;
        context.fillStyle = "white"; // Text stays white for readability
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        // Subtle shadow
        context.shadowColor = "rgba(0,0,0,0.5)";
        context.shadowBlur = 8;
        
        context.fillText(text, 20 + iconWidth, canvas.height / 2);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        
        const aspect = canvas.width / canvas.height;
        sprite.scale.set(aspect * 45, 45, 1);
        
        return sprite;
    }

    async createSkills() {
        const count = skills.length;
        
        // Sequential creation to ensure font measurement accuracy
        for (let i = 0; i < count; i++) {
            const skill = skills[i];
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            const label = await this.createLabel(skill.name, skill.icon, skill.color);
            
            label.position.set(
                this.radius * Math.cos(theta) * Math.sin(phi),
                this.radius * Math.sin(theta) * Math.sin(phi),
                this.radius * Math.cos(phi)
            );

            this.group.add(label);
            this.labels.push(label);
        }
    }

    addEventListeners() {
        window.addEventListener("mousemove", (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = ((e.clientX - rect.left) / this.container.offsetWidth) * 2 - 1;
            this.mouseY = -((e.clientY - rect.top) / this.container.offsetHeight) * 2 + 1;
        });

        window.addEventListener("resize", () => {
            if (!this.container) return;
            this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        });
        
        this.container.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const rect = this.container.getBoundingClientRect();
                this.mouseX = ((e.touches[0].clientX - rect.left) / this.container.offsetWidth) * 2 - 1;
                this.mouseY = -((e.touches[0].clientY - rect.top) / this.container.offsetHeight) * 2 + 1;
                e.preventDefault();
            }
        }, { passive: false });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.targetRotationY += (this.mouseX * 0.05 - this.targetRotationY) * 0.05;
        this.targetRotationX += (this.mouseY * 0.05 - this.targetRotationX) * 0.05;

        this.group.rotation.y += this.rotationSpeed + this.targetRotationY;
        this.group.rotation.x += this.targetRotationX;

        this.group.rotation.x *= 0.99;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
    new SkillSphere("skill-sphere-canvas");
});
