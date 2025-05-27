import { BaseEntity } from '@/components/admin/GenericManagent';

export interface Farm extends BaseEntity<'active' | 'inactive' | 'draft'> {
    id: number;
    name: string;
    description: string;
    location: string;
    created_at: string;
    status: 'active' | 'inactive' | 'draft';
    // images?: string[];
    // videos?: string[];
    emprendedor_id: number;
    createdAt?: string;
    updatedAt?: string;
}



export interface FarmApiResponse {
    farms: Farm[];
    total: number;
    page: number;
    limit: number;
}


export interface FarmCardProps {
    farm: Farm;
    onEdit: (farm: Farm) => void;
    onDelete: (id: number) => void;
}


export interface CreateFarmData {
    name: string;
    description: string;
    location: string;
    emprendedor_id: number;
}

export interface UpdateFarmData {
    name?: string;
    description?: string;
    location?: string;
    emprendedor_id?: number;
    status?: 'active' | 'inactive' | 'pending';
    image?: string;
}