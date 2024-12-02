import { Aircraft } from '../models';
import { AIRCRAFT_CATALOG } from './AircraftService';

export class RecommendationService {
    static getRecommendedAircraft(
        distance: number,
        passengers: number,
        budget?: number
    ): Aircraft[] {
        return Object.values(AIRCRAFT_CATALOG).filter(aircraft => {
            const meetsRange = aircraft.range >= distance;
            const meetsCapacity = aircraft.passengerCapacity >= passengers;
            const meetsBudget = budget ? aircraft.price <= budget : true;
            
            return meetsRange && meetsCapacity && meetsBudget;
        });
    }
} 