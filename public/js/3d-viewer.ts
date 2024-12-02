import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface ModelSpecs {
    name: string;
    range: string;
    speed: string;
    capacity: string;
}

const modelSpecs: { [key: string]: ModelSpecs } = {
    'caravanwzip.glb': {
        name: 'Cessna Caravan',
        range: '1,070 nm',
        speed: '186 knots',
        capacity: '14 seats'
    },
    'ravenzip.glb': {
        name: 'Robinson R44',
        range: '300 nm',
        speed: '120 knots',
        capacity: '4 seats'
    },
    'pilatus_pc_1247.glb': {
        name: 'Pilatus PC-12',
        range: '1,560 nm',
        speed: '290 knots',
        capacity: '9 seats'
    },
    'falcon50zip.glb': {
        name: 'Dassault Falcon 50',
        range: '3,000 nm',
        speed: '470 knots',
        capacity: '19 seats'
    },
    'eurocopter_ec665_tigre.glb': {
        name: 'Eurocopter Tiger',
        range: '430 nm',
        speed: '165 knots',
        capacity: '2 seats'
    }
};

class ModelViewer {
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private currentModel: THREE.Object3D | null = null;
    private lights: THREE.Light[] = [];
    private isRotating: boolean = false;
    private container: HTMLElement;

    constructor() {
        const container = document.getElementById('model-container');
        if (!container) throw new Error('Model container not found');
        this.container = container;

        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);

        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Initialize controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.initialize();
        this.setupEventListeners();
    }

    private initialize(): void {
        this.scene.background = new THREE.Color(0x1a1a1a);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.setupLighting();
        this.animate();
        this.loadModel('caravanwzip.glb');
    }

    private setupLighting(): void {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.lights.push(ambientLight);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        this.lights.push(directionalLight1);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-5, 5, -5);
        this.lights.push(directionalLight2);
        this.scene.add(directionalLight2);
    }

    private async loadModel(modelFile: string): Promise<void> {
        const loader = new GLTFLoader();
        const loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) return;

        try {
            loadingOverlay.style.display = 'flex';

            if (this.currentModel) {
                this.scene.remove(this.currentModel);
            }

            const gltf: GLTF = await loader.loadAsync(`/models/${modelFile}`);
            const model = gltf.scene;

            // Convert materials to MeshBasicMaterial
            model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material) {
                        if (Array.isArray(mesh.material)) {
                            mesh.material = mesh.material.map(mat => {
                                const newMat = new THREE.MeshStandardMaterial();
                                newMat.copy(mat);
                                mat.dispose(); // Clean up old material
                                return newMat;
                            });
                        } else {
                            const oldMat = mesh.material;
                            const newMat = new THREE.MeshStandardMaterial();
                            newMat.copy(oldMat);
                            mesh.material = newMat;
                            oldMat.dispose(); // Clean up old material
                        }
                    }
                }
            });

            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;

            model.position.sub(center);
            model.scale.multiplyScalar(scale);

            this.currentModel = model;
            this.scene.add(model);
            this.updateModelInfo(modelFile);

        } catch (error) {
            console.error('Error loading model:', error);
            alert('Failed to load model');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    private updateModelInfo(modelFile: string): void {
        const specs = modelSpecs[modelFile];
        if (specs) {
            const modelName = document.getElementById('model-name');
            const modelDetails = document.getElementById('model-details');
            if (!modelName || !modelDetails) return;

            modelName.textContent = specs.name;
            modelDetails.innerHTML = `
                Range: ${specs.range}<br>
                Speed: ${specs.speed}<br>
                Capacity: ${specs.capacity}<br>
                Polygons: ${this.getPolyCount()}
            `;
        }
    }

    private getPolyCount(): number {
        let polyCount = 0;
        this.currentModel?.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                polyCount += (child as THREE.Mesh).geometry.attributes.position.count / 3;
            }
        });
        return Math.round(polyCount);
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', () => this.onWindowResize());

        const resetBtn = document.getElementById('reset-camera');
        const wireframeBtn = document.getElementById('toggle-wireframe');
        const rotationBtn = document.getElementById('toggle-rotation');
        const lightsBtn = document.getElementById('toggle-lights');

        resetBtn?.addEventListener('click', () => this.resetCamera());
        wireframeBtn?.addEventListener('click', () => this.toggleWireframe());
        rotationBtn?.addEventListener('click', () => this.toggleRotation());
        lightsBtn?.addEventListener('click', () => this.toggleLights());
    }

    private resetCamera(): void {
        this.camera.position.set(0, 5, 10);
        this.controls.reset();
    }

    private toggleWireframe(): void {
        if (this.currentModel) {
            this.currentModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material instanceof THREE.MeshBasicMaterial || 
                        mesh.material instanceof THREE.MeshStandardMaterial ||
                        mesh.material instanceof THREE.MeshPhongMaterial) {
                        mesh.material.wireframe = !mesh.material.wireframe;
                    } else if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(mat => {
                            if (mat instanceof THREE.MeshBasicMaterial || 
                                mat instanceof THREE.MeshStandardMaterial ||
                                mat instanceof THREE.MeshPhongMaterial) {
                                mat.wireframe = !mat.wireframe;
                            }
                        });
                    }
                }
            });
        }
    }

    private toggleRotation(): void {
        this.isRotating = !this.isRotating;
    }

    private toggleLights(): void {
        this.lights.forEach(light => {
            light.visible = !light.visible;
        });
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        if (this.isRotating && this.currentModel) {
            this.currentModel.rotation.y += 0.01;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the viewer when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new ModelViewer();
}); 