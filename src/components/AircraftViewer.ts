import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AIRCRAFT_CATALOG } from '../services/AircraftService';
import { Aircraft } from '../models/Aircraft';

export class AircraftViewer {
    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private controls!: OrbitControls;
    private currentModel: THREE.Group | null;
    private loadingElement: HTMLElement | null;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId)!;
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
        this.loadingElement = document.getElementById('loading');
    }

    private setupRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xf5f5f5);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    private setupLights(): void {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);
    }

    private setupControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', () => this.onWindowResize());
        this.setupModelSelector();
    }

    private setupModelSelector(): void {
        const selector = document.getElementById('model-selector') as HTMLSelectElement;
        if (!selector) return;

        Object.entries(AIRCRAFT_CATALOG).forEach(([key, aircraft]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = aircraft.name;
            selector.appendChild(option);
        });

        selector.addEventListener('change', async (e) => {
            const target = e.target as HTMLSelectElement;
            if (!target.value) return;
            
            const selectedAircraft = AIRCRAFT_CATALOG[target.value];
            await this.loadModel(selectedAircraft.modelPath, selectedAircraft);
        });

        // Load initial model
        const initialAircraft = AIRCRAFT_CATALOG.caravan;
        this.loadModel(initialAircraft.modelPath, initialAircraft);
    }

    private onWindowResize(): void {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private showLoading(show: boolean): void {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    public async loadModel(modelPath: string, aircraftData: Aircraft): Promise<void> {
        this.showLoading(true);

        try {
            const loader = new GLTFLoader();
            const gltf = await loader.loadAsync(`/models/${modelPath}`);

            if (this.currentModel) {
                this.scene.remove(this.currentModel);
            }

            this.currentModel = gltf.scene;
            this.currentModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).castShadow = true;
                    (child as THREE.Mesh).receiveShadow = true;
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
        } catch (error) {
            console.error('Error loading model:', error);
            if (this.loadingElement) {
                this.loadingElement.textContent = 'Error loading model. Please try again.';
            }
        } finally {
            setTimeout(() => this.showLoading(false), 500);
        }
    }

    private updateAircraftInfo(data: Aircraft): void {
        const elements = {
            name: document.getElementById('aircraft-name'),
            type: document.getElementById('aircraft-type'),
            range: document.getElementById('aircraft-range'),
            speed: document.getElementById('aircraft-speed'),
            capacity: document.getElementById('aircraft-capacity')
        };

        if (elements.name) elements.name.textContent = data.name;
        if (elements.type) elements.type.textContent = `Type: ${data.type}`;
        if (elements.range) elements.range.textContent = `Range: ${data.range} nm`;
        if (elements.speed) elements.speed.textContent = `Speed: ${data.cruisingSpeed} kts`;
        if (elements.capacity) elements.capacity.textContent = 
            `Capacity: ${data.passengerCapacity} ${data.passengerCapacity === 1 ? 'passenger' : 'passengers'}`;
    }

    private resetView(): void {
        this.camera.position.set(5, 3, 5);
        this.controls.reset();
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
} 