import * as THREE from 'three';

export class FloatingCube {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;
  private animationId: number | null = null;

  constructor(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Create cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Create gradient material
    const gradientTexture = this.createGradientTexture('#6366f1', '#10b981');
    const material = new THREE.MeshBasicMaterial({ 
      map: gradientTexture,
      transparent: true,
      opacity: 0.8
    });
    
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    
    // Start animation
    this.animate();
  }
  
  createGradientTexture(colorA: string, colorB: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, colorA);
    gradient.addColorStop(1, colorB);
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  
  handleResize = () => {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // Rotate cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    
    // Float up and down
    this.cube.position.y = Math.sin(Date.now() * 0.001) * 0.5;
    
    this.renderer.render(this.scene, this.camera);
  };
  
  cleanup = () => {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    
    window.removeEventListener('resize', this.handleResize);
    
    // Clean up THREE.js resources
    this.scene.remove(this.cube);
    (this.cube.geometry as THREE.BufferGeometry).dispose();
    (this.cube.material as THREE.Material).dispose();
    this.renderer.domElement.remove();
    this.renderer.dispose();
  };
}
