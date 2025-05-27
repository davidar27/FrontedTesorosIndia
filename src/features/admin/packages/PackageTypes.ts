import { BaseEntity } from '@/components/admin/GenericManagent';

export interface Package extends BaseEntity {
    price: number;
    description: string;
    category: string;
}