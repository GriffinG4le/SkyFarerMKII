import mapboxgl, { Map, LngLat, MapMouseEvent, MapboxOptions } from 'mapbox-gl';
import { FlightRangeService } from '../services/FlightRangeService';

export class FlightRangeMap {
  private map: Map;
  private selectedCities: { name: string; coordinates: LngLat }[] = [];

  constructor(containerId: string, mapboxToken: string) {
    mapboxgl.accessToken = mapboxToken;
    
    const options: MapboxOptions = {
      container: containerId,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-96, 37.8],
      zoom: 3
    };

    this.map = new mapboxgl.Map(options);
    this.initializeMapEvents();
  }

  private initializeMapEvents(): void {
    this.map.on('click', (e: MapMouseEvent) => {
      this.addWaypoint(e.lngLat);
    });
  }

  private addWaypoint(coordinates: LngLat): void {
    // Add marker to map
    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(this.map);

    // Store city data
    this.selectedCities.push({
      name: `Waypoint ${this.selectedCities.length + 1}`,
      coordinates
    });

    this.updateFlightPath();
  }

  private updateFlightPath(): void {
    if (this.selectedCities.length < 2) return;

    // Create a GeoJSON line string for the route
    const routeCoordinates = this.selectedCities.map(city => 
      [city.coordinates.lng, city.coordinates.lat]
    );

    // Remove existing route layer if it exists
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    // Add the new route
    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      }
    });

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0074D9',
        'line-width': 3
      }
    });

    // Calculate and display route statistics
    this.updateRouteStatistics();
  }

  private updateRouteStatistics(): void {
    const stats = FlightRangeService.calculateRouteStatistics(this.selectedCities);
    
    // Dispatch custom event with route statistics
    const event = new CustomEvent('routeupdate', { 
      detail: stats 
    });
    document.dispatchEvent(event);
  }

  public clearRoute(): void {
    this.selectedCities = [];
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }
    // Remove all markers (implementation needed)
  }
} 