import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft';

export interface Package extends BaseEntity<PackageStatus> {
    id: number;
    name: string;
    name_package?: string;
    price: number;
    description: string;
    duration: string;
    capacity: string;
    joinDate: string;
    image?: string;
}


export interface CreatePackageData {
    title: string;
    description: string;
    selectedExperiences: string[];
    unavailableDates: number[];
    duration: number;
    capacity: number;
    pricePerPerson: string;
    selectedDetails: number[];
}

export interface UpdatePackageData {
    name: string;
    price: number;
    description: string;
    duration: number;
    capacity: number;
}

