import { BaseEntity } from '@/components/admin/GenericManagent';

export type FarmStatus = 'Borrador' | 'Publicada' | 'Inactiva';

// Tipo para la respuesta del backend
export interface FarmResponse {
    id: number;
    name: string;
    description: string;
    location: string | 'Por definir';
    type: string | ' ';
    created_at: string;
    status: FarmStatus;
    entrepreneur_id: string | number;
}

// Tipo para el manejo interno en la aplicación
export interface Farm extends BaseEntity<FarmStatus> {
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
    name: string;
    description: string;
    location: string;
    type: string | ' ';
}

export interface UpdateFarmData {
    name?: string;
    description?: string;
    location?: string;
    type?: string;
    status?: FarmStatus;
}