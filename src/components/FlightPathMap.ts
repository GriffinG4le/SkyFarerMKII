import mapboxgl, { Map, LngLat, MapMouseEvent } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { FlightPathService, Waypoint } from '../services/FlightPathService';

export class FlightPathMap {
    private map: Map;
    private waypoints: Waypoint[] = [];
    private markers: mapboxgl.Marker[] = [];
    private routeLayer: string = 'route';

    constructor(containerId: string, mapboxToken: string) {
        mapboxgl.accessToken = mapboxToken;
        
        this.map = new mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [0, 20],
            zoom: 1.5
        });

        this.initializeGeocoder();
        this.initializeMapEvents();
    }

    private initializeGeocoder(): void {
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false
        });

        this.map.addControl(geocoder);

        geocoder.on('result', (e) => {
            this.addWaypoint({
                name: e.result.place_name,
                coordinates: e.result.center as LngLat
            });
        });
    }

    private initializeMapEvents(): void {
        this.map.on('click', (e) => {
            this.addWaypoint({
                name: `Waypoint ${this.waypoints.length + 1}`,
                coordinates: e.lngLat
            });
        });
    }

    private addWaypoint(waypoint: Waypoint): void {
        this.waypoints.push(waypoint);

        // Add marker
        const marker = new mapboxgl.Marker()
            .setLngLat(waypoint.coordinates)
            .addTo(this.map);

        this.markers.push(marker);

        // Update route if we have at least 2 waypoints
        if (this.waypoints.length >= 2) {
            this.updateRoute();
        }

        // Dispatch event with updated path
        if (this.waypoints.length >= 2) {
            const path = FlightPathService.calculatePath(this.waypoints);
            const event = new CustomEvent('pathupdate', { detail: path });
            document.dispatchEvent(event);
        }
    }

    private updateRoute(): void {
        // Remove existing route
        if (this.map.getSource(this.routeLayer)) {
            this.map.removeLayer(this.routeLayer);
            this.map.removeSource(this.routeLayer);
        }

        // Create route line
        const coordinates = this.waypoints.map(wp => 
            [wp.coordinates.lng, wp.coordinates.lat]
        );

        // Add new route
        this.map.addSource(this.routeLayer, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates
                }
            }
        });

        this.map.addLayer({
            id: this.routeLayer,
            type: 'line',
            source: this.routeLayer,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#C0C0C0',
                'line-width': 3
            }
        });

        // Fit map to show entire route
        const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord as [number, number]);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        this.map.fitBounds(bounds, { padding: 50 });
    }

    public clearRoute(): void {
        this.waypoints = [];
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        if (this.map.getSource(this.routeLayer)) {
            this.map.removeLayer(this.routeLayer);
            this.map.removeSource(this.routeLayer);
        }

        // Dispatch event to clear path
        const event = new CustomEvent('pathupdate', { detail: null });
        document.dispatchEvent(event);
    }
} 