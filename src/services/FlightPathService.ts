import * as turf from '@turf/turf';
import { LngLat } from 'mapbox-gl';
import { Aircraft } from '../models/Aircraft';

export interface Waypoint {
    name: string;
    coordinates: LngLat;
}

export interface FlightPath {
    waypoints: Waypoint[];
    totalDistance: number;
    segments: {
        start: Waypoint;
        end: Waypoint;
        distance: number;
    }[];
}

export class FlightPathService {
    static calculatePath(waypoints: Waypoint[]): FlightPath {
        if (waypoints.length < 2) {
            throw new Error('At least 2 waypoints are required');
        }

        const segments = [];
        let totalDistance = 0;

        for (let i = 0; i < waypoints.length - 1; i++) {
            const start = waypoints[i];
            const end = waypoints[i + 1];

            const from = turf.point([start.coordinates.lng, start.coordinates.lat]);
            const to = turf.point([end.coordinates.lng, end.coordinates.lat]);
            const distance = turf.distance(from, to, { units: 'nauticalmiles' });

            segments.push({
                start,
                end,
                distance
            });

            totalDistance += distance;
        }

        return {
            waypoints,
            totalDistance,
            segments
        };
    }

    static getRecommendedAircraft(path: FlightPath, passengers: number): Aircraft[] {
        return Object.values(AIRCRAFT_CATALOG).filter(aircraft => {
            // Check if aircraft meets range requirements
            const meetsRange = aircraft.range >= path.totalDistance;
            
            // Check if aircraft can accommodate passengers
            const meetsCapacity = aircraft.passengerCapacity >= passengers;

            return meetsRange && meetsCapacity;
        });
    }

    static calculateFlightTime(distance: number, aircraftSpeed: number): number {
        return distance / aircraftSpeed; // Returns time in hours
    }

    static estimateFuelConsumption(distance: number, aircraft: Aircraft): number {
        // Rough estimate based on typical fuel consumption rates
        // This would need to be refined with actual aircraft specifications
        const fuelRate = aircraft.type === 'Jet' ? 0.2 : 0.15; // gallons per nautical mile
        return distance * fuelRate;
    }

    static getGreatCircleRoute(start: LngLat, end: LngLat): LngLat[] {
        const line = turf.greatCircle(
            [start.lng, start.lat],
            [end.lng, end.lat],
            { steps: 100 }
        );

        return line.geometry.coordinates.map(coord => ({
            lng: coord[0],
            lat: coord[1]
        }));
    }

    static isWithinRange(aircraft: Aircraft, path: FlightPath): boolean {
        // Add 10% buffer for safety, weather, etc.
        const requiredRange = path.totalDistance * 1.1;
        return aircraft.range >= requiredRange;
    }
} 