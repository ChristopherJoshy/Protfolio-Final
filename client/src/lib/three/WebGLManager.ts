import * as THREE from 'three';

export class WebGLManager {
  private static instance: WebGLManager;
  private contexts: Map<string, THREE.WebGLRenderer> = new Map();
  private activeContext: string | null = null;
  private readonly MAX_CONTEXTS = 3; // Limit number of active contexts

  private constructor() {}

  static getInstance(): WebGLManager {
    if (!WebGLManager.instance) {
      WebGLManager.instance = new WebGLManager();
    }
    return WebGLManager.instance;
  }

  createContext(id: string, container: HTMLElement, options: THREE.WebGLRendererParameters = {}): THREE.WebGLRenderer {
    // If context already exists, return it
    if (this.contexts.has(id)) {
      return this.contexts.get(id)!;
    }

    // If we've reached the maximum number of contexts, dispose the oldest one
    if (this.contexts.size >= this.MAX_CONTEXTS) {
      const oldestId = Array.from(this.contexts.keys())[0];
      this.disposeContext(oldestId);
    }

    // Create new renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      ...options
    });

    // Set size and pixel ratio
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add to container
    container.appendChild(renderer.domElement);

    // Store context
    this.contexts.set(id, renderer);
    this.activeContext = id;

    return renderer;
  }

  getContext(id: string): THREE.WebGLRenderer | null {
    return this.contexts.get(id) || null;
  }

  setActiveContext(id: string) {
    if (this.contexts.has(id)) {
      this.activeContext = id;
    }
  }

  disposeContext(id: string) {
    const renderer = this.contexts.get(id);
    if (renderer) {
      renderer.dispose();
      renderer.domElement.remove();
      this.contexts.delete(id);
      
      if (this.activeContext === id) {
        this.activeContext = null;
      }
    }
  }

  disposeAll() {
    this.contexts.forEach((renderer, id) => {
      this.disposeContext(id);
    });
  }
} 