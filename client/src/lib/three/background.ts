import * as THREE from 'three';
import { WebGLManager } from './WebGLManager';

// Define options interface
export interface BackgroundOptions {
  particleCount?: number;
  frameRate?: number;
  disableMouseTracking?: boolean;
  quality?: 'low' | 'medium' | 'high';
}

export class BackgroundAnimation {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points;
  private animationId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private lastTime = 0;
  private frameRateLimiter: number;
  private isMobile = false;
  private isPaused = false;
  private disableMouseTracking = false;
  private frameCount = 0;
  private memoryWarningCount = 0;
  private lastMemoryCheck = 0;
  private isFirefox = false;
  private webGLManager: WebGLManager;
  private contextId: string;
  private quality: 'low' | 'medium' | 'high';
  private isDestroyed = false;
  
  constructor(container: HTMLElement, options: BackgroundOptions = {}) {
    // Get WebGL manager instance
    this.webGLManager = WebGLManager.getInstance();
    this.contextId = 'background-' + Math.random().toString(36).substr(2, 9);
    
    // Detect browser
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // Check if mobile device for reduced effects
    this.isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
    
    // Set quality based on device/browser
    this.quality = options.quality || 
                  (this.isMobile ? 'low' : 
                   this.isFirefox ? 'low' : 'medium');
    
    // Set options with defaults based on quality and device
    let particleCount;
    switch (this.quality) {
      case 'low': 
        particleCount = 300;
        break;
      case 'medium': 
        particleCount = 500;
        break;
      case 'high': 
        particleCount = 800;
        break;
      default:
        particleCount = this.isMobile ? 300 : 500;
    }
    
    particleCount = options.particleCount || particleCount;
    this.frameRateLimiter = 1000 / (options.frameRate || (this.isMobile ? 20 : this.isFirefox ? 15 : 30));
    this.disableMouseTracking = !!options.disableMouseTracking || this.isMobile || this.isFirefox;
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 30;
    
    // Create renderer using WebGLManager with optimized settings based on quality
    const rendererOptions: THREE.WebGLRendererParameters = {
      antialias: this.quality === 'high',
      alpha: true,
      powerPreference: 'high-performance',
      precision: this.quality === 'low' ? 'lowp' : 'mediump'
    };
    
    this.renderer = this.webGLManager.createContext(this.contextId, container, rendererOptions);
    
    // Create particles with optimized geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * (this.isMobile ? 60 : 100);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Optimize material based on quality
    const particleSize = this.quality === 'low' ? 0.08 : this.quality === 'medium' ? 0.1 : 0.12;
    const particlesMaterial = new THREE.PointsMaterial({
      size: particleSize,
      color: new THREE.Color('#6366f1'),
      transparent: true,
      opacity: this.quality === 'low' ? 0.5 : 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: this.quality !== 'low'
    });
    
    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
    
    // Add event listeners with passive option for better performance
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    if (!this.disableMouseTracking) {
      document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    }
    
    // Monitor for potential memory issues in Firefox
    if (this.isFirefox) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    // Start animation
    this.lastTime = performance.now();
    this.lastMemoryCheck = this.lastTime;
    this.animate();
  }
  
  handleResize = () => {
    if (this.isDestroyed) return;
    
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  handleMouseMove = (event: MouseEvent) => {
    if (this.isDestroyed) return;
    
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  
  handleVisibilityChange = () => {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  };
  
  // Check memory performance (Firefox specific)
  checkMemoryPerformance = () => {
    if (this.isDestroyed) return;
    
    // Only check every 200 frames to avoid overhead
    if (this.isFirefox && this.frameCount % 200 === 0) {
      const now = performance.now();
      const timeSinceLastCheck = now - this.lastMemoryCheck;
      
      // If we're taking too long between frames, it might indicate memory issues
      if (timeSinceLastCheck > 200) {
        this.memoryWarningCount++;
        console.warn(`Performance warning: Frame time spike detected (${Math.round(timeSinceLastCheck)}ms)`);
        
        // If we've had multiple warnings, start reducing quality
        if (this.memoryWarningCount > 3) {
          this.reduceQuality();
        }
      } else {
        // Reset the warning count if performance is good
        this.memoryWarningCount = Math.max(0, this.memoryWarningCount - 1);
      }
      
      this.lastMemoryCheck = now;
    }
  };
  
  // Reduce quality to prevent crashes
  reduceQuality = () => {
    if (this.isDestroyed) return;
    
    // If we've already reduced quality significantly, disable animation
    if (this.frameRateLimiter >= 1000 / 5) {
      console.warn('Performance issues detected. Disabling particles animation.');
      localStorage.setItem('enable-particles', 'false');
      this.cleanup();
      return;
    }
    
    // Otherwise, reduce frame rate
    this.frameRateLimiter = Math.min(1000 / 5, this.frameRateLimiter * 1.5);
    console.warn(`Reducing animation quality. New frame rate: ${Math.round(1000 / this.frameRateLimiter)} FPS`);
    
    // Force a garbage collection pause
    this.pause();
    setTimeout(() => {
      if (!this.isDestroyed) {
        this.resume();
      }
    }, 100);
  };
  
  animate = () => {
    if (this.isDestroyed) return;
    
    this.animationId = requestAnimationFrame(this.animate);
    this.frameCount++;
    
    // Skip rendering if paused
    if (this.isPaused) {
      return;
    }
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    // Limit frame rate to improve performance
    if (deltaTime < this.frameRateLimiter) {
      return;
    }
    
    // Check for memory issues in Firefox
    this.checkMemoryPerformance();
    
    // Smooth mouse movement
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    
    // Rotate particles with lower values for better performance
    this.particles.rotation.x += 0.0001;
    this.particles.rotation.y += 0.0002;
    
    // Move particles based on mouse (reduced intensity)
    if (!this.disableMouseTracking) {
      this.particles.rotation.x += this.mouseY * 0.0001;
      this.particles.rotation.y += this.mouseX * 0.0001;
    }
    
    try {
      this.renderer.render(this.scene, this.camera);
      this.webGLManager.updateLastRenderTime(this.contextId);
    } catch (error) {
      console.error('Rendering error:', error);
      this.reduceQuality();
    }
    
    this.lastTime = currentTime;
  };
  
  // Method to pause animation
  pause = () => {
    this.isPaused = true;
  };
  
  // Method to resume animation
  resume = () => {
    if (this.isDestroyed) return;
    
    this.isPaused = false;
    this.lastTime = performance.now(); // Reset time to avoid jumps
  };
  
  cleanup = () => {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    window.removeEventListener('resize', this.handleResize);
    if (!this.disableMouseTracking) {
      document.removeEventListener('mousemove', this.handleMouseMove);
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Clean up THREE.js resources
    if (this.particles) {
      this.scene.remove(this.particles);
      if (this.particles.geometry) {
        (this.particles.geometry as THREE.BufferGeometry).dispose();
      }
      if (this.particles.material) {
        (this.particles.material as THREE.Material).dispose();
      }
    }
    
    // Use WebGLManager to dispose context
    this.webGLManager.disposeContext(this.contextId);
  };
}
