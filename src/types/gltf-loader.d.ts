declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Object3D, Group } from 'three';

    export interface GLTF {
        scene: Group;
        scenes: Group[];
        animations: any[];
        cameras: any[];
        asset: any;
    }

    export class GLTFLoader {
        constructor();
        load(url: string, onLoad: (gltf: GLTF) => void, onProgress?: (event: ProgressEvent) => void, onError?: (error: ErrorEvent) => void): void;
        loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<GLTF>;
    }
} 