import GenericManagement, { defaultSidebarItems, BaseEntity } from '../GenericManagent';
import { EntrepreneurCard } from './EntrepreneursCard';
import { User, Mountain } from 'lucide-react';
import { createEntrepreneursConfig } from '@/components/admin/entrepreneurs/createEntrepreneursConfig';

export interface Entrepreneur extends BaseEntity {
    email: string;
    phone: string;
    farms: number;
    joinDate: string;
}

const entrepreneurs: Entrepreneur[] = [
    {
        id: 1,
        name: "Arturo Ocampo",
        email: "arturo@example.com",
        phone: "+57 300 123 4567",
        farms: 2,
        joinDate: "2023-01-15",
        status: "active",
    },
    // ... más emprendedores
];

export default function EntrepreneursManagement() {
    const handleEdit = (entrepreneur: Entrepreneur) => {
        console.log('Editing entrepreneur:', entrepreneur);
    };

    const handleDelete = (entrepreneurId: number) => {
        console.log('Deleting entrepreneur:', entrepreneurId);
    };

    const handleView = (entrepreneur: Entrepreneur) => {
        console.log('Viewing entrepreneur:', entrepreneur);
    };

    const handleCreate = () => {
        console.log('Creating new entrepreneur');
    };

    const config = createEntrepreneursConfig(
        entrepreneurs,
        EntrepreneurCard,
        { onEdit: handleEdit, onDelete: handleDelete, onView: handleView, onCreate: handleCreate }
    );

    // Stats personalizadas para emprendedores
    config.customStats = [
        {
            label: 'Emprendedores Activos',
            value: entrepreneurs.filter(e => e.status === 'active').length,
            icon: User,
            color: 'text-blue-600'
        },
        {
            label: 'Total Fincas',
            value: entrepreneurs.reduce((acc, e) => acc + e.farms, 0),
            icon: Mountain,
            color: 'text-green-600'
        }
    ];

    const sidebarItems = defaultSidebarItems.map(item => ({
        ...item,
        active: item.id === 'emprendedores'
    }));

    return <GenericManagement config={config} sidebarItems={sidebarItems} />;
}