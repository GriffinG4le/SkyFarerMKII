export interface Aircraft {
    name: string;
    modelPath: string;
    range: number;
    cruisingSpeed: number;
    passengerCapacity: number;
    type: string;
    price: number;
    manufacturer: string;
    yearOfManufacture?: number;
} 