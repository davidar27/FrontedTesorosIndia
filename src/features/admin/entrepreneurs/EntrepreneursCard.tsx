import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Phone, Mail, Calendar, Home } from 'lucide-react';
import { Entrepreneur, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { EditableEntrepreneurCard } from './EditableEntrepreneurCard';
import { entrepreneursApi } from '@/services/admin/entrepernaur';
import { formatDate } from './entrepreneurHelpers';
import { toast } from 'react-hot-toast';
import { QueryObserverResult } from '@tanstack/react-query';

interface EntrepreneurCardProps {
    item: Entrepreneur;
    onEdit: (id: number, updatedFields: Partial<Entrepreneur>) => void;
    onDisable: (id: number) => void;
    onActivate: (id: number) => void;
    onView?: (item: Entrepreneur) => void;
    onDelete?: (id: number) => void;
    refetch: () => Promise<QueryObserverResult<Entrepreneur[], unknown>>;
}

export function EntrepreneurCard({
    item,
    onEdit,
    onDisable,
    onActivate,
    onDelete,
    onView,
    refetch
}: EntrepreneurCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = async (id: number, data: UpdateEntrepreneurData) => {
        setIsEditing(false);
        try {
            setIsLoading(true);

            const changedFields: Partial<UpdateEntrepreneurData> = {};
            if (data.name && data.name !== item.name) changedFields.name = data.name;
            if (data.email && data.email !== item.email) changedFields.email = data.email;
            if (data.phone && data.phone !== item.phone) changedFields.phone = data.phone;
            if (data.name_experience && data.name_experience !== item.name_experience) changedFields.name_experience = data.name_experience;
            if (data.image) changedFields.image = data.image;

            if (Object.keys(changedFields).length === 0) {
                toast.error('No realizaste ningún cambio.');
                setIsLoading(false);
                return;
            }

            const updatedFields = await entrepreneursApi.update(id, changedFields);
            onEdit(id, { 
                ...item, 
                ...updatedFields, 
                image: typeof updatedFields.image === 'string' ? updatedFields.image : item.image 
            });
            await refetch();
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
                item={item}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
            />
        );
    }

    const contactInfo = [
        {
            icon: Mail,
            value: item.email || '',
            label: 'Correo electrónico',
            copyable: true
        },
        {
            icon: Phone,
            value: item.phone || '',
            label: 'Teléfono',
            copyable: true
        }
    ];

    const stats = [
        {
            value: formatDate(item.joinDate),
        label: 'Fecha de registro',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        icon: Calendar
    },
    {
        value: item.name_experience,
        label: 'Nombre de la experiencia',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        icon: Home
    }
];

const normalizeStatus = (status: string) => {
    switch (status.toLowerCase()) {
        case 'activo':
        case 'active':
            return 'active';
        case 'inactivo':
        case 'inactive':
            return 'inactive';
        case 'pendiente':
        case 'pending':
            return 'pending';
        default:
            return 'inactive';
    }
};

return (
    <ReusableCard
        item={{
            id: item.id ?? 0,
            name: item.name,
            status: normalizeStatus(item.status),
            image: item.image as string || '',
            description: `Emprendedor registrado el ${formatDate(item.joinDate)}`
        }}
        contactInfo={contactInfo}
        stats={stats}
        onEdit={handleEditClick}
        onDisable={() => onDisable(item.id ?? 0)}
        onActivate={() => onActivate(item.id ?? 0)}
        onDelete={() => onDelete?.(item.id ?? 0)}
        showImage={true}
        showStatus={true}
        variant="default"
        clickable={!!onView}
    >
    </ReusableCard>
);
}
