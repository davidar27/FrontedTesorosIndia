import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft';

export interface Package extends BaseEntity<PackageStatus> {
    id: number;
    price: number;
    description: string;
    duration: string;
    capacity: string;
    joinDate: string;
}


export interface CreatePackageData {
    title: string;
    description: string;
    selectedExperiences: string[];
    unavailableDates: number[];
    duration: string;
    pricePerPerson: string;
    services: string;
}

export interface UpdatePackageData {
    name: string;
    price: number;
    description: string;
    duration: number;
    capacity: number;
}

