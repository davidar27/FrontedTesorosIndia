export interface Experience {
    experience_id: number;
    name: string;
    package_id: number;
}

export interface Detail {
    detail_id: number;
    detail: string;
}

export interface PackageData {
    id: number;
    name: string;
    description: string;
    price: string;
    duration: number;
    capacity: number;
    image: string;
    experiences?: Experience[];
    details: Detail[];
    createdAt?: string;
    status?: 'active' | 'inactive' | 'draft';
    bookingsCount?: number;
}

export interface PackageDetailsViewProps {
    onEdit?: (packageData: PackageData) => void;
    onDelete?: (packageId: string) => void;
    onStatusChange?: (packageId: string, status: string) => void;
    isEditable?: boolean;
    showActions?: boolean;
}
