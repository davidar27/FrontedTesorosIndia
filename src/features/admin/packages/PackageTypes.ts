import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft' | 'pending';

export interface Package extends BaseEntity<PackageStatus> {
    id: number;
    price: number;
    description: string;
    duration: string;
    capacity: string;
    joinDate: string;
}


export interface CreatePackageData {
    name: string;
    price: number;
    description: string;
    duration: number;
    capacity: number;
}

export interface UpdatePackageData {
    name: string;
    price: number;
    description: string;
    duration: number;
    capacity: number;
}

