import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft';

export interface Package extends BaseEntity<PackageStatus> {
    id: string;
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
    selectedDetails: string;
}

export interface UpdatePackageData {
    name: string;
    price: number;
    description: string;
    duration: number;
    capacity: number;
}

