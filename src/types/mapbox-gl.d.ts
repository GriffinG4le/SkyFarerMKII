declare module 'mapbox-gl' {
    export interface Style {
        version: number;
        name?: string;
        metadata?: any;
        sources: any;
        layers: any[];
    }

    export interface LngLat {
        lng: number;
        lat: number;
    }

    export interface MapboxOptions {
        container: string | HTMLElement;
        style: string | Style;
        center: [number, number];
        zoom: number;
    }

    export class Map {
        constructor(options: MapboxOptions);
        getSource(id: string): any;
        removeLayer(id: string): void;
        removeSource(id: string): void;
        addSource(id: string, source: any): void;
        addLayer(layer: any): void;
        on(event: string, handler: Function): void;
    }

    export class Marker {
        setLngLat(lngLat: LngLat): this;
        addTo(map: Map): this;
    }

    export interface MapMouseEvent {
        lngLat: LngLat;
    }

    const mapboxgl: {
        accessToken: string;
        Map: typeof Map;
        Marker: typeof Marker;
    };

    export default mapboxgl;
} 