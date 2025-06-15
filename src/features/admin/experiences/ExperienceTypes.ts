import { BaseEntity } from '@/features/admin/types';

export type Experiencestatus = 'published' | 'draft';

export interface ExperienceResponse {
    id: number;
    name_experience: string;
    location: string | 'Por definir';
    type: string | ' ';
    logo: string | ' ';
    joinDate: string;
    status: Experiencestatus;
    name_entrepreneur: string;
}

export interface Experience extends BaseEntity<Experiencestatus> {
    name_experience: string;
    location: string | 'Por definir';
    type: string | 'Por definir';
    logo: string | ' ';
    joinDate: string;
    name_entrepreneur: string;
}

export interface ExperienceApiResponse {
    status: string;
    experiences: Experience[];
}

export interface ExperienceCardProps {
    Experience: Experience;
    onUpdate: (id: number) => void;
}

export interface UpdateExperienceData {
    name: string;
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
    joinDate: string;
    name_entrepreneur: string;
}

