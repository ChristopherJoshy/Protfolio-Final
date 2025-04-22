import * as THREE from 'three';
import { WebGLRenderer } from 'three';

export class BackgroundAnimation {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: WebGLRenderer;
  private particles: THREE.Points;
  private animationFrameId: number | null = null;
  private container: HTMLElement;
  private isActive = true;

  constructor(renderer: WebGLRenderer, container: HTMLElement) {
    this.renderer = renderer;
    this.container = container;
    this.scene = new THREE.Scene();
    
    const { width, height } = container.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < 5000; i++) {
      vertices.push(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      colors.push(Math.random(), Math.random(), Math.random());
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.animate();
    this.resize(width, height);
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public updateTheme(theme: 'light' | 'dark'): void {
    const colors: number[] = [];
    const positions = (this.particles.geometry.getAttribute('position') as THREE.BufferAttribute).array;

    for (let i = 0; i < positions.length; i += 3) {
      if (theme === 'dark') {
        colors.push(0.8 + Math.random() * 0.2, 0.2, 0.5 + Math.random() * 0.5);
      } else {
        colors.push(0.2 + Math.random() * 0.3, 0.5 + Math.random() * 0.5, 1.0);
      }
    }

    this.particles.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.particles.geometry.attributes.color.needsUpdate = true;
  }

  public pause(): void {
    this.isActive = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public resume(): void {
    if (!this.isActive) {
      this.isActive = true;
      this.animate();
    }
  }

  public cleanup(): void {
    this.pause();
    this.scene.remove(this.particles);
    this.particles.geometry.dispose();
    (this.particles.material as THREE.Material).dispose();
  }

  private animate = (): void => {
    if (!this.isActive) return;

    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.0005;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
} 