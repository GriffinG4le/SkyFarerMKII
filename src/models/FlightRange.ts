import { LngLat } from 'mapbox-gl';

export interface FlightRange {
    startPoint: LngLat;
    endPoint: LngLat;
    distance: number;
    estimatedTime: number;
} 