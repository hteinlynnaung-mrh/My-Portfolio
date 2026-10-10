const TECHNOLOGIES = [
  ["HTML5", "devicon-html5-plain", "#e34f26"],
  ["CSS3", "devicon-css3-plain", "#1572b6"],
  ["Bootstrap", "devicon-bootstrap-plain", "#7952b3"],
  ["JavaScript", "devicon-javascript-plain", "#f7df1e"],
  ["TypeScript", "devicon-typescript-plain", "#3178c6"],
  ["PHP", "devicon-php-plain", "#777bb4"],
  ["Laravel", "devicon-laravel-original", "#ff2d20"],
  ["Java", "devicon-java-plain", "#ed8b00"],
  ["Spring Boot", "devicon-spring-plain", "#6db33f"],
  ["Git", "devicon-git-plain", "#f05032"],
  ["GitHub", "devicon-github-original", "#181717"],
  ["Docker", "devicon-docker-plain", "#2496ed"],
  ["React", "devicon-react-original", "#61dafb"],
  ["React Native", "devicon-react-original", "#61dafb"],
  ["Tailwind CSS", "devicon-tailwindcss-plain", "#06b6d4"],
  ["Next.js", "devicon-nextjs-plain", "#111111"],
  ["Express.js", "devicon-express-original", "#555555"],
  ["Python", "devicon-python-plain", "#3776ab"],
  ["MongoDB", "devicon-mongodb-plain", "#47a248"],
  ["MySQL", "devicon-mysql-plain", "#4479a1"],
  ["PostgreSQL", "devicon-postgresql-plain", "#4169e1"],
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

class TechnologySkillsGlobe {
  constructor() {
    this.container = document.getElementById("technology-skills-globe");
    this.host = document.getElementById("technology-skills-canvas");
    this.tooltip = document.getElementById("technology-skills-tooltip");
    if (!this.container || !this.host) return;
    if (!window.THREE) {
      this.showFallback();
      return;
    }

    this.nodes = [];
    this.links = [];
    this.particles = [];
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.drag = { active: false, x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.hidden = document.hidden;
    this.hoveredNode = null;
    this.touchTooltipTimer = null;
    this.refreshTheme = this.refreshTheme.bind(this);
    this.resize = this.resize.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.visibilityChange = this.visibilityChange.bind(this);
  }

  async start() {
    if (!window.THREE) return;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    this.camera.position.z = 10.5;
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      this.showFallback();
      return;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.setClearColor(0x000000, 0);
    this.host.appendChild(this.renderer.domElement);

    this.globeWorld = new THREE.Group();
    this.nodeWorld = new THREE.Group();
    this.scene.add(this.globeWorld, this.nodeWorld);
    this.addGlobe();
    this.addStars();
    this.themeObserver = new MutationObserver(this.refreshTheme);
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    await document.fonts.ready;
    await this.addNodes();
    this.addLinks();
    this.addParticles();
    this.applyThemeToScene();
    this.bindEvents();
    this.resize();
    this.animate();
  }

  addGlobe() {
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.85, 36, 24),
      new THREE.MeshBasicMaterial({
        color: 0x173b76,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.globeWorld.add(core);

    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 18, 12),
      new THREE.MeshBasicMaterial({
        color: 0x4a9dff,
        transparent: true,
        opacity: 0.42,
        wireframe: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.globeWorld.add(grid);

    const atmosphere = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.radialTexture(),
        color: 0x3478ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    atmosphere.scale.set(5.9, 5.9, 1);
    this.scene.add(atmosphere);
    this.globeCore = core;
    this.globeGrid = grid;
    this.atmosphere = atmosphere;
    this.applyThemeToScene();
  }

  applyThemeToScene() {
    const light = document.documentElement.dataset.theme === "light";
    if (!this.globeCore || !this.globeGrid || !this.atmosphere) return;
    const blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    this.globeCore.material.color.set(light ? 0xf5f7fb : 0x173b76);
    this.globeCore.material.opacity = light ? 0.95 : 0.18;
    this.globeCore.material.blending = blending;
    this.globeCore.material.needsUpdate = true;
    this.globeGrid.material.color.set(light ? 0x425b7a : 0x4a9dff);
    this.globeGrid.material.opacity = light ? 0.68 : 0.42;
    this.globeGrid.material.blending = blending;
    this.globeGrid.material.needsUpdate = true;
    this.atmosphere.material.color.set(light ? 0xc7d2df : 0x3478ff);
    this.atmosphere.material.opacity = light ? 0.18 : 0.2;
    this.atmosphere.material.blending = blending;
    this.atmosphere.material.needsUpdate = true;

    if (this.stars) {
      this.stars.material.color.set(light ? 0x9aa8b8 : 0x9bcaff);
      this.stars.material.opacity = light ? 0.3 : 0.55;
    }
    this.links.forEach((link, index) => {
      link.line.material.color.set(
        light ? (index % 2 ? 0x3977b8 : 0x177da8) : index % 2 ? 0x5d86ff : 0x35dcff
      );
      link.line.material.opacity = light ? 0.5 : 0.42;
      link.line.material.blending = blending;
      link.line.material.needsUpdate = true;
    });
    this.particles.forEach((item, index) => {
      item.particle.material.color.set(
        light ? (index % 2 ? 0x6b43bd : 0x087ca7) : index % 2 ? 0xa479ff : 0x3fe8ff
      );
      item.particle.material.blending = blending;
      item.particle.material.needsUpdate = true;
    });
  }

  refreshTheme() {
    if (this.atmosphere) {
      const previousMap = this.atmosphere.material.map;
      this.atmosphere.material.map = this.radialTexture();
      this.atmosphere.material.needsUpdate = true;
      previousMap?.dispose();
    }
    this.applyThemeToScene();
    this.nodes.forEach((node) => {
      if (!node.mesh || !node.icon) return;
      const previousMap = node.mesh.material.map;
      node.mesh.material.map = this.tileTexture(node.name, node.icon, node.color);
      node.mesh.material.needsUpdate = true;
      previousMap?.dispose();
    });
  }

  radialTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
    const light = document.documentElement.dataset.theme === "light";
    gradient.addColorStop(0, light ? "rgba(255, 255, 255, .7)" : "rgba(48, 142, 255, .62)");
    gradient.addColorStop(0.42, light ? "rgba(190, 205, 222, .2)" : "rgba(81, 70, 224, .18)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  addStars() {
    const positions = new Float32Array(220 * 3);
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 13;
      positions[index + 1] = (Math.random() - 0.5) * 8;
      positions[index + 2] = (Math.random() - 0.5) * 4 - 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x9bcaff,
        size: 0.018,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      })
    );
    this.scene.add(this.stars);
  }

  async getIcon(className) {
    if (!className) return null;
    const classNames = [className];
    if (className.endsWith("-original")) classNames.push(className.replace("-original", "-plain"));
    for (const candidate of classNames) {
      const element = document.createElement("i");
      element.className = `${candidate} colored`;
      element.style.cssText = "position:absolute;visibility:hidden;";
      document.body.appendChild(element);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const style = getComputedStyle(element, "::before");
      const content = style.content.replace(/["']/g, "");
      const family = style.fontFamily || "Arial";
      element.remove();
      if (content && content !== "none") return { content, family };
    }
    return null;
  }

  async addNodes() {
    const radius = 2.6;
    TECHNOLOGIES.forEach((technology, index) => {
      const y = 1 - (index / (TECHNOLOGIES.length - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * index;
      const base = new THREE.Vector3(
        Math.cos(angle) * ring * radius,
        y * radius,
        Math.sin(angle) * ring * radius
      );
      this.createNode(technology, base, index);
    });
    await Promise.all(this.nodes.map((node) => node.ready));
  }

  createNode(technology, base, index) {
    const [name, iconClass, color] = technology;
    const group = new THREE.Group();
    const node = {
      group,
      base,
      axis: new THREE.Vector3(0.25 + index % 3, 1, 0.4 + (index % 4) * 0.35).normalize(),
      speed: 0.035 + (index % 5) * 0.008,
      direction: index % 2 ? -1 : 1,
      phase: index * 0.83,
      pulseSpeed: 1.55 + (index % 6) * 0.18,
      pulseAmount: 0.065 + (index % 4) * 0.012,
      color,
      name,
      icon: null,
      mesh: null,
      ready: null,
    };
    node.ready = this.getIcon(iconClass).then((icon) => {
      node.icon = icon;
      const texture = this.tileTexture(name, icon, color);
      const mesh = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          color: 0xffffff,
        })
      );
      mesh.scale.set(0.55, 0.55, 1);
      mesh.userData.node = node;
      node.mesh = mesh;
      group.add(mesh);
      this.nodeWorld.add(group);
    });
    this.nodes.push(node);
  }

  tileTexture(name, icon, color) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    const center = 128;
    const radius = 108;
    context.beginPath();
    for (let index = 0; index < 6; index += 1) {
      const angle = Math.PI / 3 * index + Math.PI / 6;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      index ? context.lineTo(x, y) : context.moveTo(x, y);
    }
    context.closePath();
    const light = document.documentElement.dataset.theme === "light";
    if (name === "JLPT N2") {
      const jlptGradient = context.createLinearGradient(32, 32, 224, 224);
      if (light) {
        jlptGradient.addColorStop(0, "#fff0f0");
        jlptGradient.addColorStop(0.52, "#ffd0d0");
        jlptGradient.addColorStop(1, "#ff9d9d");
      } else {
        jlptGradient.addColorStop(0, "#8d3445");
        jlptGradient.addColorStop(0.52, "#5a1f2b");
        jlptGradient.addColorStop(1, "#32101a");
      }
      context.fillStyle = jlptGradient;
    } else {
      context.fillStyle = light ? "rgba(248, 252, 255, .98)" : "rgba(2, 2, 4, 1)";
    }
    context.shadowColor = color;
    context.shadowBlur = 12;
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.stroke();

    if (name === "JLPT N2") {
      context.beginPath();
      for (let index = 0; index < 6; index += 1) {
        const angle = Math.PI / 3 * index + Math.PI / 6;
        const innerRadius = 88;
        const x = center + Math.cos(angle) * innerRadius;
        const y = center + Math.sin(angle) * innerRadius;
        index ? context.lineTo(x, y) : context.moveTo(x, y);
      }
      context.closePath();
      context.strokeStyle = light ? "rgba(145, 34, 49, .42)" : "rgba(255, 224, 224, .45)";
      context.lineWidth = 3;
      context.stroke();
      context.beginPath();
      context.moveTo(72, 128);
      context.lineTo(94, 128);
      context.moveTo(162, 128);
      context.lineTo(184, 128);
      context.strokeStyle = light ? "rgba(145, 34, 49, .56)" : "rgba(255, 224, 224, .58)";
      context.lineWidth = 4;
      context.stroke();
    }

    context.beginPath();
    for (let index = 0; index < 6; index += 1) {
      const angle = Math.PI / 3 * index + Math.PI / 6;
      const innerRadius = 96;
      const x = center + Math.cos(angle) * innerRadius;
      const y = center + Math.sin(angle) * innerRadius;
      index ? context.lineTo(x, y) : context.moveTo(x, y);
    }
    context.closePath();
    context.strokeStyle = light ? "rgba(16, 33, 58, .24)" : "rgba(235, 248, 255, .24)";
    context.lineWidth = 1.5;
    context.stroke();

    if (name === "JLPT N2") {
      context.font = "800 27px Montserrat, sans-serif";
      context.fillStyle = light ? "#10213a" : "#ffffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("JLPT-N2", center, 128);
    } else if (icon) {
      context.font = `112px ${icon.family}`;
      const neutralBrand = ["GitHub", "Next.js", "Express.js"].includes(name);
      context.fillStyle = neutralBrand ? (light ? "#10213a" : "#ffffff") : color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.shadowColor = color;
      context.shadowBlur = 14;
      context.strokeStyle = light ? "rgba(255, 255, 255, .7)" : "rgba(0, 0, 0, .55)";
      context.lineWidth = 2;
      context.strokeText(icon.content, center, 128);
      context.fillText(icon.content, center, 128);
    }
    context.shadowBlur = 0;
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  addLinks() {
    const used = new Set();
    this.nodes.forEach((node, index) => {
      this.nodes
        .map((candidate, candidateIndex) => ({
          candidate,
          candidateIndex,
          distance: node.base.distanceTo(candidate.base),
        }))
        .filter(({ candidateIndex }) => candidateIndex !== index)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)
        .forEach(({ candidate, candidateIndex }) => {
          const key = [index, candidateIndex].sort().join(":");
          if (used.has(key)) return;
          used.add(key);
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
          const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: index % 2 ? 0x5d86ff : 0x35dcff,
              transparent: true,
              opacity: 0.42,
              blending: THREE.AdditiveBlending,
            })
          );
          this.nodeWorld.add(line);
          this.links.push({ line, from: node, to: candidate });
        });
    });
  }

  addParticles() {
    this.links.filter((_, index) => index % 2 === 0).forEach((link, index) => {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: index % 2 ? 0xa479ff : 0x3fe8ff, blending: THREE.AdditiveBlending })
      );
      this.nodeWorld.add(particle);
      this.particles.push({ particle, link, offset: index * 0.19 });
    });
  }

  bindEvents() {
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.visibilityChange);
    this.host.addEventListener("pointermove", this.pointerMove);
    this.host.addEventListener("pointerdown", this.pointerDown);
    this.host.addEventListener("pointerup", this.pointerUp);
    this.host.addEventListener("pointerleave", this.pointerUp);
  }

  pointerMove(event) {
    const bounds = this.host.getBoundingClientRect();
    this.pointer.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    this.pointer.y = -(event.clientY - bounds.top) / bounds.height * 2 + 1;
    if (this.drag.active) {
      this.velocity.y = (event.clientX - this.drag.x) * 0.004;
      this.velocity.x = (event.clientY - this.drag.y) * 0.003;
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
    }
    this.updateHover();
  }

  pointerDown(event) {
    const bounds = this.host.getBoundingClientRect();
    this.pointer.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    this.pointer.y = -(event.clientY - bounds.top) / bounds.height * 2 + 1;
    this.drag.active = true;
    this.drag.x = event.clientX;
    this.drag.y = event.clientY;
    this.drag.moved = false;
    this.updateHover();
    this.host.setPointerCapture?.(event.pointerId);
  }

  pointerUp(event) {
    this.drag.active = false;
    if (event.type === "pointerleave" && event.pointerType !== "touch") {
      this.setHovered(null);
    }
    if (event.pointerType === "touch" && this.hoveredNode) {
      clearTimeout(this.touchTooltipTimer);
      this.touchTooltipTimer = setTimeout(() => this.setHovered(null), 3200);
    }
    this.host.releasePointerCapture?.(event.pointerId);
  }

  updateHover() {
    if (!this.renderer || !this.nodes.length) return;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.nodes.filter((node) => node.mesh).map((node) => node.mesh);
    const hit = this.raycaster.intersectObjects(meshes)[0];
    this.setHovered(hit?.object?.userData?.node || null);
  }

  setHovered(node) {
    if (this.hoveredNode === node) return;
    this.hoveredNode = node;
    if (!this.tooltip) return;
    if (!node) {
      this.tooltip.classList.remove("is-visible");
      this.tooltip.setAttribute("aria-hidden", "true");
      return;
    }
    this.tooltip.textContent = node.name;
    this.tooltip.classList.add("is-visible");
    this.tooltip.setAttribute("aria-hidden", "false");
    this.positionTooltip(node);
  }

  positionTooltip(node) {
    if (!this.tooltip || !node?.mesh) return;
    const point = node.group.getWorldPosition(new THREE.Vector3()).project(this.camera);
    const left = (point.x + 1) * 50;
    const top = (-point.y + 1) * 50;
    this.tooltip.style.left = `${Math.max(8, Math.min(92, left))}%`;
    this.tooltip.style.top = `${Math.max(8, Math.min(88, top))}%`;
  }

  clampNodeToViewport(position) {
    const margin = 0.34;
    const distance = Math.max(0.1, this.camera.position.z - position.z);
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * distance;
    const halfWidth = halfHeight * this.camera.aspect;
    position.x = THREE.MathUtils.clamp(position.x, -Math.max(0.1, halfWidth - margin), Math.max(0.1, halfWidth - margin));
    position.y = THREE.MathUtils.clamp(position.y, -Math.max(0.1, halfHeight - margin), Math.max(0.1, halfHeight - margin));
    return position;
  }

  visibilityChange() {
    this.hidden = document.hidden;
    if (!this.hidden) {
      this.clock.getDelta();
      this.lastFrame = performance.now();
      this.animate();
    }
  }

  showFallback() {
    this.container.classList.add("is-fallback");
    if (this.tooltip) {
      this.tooltip.textContent = "Technology skills";
      this.tooltip.classList.add("is-visible");
      this.tooltip.setAttribute("aria-hidden", "false");
    }
    this.host.innerHTML = `<div class="technology-skills-fallback">${TECHNOLOGIES.map(([name, , color]) => `<span style="--technology-color:${color}">${name}</span>`).join("")}</div>`;
  }

  resize() {
    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    if (this.hidden) return;
    this.frame = requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += delta;
    const time = this.elapsed;
    const staticMode = reduceMotion.matches;
    if (!staticMode && !this.drag.active) this.velocity.y += 0.000015;
    this.velocity.x *= 0.94;
    this.velocity.y *= 0.985;
    // Keep the globe's rotation independent from the icon layer. Dragging
    // rotates only the sphere, while each icon moves on its own local path.
    this.globeWorld.rotation.x += this.velocity.x;
    this.globeWorld.rotation.y += this.velocity.y;

    this.nodes.forEach((node) => {
      if (!node.mesh) return;
      const angle = staticMode ? 0 : time * node.speed * node.direction + node.phase;
      const position = node.base.clone().applyAxisAngle(node.axis, angle * 0.9);
      if (!staticMode && node.name !== "JLPT N2") {
        position.addScaledVector(
          node.axis,
          Math.sin(time * node.pulseSpeed + node.phase) * 0.045
        );
      }
      this.clampNodeToViewport(position);
      node.group.position.copy(position);
      const distance = this.camera.position.distanceTo(position);
      const depth = THREE.MathUtils.clamp((this.camera.position.z - distance) / 5.5, 0, 1);
      const staticBadge = node.name === "JLPT N2";
      const pulse = staticMode || staticBadge
        ? 1
        : 1 + Math.sin(time * node.pulseSpeed + node.phase) * node.pulseAmount;
      const twinkle = staticMode || staticBadge
        ? 1
        : 0.9 + (Math.sin(time * (node.pulseSpeed * 1.35) + node.phase * 1.7) + 1) * 0.05;
      const selected = node === this.hoveredNode;
      node.mesh.scale.setScalar((0.58 + depth * 0.18) * pulse * (selected ? 1.18 : 1));
      node.mesh.material.opacity = Math.min(
        1,
        (0.58 + depth * 0.42) * twinkle + (selected ? 0.12 : 0)
      );
      node.mesh.material.color.set(0xffffff);
      if (selected) this.positionTooltip(node);
    });

    this.links.forEach((link) => {
      const from = link.from.group.position;
      const to = link.to.group.position;
      const positions = link.line.geometry.attributes.position.array;
      positions[0] = from.x; positions[1] = from.y; positions[2] = from.z;
      positions[3] = to.x; positions[4] = to.y; positions[5] = to.z;
      link.line.geometry.attributes.position.needsUpdate = true;
    });
    this.particles.forEach((item) => {
      const progress = staticMode ? 0.5 : (time * 0.13 + item.offset) % 1;
      item.particle.position.lerpVectors(item.link.from.group.position, item.link.to.group.position, progress);
    });
    this.stars.rotation.y += staticMode ? 0 : 0.0001;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.visibilityChange);
    this.host.removeEventListener("pointermove", this.pointerMove);
    this.host.removeEventListener("pointerdown", this.pointerDown);
    this.host.removeEventListener("pointerup", this.pointerUp);
    this.host.removeEventListener("pointerleave", this.pointerUp);
    clearTimeout(this.touchTooltipTimer);
    this.themeObserver?.disconnect();
    this.scene?.traverse((object) => {
      object.geometry?.dispose();
      if (object.material) {
        object.material.map?.dispose();
        object.material.dispose();
      }
    });
    this.renderer?.dispose();
  }
}

function initializeTechnologySkillsGlobe(attempt = 0) {
  if (!window.THREE) {
    if (attempt < 50) {
      window.setTimeout(() => initializeTechnologySkillsGlobe(attempt + 1), 100);
    }
    return;
  }

  const globe = new TechnologySkillsGlobe();
  if (globe.container) {
    window.__technologySkillsGlobe = globe;
    globe.start().catch(() => globe.showFallback());
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => initializeTechnologySkillsGlobe(), { once: true });
} else {
  initializeTechnologySkillsGlobe();
}
