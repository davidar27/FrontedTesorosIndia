
export interface Detail {
    detail_id?: number;
    detail?: string;
}

export interface Package {
    id: number;
    name?: string;
    description?: string;
    image?: string;
    price?: string;
    capacity?: number;
    details?: Detail[];
    unavailableDates?: string[]  ;
    
}

export interface ReservationData {
    id: number;
    packageName: string;
    date: string;
    people: number;
    totalPrice: number;
    fromQuickReservation: boolean;
    timestamp: number;
}

export  interface ValidationErrors {
    [key: string]: string;
}
