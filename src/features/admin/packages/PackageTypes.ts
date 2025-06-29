import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft';

export interface Package extends BaseEntity<PackageStatus> {
    id: number;
    name: string;
    name_package?: string;
    pricePerPerson: number;
    description: string;
    duration: number;
    capacity: number;
    unavailableDates: string[] ;
    selectedDetails: number[];
    selectedExperiences: number[];
    joinDate: string;
    image?: string;
}


export interface CreatePackageData {
    title: string;
    description: string;
    selectedExperiences: number[];
    unavailableDates: string[];
    duration: number;
    capacity: number;
    pricePerPerson: number;
    selectedDetails: number[];
}

export interface UpdatePackageData {
    name: string;
    pricePerPerson: number;
    description: string;
    duration: number;
    capacity: number;
}

