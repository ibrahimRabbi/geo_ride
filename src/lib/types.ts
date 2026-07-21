export type AppMode = 'rider' | 'driver';

export type RideStage =
    | 'idle'
    | 'selecting_vehicle'
    | 'searching_driver'
    | 'driver_assigned'
    | 'in_transit'
    | 'completed';

export interface Location {
    id: string;
    name: string;
    coords: { x: number; y: number };
}

export interface RideOption {
    id: string;
    name: string;
    type: 'economy' | 'comfort' | 'luxe' | 'xl' | 'green';
    priceMultiplier: number;
    basePrice: number;
    eta: number; // in minutes
    seats: number;
    description: string;
    carImage: string;
}

 

