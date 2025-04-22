import * as THREE from 'three';

export class WebGLManager {
  private static instance: WebGLManager;
  private contexts: Map<string, THREE.WebGLRenderer> = new Map();
  private activeContext: string | null = null;
  private readonly MAX_CONTEXTS = 1; // Only allow one context at a time
  private lastRenderTime: Map<string, number> = new Map();
  private cleanupInterval: number | null = null;
  private isDisposing = false;

  private constructor() {
    // Set up automatic cleanup of inactive renderers
    this.cleanupInterval = window.setInterval(() => this.checkInactiveRenderers(), 30000);
  }

  static getInstance(): WebGLManager {
    if (!WebGLManager.instance) {
      WebGLManager.instance = new WebGLManager();
    }
    return WebGLManager.instance;
  }

  createContext(id: string, container: HTMLElement, options: THREE.WebGLRendererParameters = {}): THREE.WebGLRenderer {
    if (this.isDisposing) return this.createFallbackRenderer(container);
    
    // If context already exists, dispose it first
    if (this.contexts.has(id)) {
      this.disposeContext(id);
    }

    // If we've reached the maximum number of contexts, dispose all existing ones
    if (this.contexts.size >= this.MAX_CONTEXTS) {
      console.log('WebGLManager: Maximum contexts reached, disposing all contexts');
      this.disposeAllContexts();
    }

    try {
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'mediump',
        ...options
      });

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(1);

      // Create a wrapper div to hold the canvas
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.appendChild(renderer.domElement);
      container.appendChild(wrapper);

      this.contexts.set(id, renderer);
      this.activeContext = id;
      this.lastRenderTime.set(id, performance.now());

      return renderer;
    } catch (error) {
      console.error('Failed to create WebGL context:', error);
      return this.createFallbackRenderer(container);
    }
  }

  private createFallbackRenderer(container: HTMLElement): THREE.WebGLRenderer {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.width = '100%';
    fallbackDiv.style.height = '100%';
    fallbackDiv.style.backgroundColor = '#121212';
    container.appendChild(fallbackDiv);
    
    return {
      setSize: () => {},
      render: () => {},
      dispose: () => {},
      domElement: fallbackDiv,
    } as unknown as THREE.WebGLRenderer;
  }

  private disposeAllContexts(): void {
    this.isDisposing = true;
    const contextIds = Array.from(this.contexts.keys());
    contextIds.forEach(id => this.disposeContext(id));
    this.isDisposing = false;
  }

  getContext(id: string): THREE.WebGLRenderer | null {
    return this.contexts.get(id) || null;
  }

  updateLastRenderTime(id: string): void {
    this.lastRenderTime.set(id, performance.now());
  }

  private checkInactiveRenderers() {
    const now = performance.now();
    const inactiveThreshold = 30000; // 30 seconds
    
    this.lastRenderTime.forEach((time, id) => {
      if (now - time > inactiveThreshold) {
        console.log(`WebGLManager: Disposing inactive context ${id}`);
        this.disposeContext(id);
      }
    });
  }

  setActiveContext(id: string) {
    if (this.contexts.has(id)) {
      this.activeContext = id;
      this.updateLastRenderTime(id);
    }
  }

  disposeContext(id: string): void {
    const renderer = this.contexts.get(id);
    if (renderer) {
      try {
        // Remove from DOM safely
        const canvas = renderer.domElement;
        const wrapper = canvas.parentElement;
        if (wrapper && wrapper.parentElement) {
          wrapper.parentElement.removeChild(wrapper);
        } else if (canvas.parentElement) {
          canvas.parentElement.removeChild(canvas);
        }
        
        // Dispose renderer and its resources
        renderer.dispose();
        renderer.forceContextLoss();
        
        // Clear from maps
        this.contexts.delete(id);
        this.lastRenderTime.delete(id);
        
        if (this.activeContext === id) {
          this.activeContext = null;
        }
      } catch (error) {
        console.error('Error disposing WebGL context:', error);
      }
    }
  }

  // Cleanup method to be called when the application is unmounted
  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.disposeAllContexts();
  }
} 