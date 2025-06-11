import { BaseEntity } from '@/features/admin/types';

export type Experiencestatus = 'published' | 'draft' | 'inactive';

export interface ExperienceResponse {
    id: number;
    name_experience: string;
    location: string | 'Por definir';
    type: string | ' ';
    logo: string | ' ';
    created_at: string;
    status: Experiencestatus;
    name_entrepreneur: string;
}

export interface Experience extends BaseEntity<Experiencestatus> {
    name_experience: string;
    location: string | 'Por definir';
    type: string | ' ';
    logo: string | ' ';
    created_at: string;
    name_entrepreneur: string;
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
    name_experience: string;
    location: string;
    type: string;
}

export interface RawExperienceResponse {
    id: number;
    name_experience: string;
    location: string;
    type: string;
    logo: string;
    status: Experiencestatus;
    created_at: string;
    name_entrepreneur: string;
}

