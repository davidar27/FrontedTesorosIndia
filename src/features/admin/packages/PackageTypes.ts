import { BaseEntity } from '@/features/admin/types';

export type PackageStatus = 'active' | 'inactive' | 'draft' | 'pending';

export interface Package extends BaseEntity<PackageStatus> {
    id: number;
    price: number;
    category: string;
    duration: string;
    capacity: string;
    join_date: string;
}


export interface CreatePackageData {
    name: string;
    price: number;
    category: string;
    duration: string;
    capacity: string;
    join_date: string;
}

export interface UpdatePackageData {
    name: string;
    price: number;
    category: string;
    duration: string;
    capacity: string;
    join_date: string;
}

