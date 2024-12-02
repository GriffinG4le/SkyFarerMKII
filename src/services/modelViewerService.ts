import { Aircraft } from '../models';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ModelViewerService {
    static async loadModel(aircraft: Aircraft): Promise<THREE.Group> {
        const loader = new GLTFLoader();
        try {
            const gltf = await loader.loadAsync(`/models/${aircraft.modelPath}`);
            return gltf.scene;
        } catch (error) {
            console.error('Error loading model:', error);
            throw error;
        }
    }
} 