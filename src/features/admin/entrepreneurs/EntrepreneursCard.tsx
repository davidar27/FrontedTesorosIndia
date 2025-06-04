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
    onDelete: (id: number) => void;
    onView?: (item: Entrepreneur) => void;
    refetch: () => Promise<QueryObserverResult<Entrepreneur[], unknown>>;
}

export function EntrepreneurCard({
    item,
    onEdit,
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

            // Solo envía los campos que cambiaron
            const changedFields: Partial<UpdateEntrepreneurData> = {};
            if (data.name && data.name !== item.name) changedFields.name = data.name;
            if (data.email && data.email !== item.email) changedFields.email = data.email;
            if (data.phone && data.phone !== item.phone) changedFields.phone = data.phone;
            if (data.name_farm && data.name_farm !== item.name_farm) changedFields.name_farm = data.name_farm;
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
        value: item.name_farm,
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
            id: item.id ?? 0,
            name: item.name,
            status: statusMap[item.status] || 'inactive',
            image: item.image as string || '',
            description: `Emprendedor registrado el ${formatDate(item.joinDate)}`
        }}
        contactInfo={contactInfo}
        stats={stats}
        onEdit={handleEditClick}
        onDelete={() => onDelete(item.id ?? 0)}
        showImage={true}
        showStatus={true}
        variant="default"
        clickable={!!onView}
    >
    </ReusableCard>
);
}
