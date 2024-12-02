import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AIRCRAFT_CATALOG } from '../../src/services/AircraftService';

class AircraftViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.setupEventListeners();
        
        this.currentModel = null;
        this.isLoading = false;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xf5f5f5);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        document.getElementById('rotate-left').addEventListener('click', () => {
            this.rotateModel(-Math.PI / 4);
        });
        
        document.getElementById('rotate-right').addEventListener('click', () => {
            this.rotateModel(Math.PI / 4);
        });
        
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });
    }

    async loadModel(modelPath, aircraftData) {
        this.showLoading(true);
        const loadingText = document.getElementById('loading');

        try {
            const loader = new GLTFLoader();
            
            // Add loading manager
            const manager = new THREE.LoadingManager();
            manager.onProgress = (url, itemsLoaded, itemsTotal) => {
                loadingText.textContent = `Loading Model... ${Math.round((itemsLoaded / itemsTotal) * 100)}%`;
            };
            loader.manager = manager;

            const gltf = await loader.loadAsync(`/models/${modelPath}`);

            if (this.currentModel) {
                this.scene.remove(this.currentModel);
            }

            this.currentModel = gltf.scene;
            this.currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(this.currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            
            this.currentModel.scale.setScalar(scale);
            this.currentModel.position.sub(center.multiplyScalar(scale));

            this.scene.add(this.currentModel);
            this.resetView();
            this.updateAircraftInfo(aircraftData);

            console.log('Model loaded successfully:', modelPath);
        } catch (error) {
            console.error('Error loading model:', error);
            loadingText.textContent = 'Error loading model. Please try again.';
            setTimeout(() => this.showLoading(false), 2000);
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading');
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    updateAircraftInfo(data) {
        document.getElementById('aircraft-name').textContent = data.name;
        document.getElementById('aircraft-range').textContent = `Range: ${data.range} nm`;
        document.getElementById('aircraft-speed').textContent = `Speed: ${data.cruisingSpeed} kts`;
        document.getElementById('aircraft-capacity').textContent = 
            `Capacity: ${data.passengerCapacity} ${data.passengerCapacity === 1 ? 'passenger' : 'passengers'}`;
        document.getElementById('aircraft-type').textContent = `Type: ${data.type}`;
    }

    rotateModel(angle) {
        if (this.currentModel) {
            this.currentModel.rotation.y += angle;
        }
    }

    resetView() {
        this.camera.position.set(5, 3, 5);
        this.controls.reset();
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the viewer
const viewer = new AircraftViewer('model-container');
viewer.animate();

// Update model selector initialization
function setupModelSelector() {
    const selector = document.getElementById('model-selector');
    
    // Clear existing options
    selector.innerHTML = '<option value="">Select Aircraft</option>';
    
    Object.entries(AIRCRAFT_CATALOG).forEach(([key, aircraft]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = aircraft.name;
        selector.appendChild(option);
    });

    selector.addEventListener('change', async (e) => {
        if (!e.target.value) return;
        
        const selectedAircraft = AIRCRAFT_CATALOG[e.target.value];
        try {
            await viewer.loadModel(selectedAircraft.modelPath, selectedAircraft);
        } catch (error) {
            console.error('Error loading aircraft:', error);
        }
    });

    // Load initial model
    const initialAircraft = AIRCRAFT_CATALOG.caravan; // Start with Caravan as it's smaller
    viewer.loadModel(initialAircraft.modelPath, initialAircraft);
}

// Initialize the model selector
setupModelSelector();

export default viewer; 