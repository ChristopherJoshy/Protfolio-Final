import * as THREE from 'three';

// Define options interface
export interface BackgroundOptions {
  particleCount?: number;
  frameRate?: number;
  disableMouseTracking?: boolean;
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
  
  constructor(container: HTMLElement, options: BackgroundOptions = {}) {
    // Detect Firefox
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // Set options with defaults
    const particleCount = options.particleCount || (this.isMobile ? 500 : 800);
    this.frameRateLimiter = 1000 / (options.frameRate || 30); // Default to 30 FPS
    this.disableMouseTracking = !!options.disableMouseTracking;
    
    // Check if mobile device for reduced effects
    this.isMobile = window.innerWidth < 768;
    
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
    
    // Create renderer with precision optimization
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable antialiasing for performance
      alpha: true,
      powerPreference: 'high-performance',
      precision: this.isMobile ? 'lowp' : 'mediump' // Lower precision on mobile
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Lower pixel ratio for better performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    this.renderer.setPixelRatio(pixelRatio);
    
    container.appendChild(this.renderer.domElement);
    
    // Create particles with reduced count
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Optimize material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.12,
      color: new THREE.Color('#6366f1'),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false // Performance optimization
    });
    
    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
    
    // Add event listeners with passive option for better performance
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    // Only add mousemove on desktop (not mobile) and if not disabled
    if (!this.isMobile && !this.disableMouseTracking) {
      document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    }
    
    // Monitor for potential memory issues in Firefox
    if (this.isFirefox) {
      // Initial reduced refresh rate for Firefox
      this.frameRateLimiter = 1000 / 15; // 15 FPS for Firefox
      
      // Add visibility change listener to pause animation when tab is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      });
    }
    
    // Start animation
    this.lastTime = performance.now();
    this.lastMemoryCheck = this.lastTime;
    this.animate();
  }
  
  handleResize = () => {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  handleMouseMove = (event: MouseEvent) => {
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  
  // Check memory performance (Firefox specific)
  checkMemoryPerformance = () => {
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
    // If we've already reduced quality significantly, disable animation
    if (this.frameRateLimiter >= 1000 / 5) {
      console.warn('Performance issues detected. Disabling particles animation.');
      localStorage.setItem('enable-particles', 'false');
      this.cleanup();
      window.location.reload();
      return;
    }
    
    // Otherwise, reduce frame rate
    this.frameRateLimiter = Math.min(1000 / 5, this.frameRateLimiter * 1.5);
    console.warn(`Reducing animation quality. New frame rate: ${Math.round(1000 / this.frameRateLimiter)} FPS`);
    
    // Force a garbage collection pause
    this.pause();
    setTimeout(() => this.resume(), 100);
  };
  
  animate = () => {
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
    this.particles.rotation.x += 0.0002;
    this.particles.rotation.y += 0.0003;
    
    // Move particles based on mouse (reduced intensity)
    if (!this.disableMouseTracking) {
      this.particles.rotation.x += this.mouseY * 0.0002;
      this.particles.rotation.y += this.mouseX * 0.0002;
    }
    
    try {
      this.renderer.render(this.scene, this.camera);
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
    this.isPaused = false;
    this.lastTime = performance.now(); // Reset time to avoid jumps
  };
  
  cleanup = () => {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    window.removeEventListener('resize', this.handleResize);
    if (!this.isMobile && !this.disableMouseTracking) {
      document.removeEventListener('mousemove', this.handleMouseMove);
    }
    
    // Remove visibility change listener if we added it
    if (this.isFirefox) {
      document.removeEventListener('visibilitychange', () => {});
    }
    
    // Clean up THREE.js resources
    this.scene.remove(this.particles);
    (this.particles.geometry as THREE.BufferGeometry).dispose();
    (this.particles.material as THREE.Material).dispose();
    this.renderer.dispose();
    
    // Remove the domElement only if it's still in the DOM
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.remove();
    }
  };
}
