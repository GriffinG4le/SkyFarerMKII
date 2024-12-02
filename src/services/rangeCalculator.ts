import { LngLat } from 'mapbox-gl';

export function calculateDistance(point1: LngLat, point2: LngLat): number {
    const R = 3440.065; // Earth's radius in nautical miles
    const lat1 = toRad(point1.lat);
    const lat2 = toRad(point2.lat);
    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
} 