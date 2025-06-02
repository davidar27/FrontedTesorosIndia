import { BaseEntity } from '@/features/admin/types';

export type FarmStatus = 'draft' | 'active' | 'inactive';

// Tipo para la respuesta del backend
export interface FarmResponse {
    id: number;
    name_farm: string;
    description: string;
    location: string | 'Por definir';
    type: string | ' ';
    created_at: string;
    status: FarmStatus;
    entrepreneur_id: string | number;
}

// Tipo para el manejo interno en la aplicación
export interface Farm extends BaseEntity<FarmStatus> {
    name_farm: string;
    description: string;
    location: string | 'Por definir';
    type: string | ' ';
    created_at: string;
    entrepreneur_id: string | number;
}

export interface FarmApiResponse {
    status: string;
    farms: Farm[];
}

export interface FarmCardProps {
    farm: Farm;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export interface CreateFarmData {
    name_farm: string;
    description: string;
    location: string;
    type: string | ' ';
}

export interface UpdateFarmData {
    name_farm?: string;
    description?: string;
    location?: string;
    type?: string;
    status?: FarmStatus;
}

export interface RawFarmResponse {
    id: number;
    name_farm: string;
    description?: string;
    location: string;
    type?: string;
    status: FarmStatus;
    entrepreneur_id: string | number;
    created_at: string;
}

