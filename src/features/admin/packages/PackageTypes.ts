import { BaseEntity } from '@/components/admin/GenericManagent';

export interface Package extends BaseEntity {
    id: number;
    price: number;
    description: string;
    category: string;
    duration: string;
    capacity: string;
}