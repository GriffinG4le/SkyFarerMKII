import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class ModelViewerService {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentModel = null;
    this.container = null;
  }

  /**
   * Initialize the Three.js scene
   * @param {HTMLElement} container - DOM element to render the model
   */
  initialize(container) {
    this.container = container;
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Controls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Lighting
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.animate();
  }

  /**
   * Set up scene lighting
   * @private
   */
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    this.scene.add(hemisphereLight);
  }

  /**
   * Load and display an aircraft model
   * @param {string} modelUrl - URL to the GLTF model
   * @returns {Promise} Resolves when model is loaded
   */
  async loadModel(modelUrl) {
    const loader = new GLTFLoader();

    try {
      // Remove existing model if any
      if (this.currentModel) {
        this.scene.remove(this.currentModel);
      }

      const gltf = await loader.loadAsync(modelUrl);
      this.currentModel = gltf.scene;
      
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(this.currentModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 5 / maxDim; // Scale to reasonable size
      
      this.currentModel.position.sub(center);
      this.currentModel.scale.multiplyScalar(scale);
      
      this.scene.add(this.currentModel);
      
      // Reset camera position
      this.camera.position.set(0, 5, 10);
      this.controls.reset();

    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load aircraft model');
    }
  }

  /**
   * Handle window resize events
   * @private
   */
  onWindowResize() {
    if (!this.container) return;
    
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  /**
   * Animation loop
   * @private
   */
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Highlight a specific feature of the aircraft
   * @param {string} featureName - Name of the feature to highlight
   */
  highlightFeature(featureName) {
    // Implementation for highlighting specific features
    // This would involve adding visual indicators or changing materials
    // based on the selected feature
  }

  /**
   * Clean up Three.js resources
   */
  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
    // Clean up any materials, geometries, and textures
    this.scene?.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
}

export default new ModelViewerService(); 