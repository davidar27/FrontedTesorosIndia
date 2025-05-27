import { ReusableCard } from '@/components/admin/Card';
import { Phone, Mail } from 'lucide-react';
import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';


interface EntrepreneurCardProps {
    item: Entrepreneur;
    onEdit: (item: Entrepreneur) => void;
    onDelete: (id: number) => void;
}

export function EntrepreneurCard({ item, onEdit, onDelete }: EntrepreneurCardProps) {
    const contactInfo = [
        { icon: Mail, value: item.email },
        { icon: Phone, value: item.phone }
    ];

    const stats = [
        {
            value: item.farm,
            label: 'Finca',
            bgColor: 'bg-green-50',
            textColor: 'text-primary'
        },
        {
            value: item.joinDate,
            label: 'Registro',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        }
    ];

    return (
        <ReusableCard
            item={item}
            contactInfo={contactInfo}
            stats={stats}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}
