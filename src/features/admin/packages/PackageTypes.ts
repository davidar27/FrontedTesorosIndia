import { BaseEntity } from '@/features/admin/types';
import { Experience } from '@/features/experience/types/experienceTypes';

export type PackageStatus = 'active' | 'inactive' | 'draft';

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
    selectedExperiences: number[];
    joinDate: string;
    image?: string;
}


export interface CreatePackageData {
    id?:number;
    name: string;
    description: string;
    selectedExperiences: number[];
    unavailableDates: string[];
    duration: number;
    capacity: number;
    price:number;
    pricePerPerson: number;
    selectedDetails: number[];
}

export interface UpdatePackageData {
    id: number;
    name: string;
    description: string;
    price?:number;
    selectedExperiences: number[];
    unavailableDates: string[];
    duration: number;
    capacity: number;
    pricePerPerson: number;
    details: number;
    experiences:Experience[];
    selectedDetails: number[];
    image : string | File | undefined;
}

