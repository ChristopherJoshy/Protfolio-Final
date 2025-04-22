import * as THREE from 'three';

export class WebGLManager {
  private static instance: WebGLManager;
  private contexts: Map<string, THREE.WebGLRenderer> = new Map();
  private activeContext: string | null = null;
  private readonly MAX_CONTEXTS = 2; // Reduced from 3 to 2 to avoid memory issues
  private lastRenderTime: Map<string, number> = new Map();
  private cleanupInterval: number | null = null;

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
    // If context already exists, return it
    if (this.contexts.has(id)) {
      return this.contexts.get(id)!;
    }

    // If we've reached the maximum number of contexts, dispose the oldest one
    if (this.contexts.size >= this.MAX_CONTEXTS) {
      // Find the least recently used context
      let oldestId = Array.from(this.contexts.keys())[0];
      let oldestTime = this.lastRenderTime.get(oldestId) || 0;
      
      this.lastRenderTime.forEach((time, contextId) => {
        if (time < oldestTime) {
          oldestTime = time;
          oldestId = contextId;
        }
      });
      
      console.log(`WebGLManager: Maximum contexts reached, disposing ${oldestId}`);
      this.disposeContext(oldestId);
    }

    try {
      // Create new renderer with error handling
      const renderer = new THREE.WebGLRenderer({
        antialias: false, // Set to false for better performance
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'mediump', // Use mediump for better performance
        ...options
      });

      // Set size and pixel ratio (limit pixel ratio for performance)
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Add to container
      container.appendChild(renderer.domElement);

      // Store context
      this.contexts.set(id, renderer);
      this.activeContext = id;
      this.lastRenderTime.set(id, performance.now());

      return renderer;
    } catch (error) {
      console.error('Failed to create WebGL context:', error);
      
      // Create a fallback div to indicate WebGL failure
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.width = '100%';
      fallbackDiv.style.height = '100%';
      fallbackDiv.style.backgroundColor = '#121212';
      container.appendChild(fallbackDiv);
      
      // Return a dummy renderer that does nothing
      const dummyRenderer = {
        setSize: () => {},
        render: () => {},
        dispose: () => {},
        domElement: fallbackDiv,
      } as unknown as THREE.WebGLRenderer;
      
      return dummyRenderer;
    }
  }

  getContext(id: string): THREE.WebGLRenderer | null {
    return this.contexts.get(id) || null;
  }

  // Call this method whenever a renderer is used
  updateLastRenderTime(id: string) {
    if (this.contexts.has(id)) {
      this.lastRenderTime.set(id, performance.now());
    }
  }

  // Check and dispose renderers that haven't been used in a while
  private checkInactiveRenderers() {
    const now = performance.now();
    const inactiveThreshold = 60000; // 1 minute
    
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

  disposeContext(id: string) {
    const renderer = this.contexts.get(id);
    if (renderer) {
      try {
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.remove();
        }
      } catch (error) {
        console.error('Error disposing WebGL context:', error);
      }
      
      this.contexts.delete(id);
      this.lastRenderTime.delete(id);
      
      if (this.activeContext === id) {
        this.activeContext = null;
      }
    }
  }

  disposeAll() {
    this.contexts.forEach((renderer, id) => {
      this.disposeContext(id);
    });
    
    if (this.cleanupInterval !== null) {
      window.clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
} 