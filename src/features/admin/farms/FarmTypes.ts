import { BaseEntity } from '@/components/admin/GenericManagent';

export interface Farm extends BaseEntity {
    entrepreneur: string;
    location: string;
    Type :string;
}
