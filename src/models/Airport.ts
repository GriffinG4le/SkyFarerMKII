import { LngLat } from 'mapbox-gl';

export interface Airport {
    id: string;
    name: string;
    code: string;
    location: LngLat;
    elevation: number;
    runwayLength: number;
} 