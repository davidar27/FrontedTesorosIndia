import { LucideIcon } from 'lucide-react';

export interface BaseItem {
    id?: number;
    name: string;
    status: string;
    image?: string | null;
    description?: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    name_entrepreneur?: string;
    location?: string;
    type?: string;
    duration?: number;
    price?: number;
    capacity?: number;
    name_experience?: string;
    password?: string;
    joinDate?: string;
    [key: string]: string | number | boolean | Date | null | undefined;
}

export interface ContactInfo {
    icon: LucideIcon;
    value: string | React.ReactNode;
    label?: string;
    onClick?: () => void;
    copyable?: boolean;
}

export interface StatInfo {
    value: string | number | React.ReactNode;
    label: string;
    bgColor?: string;
    textColor?: string;
    icon?: LucideIcon;
    onClick?: () => void;
}

export interface ActionButton {
    icon: LucideIcon;
    label?: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    tooltip?: string;
}

export interface BaseCardProps<T> {
    item: T;
    className?: string;
    variant?: 'default' | 'compact' | 'detailed';
    loading?: boolean;
}

export interface ViewCardProps<T> extends BaseCardProps<T> {
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    actions?: ActionButton[];
    onUpdate?: (item: T) => void;
    onChangeStatus?: (id: number, status: string) => void;
    showImage?: boolean;
    showStatus?: boolean;
    clickable?: boolean;
    onClick?: (item: T) => void;
    children?: React.ReactNode;
    title?: string;
}

export interface EditCardProps<T> extends BaseCardProps<T> {
    onSave: (data: T | FormData) => void;
    onCancel: () => void;
    editFields: {
        [key: string]: boolean;
    };
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    showImage?: boolean;
    showStatus?: boolean;
    children?: React.ReactNode;
    title?: string;
    entity?: string;
}

export interface CreateCardProps<T> extends BaseCardProps<T> {
    onCreate: (data: Partial<T>) => void;
    onCancel: () => void;
    editFields: {
        [key: string]: boolean;
    };
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    showImage?: boolean;
    showStatus?: boolean;
    children?: React.ReactNode;
    title?: string;
    entityName?: string;
    entity?: string;
}

export interface ReusableCardProps<T> {
    item: T;
    mode: 'view' | 'edit' | 'create';
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    actions?: ActionButton[];
    onUpdate?: (data: T) => void;
    onChangeStatus?: (id: number, status: string) => void;
    showImage?: boolean;
    showStatus?: boolean;
    className?: string;
    variant?: 'default' | 'compact' | 'detailed';
    entityName?: string;
    clickable?: boolean;
    onClick?: (item: T) => void;
    loading?: boolean;
    children?: React.ReactNode;
    title?: string;
    onCreate?: (data: Partial<T>) => void;
    onCancel?: () => void;
    editFields?: {
        [key: string]: boolean;
    };
} 