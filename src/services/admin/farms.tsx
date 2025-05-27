import { useGenericManagement } from '@/hooks/useGenericManagement';
import GenericManagement from '@/components/admin/GenericManagent';
import { createFarmsConfig } from '@/features/admin/farms/createFarmsConfig';
import FarmCard from '@/features/admin/farms/FamCard';
import { Farm } from '@/features/admin/farms/FarmTypes';

export function FarmsManagementWithAPI() {
    const {
        items: farms,
        isLoading,
        create,
        update,
        delete: deleteFarm,
    } = useGenericManagement<Farm>('fincas', '/fincas');

    const handleEdit = (farm: Farm) => {
        const updatedFarm = { ...farm, name: `${farm.name} (Editada)` };
        update(updatedFarm);
    };

    const handleDelete = (farmId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta finca?')) {
            deleteFarm(farmId);
        }
    };

    const handleView = (farm: Farm) => {
        console.log('Viewing farm:', farm);
        // Aquí podrías usar useNavigate para redirigir
    };

    const handleCreate = () => {
        const newFarm = {
            name: 'Nueva Finca',
            entrepreneur: 'Nuevo Emprendedor',
            location: 'Nueva Ubicación',
            Type: 'Café',
            status: 'draft' as const,
        };
        create(newFarm);
    };

    if (isLoading) return <div>Cargando fincas...</div>;

    const config = createFarmsConfig(farms, FarmCard, {
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
        onCreate: handleCreate,
    });

    

    return <GenericManagement config={ config } />;
}
