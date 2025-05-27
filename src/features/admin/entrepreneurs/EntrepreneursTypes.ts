import { BaseEntity } from "@/components/admin/GenericManagent";

export interface Entrepreneur extends BaseEntity {
    email: string;
    phone: string;
    farms: number;
    joinDate: string;
}