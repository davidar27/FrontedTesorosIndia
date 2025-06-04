import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Phone, Mail, Calendar, Home } from 'lucide-react';
import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { EditableEntrepreneurCard } from './EditableEntrepreneurCard';
import { entrepreneursApi } from '@/services/admin/entrepernaur';
import { formatDate } from './entrepreneurHelpers';
import { toast } from 'react-hot-toast';

interface EntrepreneurCardProps {
    item: Entrepreneur;
    onEdit: (id: number, updatedFields: Partial<Entrepreneur>) => void;
    onDelete: (id: number) => void;
    onView?: (item: Entrepreneur) => void;
}

export function EntrepreneurCard({
    item,
    onEdit,
    onDelete,
    onView
}: EntrepreneurCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const entrepreneur: Entrepreneur & { id: number } = {
        ...item,
        id: item.id || 0
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = async (id: number, data: Entrepreneur) => {
        try {
            setIsLoading(true);
            const updatedEntrepreneur = await entrepreneursApi.update(id, {
                name: data.name,
                email: data.email,
                phone: data.phone,
                name_farm: data.name_farm
            });
            onEdit(id, updatedEntrepreneur);
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar el emprendedor:', error);
            toast.error('Error al actualizar el emprendedor');
        } finally {
            setIsLoading(false);
        }
    };


    if (isEditing) {
        return (
            <EditableEntrepreneurCard
                item={entrepreneur}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
            />
        );
    }

    const contactInfo = [
        {
            icon: Mail,
            value: entrepreneur.email || '',
            label: 'Correo electrónico',
            copyable: true
        },
        {
            icon: Phone,
            value: entrepreneur.phone || '',
            label: 'Teléfono',
            copyable: true
        }
    ];

    const stats = [
        {
            value: formatDate(entrepreneur.joinDate),
        label: 'Fecha de registro',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        icon: Calendar
    },
    {
        value: entrepreneur.name_farm,
        label: 'Nombre de la finca',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        icon: Home
    }
];

const statusMap: { [key: string]: string } = {
    'active': 'active',
    'inactive': 'inactive',
    'pending': 'pending'
};


return (
    <ReusableCard
        item={{
            id: entrepreneur.id,
            name: entrepreneur.name,
            status: statusMap[entrepreneur.status] || 'inactive',
            image: entrepreneur.image as string || '',
            description: `Emprendedor registrado el ${formatDate(entrepreneur.joinDate)}`
        }}
        contactInfo={contactInfo}
        stats={stats}
        onEdit={handleEditClick}
        onDelete={() => onDelete(entrepreneur.id)}
        showImage={true}
        showStatus={true}
        variant="default"
        clickable={!!onView}
    >
    </ReusableCard>
);
}
