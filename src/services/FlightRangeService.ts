import { LngLat } from 'mapbox-gl';

interface City {
  name: string;
  coordinates: LngLat;
}

interface RouteStatistics {
  totalDistance: number;
  estimatedFlightTime: number;
  waypoints: City[];
}

export class FlightRangeService {
  private static AVERAGE_CRUISE_SPEED = 500; // nautical miles per hour

  public static calculateDistance(point1: LngLat, point2: LngLat): number {
    // Haversine formula for calculating great-circle distance
    const R = 3440.065; // Earth's radius in nautical miles
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  public static calculateRouteStatistics(cities: City[]): RouteStatistics {
    let totalDistance = 0;

    // Calculate total distance between consecutive points
    for (let i = 0; i < cities.length - 1; i++) {
      totalDistance += this.calculateDistance(
        cities[i].coordinates,
        cities[i + 1].coordinates
      );
    }

    return {
      totalDistance,
      estimatedFlightTime: totalDistance / this.AVERAGE_CRUISE_SPEED,
      waypoints: cities
    };
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
} 