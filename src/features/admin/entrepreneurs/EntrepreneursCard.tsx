import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Phone, Mail, Calendar, Home } from 'lucide-react';
import { Entrepreneur, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { EditableEntrepreneurCard } from './EditableEntrepreneurCard';
import { entrepreneursApi } from '@/services/admin/entrepernaur';

interface EntrepreneurCardProps {
    item: Entrepreneur;
    onEdit: (item: Entrepreneur) => void;
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

    // Asegurarse de que el item tenga un id válido
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

    const handleSave = async (id: number, data: UpdateEntrepreneurData) => {
        try {
            setIsLoading(true);
            const updatedEntrepreneur = await entrepreneursApi.update(id, data);
            onEdit(updatedEntrepreneur);
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar el emprendedor:', error);
            // Aquí podrías mostrar un toast o notificación de error
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

    const formatDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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

    // Mapear el estado a los valores esperados por el componente
    const statusMap: { [key: string]: string } = {
        'Activo': 'active',
        'Inactivo': 'inactive',
        'Pendiente': 'pending'
    };

    return (
        <ReusableCard
            item={{
                id: entrepreneur.id,
                name: entrepreneur.name,
                status: statusMap[entrepreneur.status] || 'inactive',
                image: entrepreneur.image || '',
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
        />
    );
}
