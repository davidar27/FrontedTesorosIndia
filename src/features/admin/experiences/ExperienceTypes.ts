import { BaseEntity } from '@/features/admin/types';

export type Experiencestatus = 'Borrador' | 'Publicada' | 'Inactiva';

// Tipo para la respuesta del backend
export interface ExperienceResponse {
    id: number;
    name_experience: string;
    name_entrepreneur: string;
    description: string;
    location: string | 'Por definir';
    type: string | ' ';
    image: string | ' ';
    created_at: string;
    status: Experiencestatus;
    entrepreneur_id: string | number;
}

// Tipo para el manejo interno en la aplicación
export interface Experience extends BaseEntity<Experiencestatus> {
    name_experience: string;
    name_entrepreneur: string;
    description: string;
    location: string | 'Por definir';
    type: string | ' ';
    image: string | ' ';
    created_at: string;
    entrepreneur_id: string | number;
}

export interface ExperienceApiResponse {
    status: string;
    experiences: Experience[];
}

export interface ExperienceCardProps {
    Experience: Experience;
    onUpdate: (id: number) => void;
    onDelete: (id: number) => void;
}



export interface UpdateExperienceData {
    name_experience?: string;
    description?: string;
    location?: string;
    type?: string;
    status?: Experiencestatus;
}

export interface RawExperienceResponse {
    id: number;
    name_experience: string;
    name_entrepreneur: string;
    description?: string;
    location: string;
    type?: string;
    status: Experiencestatus;
    entrepreneur_id: string | number;
    created_at: string;
}

