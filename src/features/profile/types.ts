export interface ProfileCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    placeholder?: string;
    type?: string;
    isEditing: boolean;
    gradientFrom: string;
    gradientTo: string;
    borderColor: string;
    iconBgColor: string;
    focusRingColor: string;
    onChange?: (value: string) => void;
}