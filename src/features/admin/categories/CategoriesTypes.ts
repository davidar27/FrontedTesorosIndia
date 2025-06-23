import { BaseEntity } from "@/features/admin/types";

export type CategoryStatus = 'active' | 'inactive' | 'draft';

export interface Category extends BaseEntity<CategoryStatus> {
    id: string;
    productsCount: number;
    joinDate: string;
}

export interface CreateCategoryData {
    name: string;
}

export interface UpdateCategoryData {
    name: string;
}