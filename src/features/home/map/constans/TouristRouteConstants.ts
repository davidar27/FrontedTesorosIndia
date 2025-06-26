import { Position } from "./types/TouristRouteTypes";

export const DEFAULT_POSITION: Position = { lat: 4.678, lng: -75.668 };
export const MAP_CENTER: Position = { lat: 4.676, lng: -75.655 };

export const ACTIVITIES = [
    'Tour de Café',
    'Senderismo',
    'Avistamiento de Aves',
    'Fotografía'
] as const;

export const RECOMMENDATIONS = [
    'Usa calzado cómodo para caminar por los senderos',
    'Lleva protector solar y sombrero',
    'Reserva con anticipación en temporada alta',
    'Prueba la gastronomía local en las experiencias de la zona'
] as const;
