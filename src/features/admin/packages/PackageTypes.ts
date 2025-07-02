import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft';
interface Experience {
    experience_id: number;
    name: string;
    package_id: number;
}

export interface Package extends BaseEntity<PackageStatus> {
    id: number;
    name: string;
    name_package?: string;
    pricePerPerson: number;
    description: string;
    duration: number;
    capacity: number;
    unavailableDates: string[];
    selectedDetails: number[];
    experiences?: Experience[];
    selectedExperiences: number[];
    joinDate: string;
    image?: string;
}


export interface CreatePackageData {
    id?: number;
    name: string;
    description: string;
    selectedExperiences: number[];
    unavailableDates: string[];
    duration: number;
    capacity: number;
    price: number;
    pricePerPerson: number;
    selectedDetails: number[];
}

export interface UpdatePackageData {
    id: number;
    name: string;
    description: string;
    price?: number;
    selectedExperiences: number[];
    unavailableDates: string[];
    duration: number;
    capacity: number;
    pricePerPerson: number;
    details: number;
    experiences: Experience[];
    selectedDetails: number[];
    image: string | File | undefined;
}

