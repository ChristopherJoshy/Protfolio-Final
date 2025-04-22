import * as THREE from 'three';
import { WebGLManager } from './WebGLManager';

interface SkillNode {
  name: string;
  level: number; // 0-100
  position: THREE.Vector3;
  color: string;
}

export class SkillVisualization {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private skillNodes: THREE.Mesh[] = [];
  private skillData: SkillNode[] = [];
  private nodeLabels: HTMLDivElement[] = [];
  private lines: THREE.Line[] = [];
  private skillsGroup: THREE.Group;
  private animationId: number | null = null;
  private hoveredSkill: number | null = null;
  private webGLManager: WebGLManager;
  private contextId: string;

  constructor(
    container: HTMLElement, 
    skills: {name: string, level: number, color: string}[] = []
  ) {
    // Get WebGL manager instance
    this.webGLManager = WebGLManager.getInstance();
    this.contextId = 'skills-' + Math.random().toString(36).substr(2, 9);
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      60, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 15;
    
    // Create renderer using WebGLManager
    this.renderer = this.webGLManager.createContext(this.contextId, container, {
      antialias: true,
      alpha: true
    });
    
    // Create raycaster for interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Create skill nodes group
    this.skillsGroup = new THREE.Group();
    this.scene.add(this.skillsGroup);
    
    // Create skills
    if (skills.length === 0) {
      // Default skills if none provided
      this.skillData = [
        { name: 'JavaScript', level: 90, position: new THREE.Vector3(0, 3, 0), color: '#f0db4f' },
        { name: 'React', level: 85, position: new THREE.Vector3(4, 1, 0), color: '#61dbfb' },
        { name: 'Node.js', level: 80, position: new THREE.Vector3(3, -2, 0), color: '#3c873a' },
        { name: 'Python', level: 75, position: new THREE.Vector3(-2, 2, 0), color: '#306998' },
        { name: 'Java', level: 70, position: new THREE.Vector3(-4, -1, 0), color: '#f89820' },
        { name: 'C++', level: 65, position: new THREE.Vector3(-3, -3, 0), color: '#9c033a' },
        { name: 'Three.js', level: 60, position: new THREE.Vector3(0, -4, 0), color: '#049EF4' },
      ];
    } else {
      // Position skills in a circle
      const radius = 4;
      this.skillData = skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return {
          name: skill.name,
          level: skill.level,
          position: new THREE.Vector3(x, y, 0),
          color: skill.color
        };
      });
    }
    
    // Create node meshes
    this.createSkillNodes();
    
    // Connect nodes with lines
    this.connectNodes();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    container.addEventListener('mousemove', this.handleMouseMove);
    
    // Start animation
    this.animate();
  }
  
  createSkillNodes() {
    this.skillData.forEach((skill, index) => {
      // Create sphere for each skill
      const size = 0.3 + (skill.level / 100) * 0.5;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(skill.color),
        transparent: true,
        opacity: 0.7
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(skill.position);
      mesh.userData.index = index;
      
      this.skillsGroup.add(mesh);
      this.skillNodes.push(mesh);
      
      // Create HTML label
      const label = document.createElement('div');
      label.className = 'skill-label';
      label.textContent = skill.name;
      label.style.position = 'absolute';
      label.style.color = 'white';
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      label.style.padding = '2px 5px';
      label.style.borderRadius = '4px';
      label.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      label.style.pointerEvents = 'none';
      label.style.opacity = '0';
      label.style.transition = 'opacity 0.2s ease';
      
      this.renderer.domElement.parentElement?.appendChild(label);
      this.nodeLabels.push(label);
    });
  }
  
  connectNodes() {
    // Create lines between nodes
    for (let i = 0; i < this.skillNodes.length; i++) {
      for (let j = i + 1; j < this.skillNodes.length; j++) {
        const points = [
          this.skillNodes[i].position,
          this.skillNodes[j].position
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
          color: 0x444444,
          transparent: true,
          opacity: 0.3
        });
        
        const line = new THREE.Line(geometry, material);
        this.skillsGroup.add(line);
        this.lines.push(line);
      }
    }
  }
  
  handleResize = () => {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  handleMouseMove = (event: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };
  
  updateLabels() {
    // Update label positions based on 3D positions
    this.skillNodes.forEach((node, index) => {
      const position = node.position.clone();
      position.project(this.camera);
      
      const x = (position.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
      const y = (-position.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;
      
      const label = this.nodeLabels[index];
      label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      
      // Show label if hovering over node
      if (this.hoveredSkill === index) {
        label.style.opacity = '1';
      } else {
        label.style.opacity = '0';
      }
    });
  }
  
  checkIntersection() {
    // Check for intersections with skill nodes
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.skillNodes);
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object as THREE.Mesh;
      const index = intersectedObject.userData.index;
      
      if (this.hoveredSkill !== index) {
        // Reset previous hover state
        if (this.hoveredSkill !== null) {
          this.skillNodes[this.hoveredSkill].scale.set(1, 1, 1);
        }
        
        // Set new hover state
        this.hoveredSkill = index;
        intersectedObject.scale.set(1.2, 1.2, 1.2);
      }
    } else if (this.hoveredSkill !== null) {
      // Reset hover state when not hovering any node
      this.skillNodes[this.hoveredSkill].scale.set(1, 1, 1);
      this.hoveredSkill = null;
    }
  }
  
  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // Rotate skill group
    this.skillsGroup.rotation.y += 0.002;
    
    // Check for interactions
    this.checkIntersection();
    
    // Update label positions
    this.updateLabels();
    
    this.renderer.render(this.scene, this.camera);
  };
  
  cleanup = () => {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('mousemove', this.handleMouseMove);
    
    // Remove HTML labels
    this.nodeLabels.forEach(label => {
      label.remove();
    });
    
    // Clean up THREE.js resources
    this.skillNodes.forEach(node => {
      (node.geometry as THREE.BufferGeometry).dispose();
      (node.material as THREE.Material).dispose();
    });
    
    this.lines.forEach(line => {
      (line.geometry as THREE.BufferGeometry).dispose();
      (line.material as THREE.Material).dispose();
    });
    
    this.scene.remove(this.skillsGroup);
    
    // Use WebGLManager to dispose context
    this.webGLManager.disposeContext(this.contextId);
  };
}
