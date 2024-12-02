import { Aircraft } from '../models/Aircraft';

export const AIRCRAFT_CATALOG: Record<string, Aircraft> = {
    caravan: {
        name: "Cessna Caravan 208",
        modelPath: "caravanwzip.glb",
        range: 1070,
        cruisingSpeed: 186,
        passengerCapacity: 14,
        type: "Turboprop",
        price: 2500000,
        manufacturer: "Cessna"
    },
    eurocopter: {
        name: "Eurocopter EC665 Tiger",
        modelPath: "eurocopter_ec665_tigre.glb",
        range: 430,
        cruisingSpeed: 162,
        passengerCapacity: 2,
        type: "Military Helicopter",
        price: 31500000,
        manufacturer: "Airbus Helicopters"
    },
    falcon: {
        name: "Dassault Falcon 50",
        modelPath: "falcon50zip.glb",
        range: 3000,
        cruisingSpeed: 470,
        passengerCapacity: 9,
        type: "Business Jet",
        price: 15000000,
        manufacturer: "Dassault"
    },
    pilatus: {
        name: "Pilatus PC-12",
        modelPath: "pilatus_pc_1247.glb",
        range: 1560,
        cruisingSpeed: 280,
        passengerCapacity: 9,
        type: "Turboprop",
        price: 4900000,
        manufacturer: "Pilatus"
    },
    raven: {
        name: "Robinson R44 Raven",
        modelPath: "ravenzip.glb",
        range: 300,
        cruisingSpeed: 113,
        passengerCapacity: 4,
        type: "Light Helicopter",
        price: 505000,
        manufacturer: "Robinson"
    }
};

export class AircraftService {
    static getAircraftByType(type: string): Aircraft[] {
        return Object.values(AIRCRAFT_CATALOG)
            .filter(aircraft => aircraft.type === type);
    }

    static getAircraftByRange(minRange: number, maxRange: number): Aircraft[] {
        return Object.values(AIRCRAFT_CATALOG)
            .filter(aircraft => aircraft.range >= minRange && aircraft.range <= maxRange);
    }

    static getAircraftByCapacity(minCapacity: number): Aircraft[] {
        return Object.values(AIRCRAFT_CATALOG)
            .filter(aircraft => aircraft.passengerCapacity >= minCapacity);
    }
} 