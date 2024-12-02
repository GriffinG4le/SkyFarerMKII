import { Aircraft } from '../models';

interface PricingOptions {
    exteriorColor: string;
    interiorConfig: string;
    avionicsPackage: string;
}

export class PricingService {
    static calculateTotal(aircraft: Aircraft, options: PricingOptions): number {
        const basePrice = aircraft.price || 0;
        const optionsPrice = this.calculateOptionsPrice(options);
        return basePrice + optionsPrice;
    }

    private static calculateOptionsPrice(options: PricingOptions): number {
        let total = 0;
        
        // Add exterior color cost
        if (options.exteriorColor === 'metallic-silver') total += 50000;
        if (options.exteriorColor === 'midnight-blue') total += 75000;
        
        // Add interior configuration cost
        if (options.interiorConfig === 'vip') total += 250000;
        if (options.interiorConfig === 'business') total += 150000;
        
        // Add avionics package cost
        if (options.avionicsPackage === 'advanced') total += 200000;
        if (options.avionicsPackage === 'premium') total += 500000;
        
        return total;
    }
} 