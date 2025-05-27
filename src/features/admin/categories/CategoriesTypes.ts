import { BaseEntity } from "@/components/admin/GenericManagent";

export interface Category extends BaseEntity {
    description: string;
    productsCount: number;
    color: string;
}