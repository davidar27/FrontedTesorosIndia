import { BaseEntity } from "@/components/admin/GenericManagent";

export interface Category extends BaseEntity {
    productsCount: number;
}