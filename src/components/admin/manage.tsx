// Ejemplo de filtros personalizados
import React, { useState } from 'react';

const CustomPackageFilters = ({ items, onFilterChange }) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [priceRange, setPriceRange] = useState('all');

    const applyFilters = () => {
        let filtered = items;

        // Filtrar por status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(item => item.status === selectedStatus);
        }

        // Filtrar por rango de precio
        if (priceRange !== 'all') {
            switch (priceRange) {
                case 'low':
                    filtered = filtered.filter(item => item.price < 30000);
                    break;
                case 'medium':
                    filtered = filtered.filter(item => item.price >= 30000 && item.price < 50000);
                    break;
                case 'high':
                    filtered = filtered.filter(item => item.price >= 50000);
                    break;
            }
        }

        onFilterChange(filtered);
    };

    React.useEffect(() => {
        applyFilters();
    }, [selectedStatus, priceRange]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Filtros</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="draft">Borrador</option>
                    </select>
                </div>

                {/* Price Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio</label>
                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">Todos</option>
                        <option value="low">Menos de $30.000</option>
                        <option value="medium">$30.000 - $50.000</option>
                        <option value="high">Más de $50.000</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

// Uso con filtros personalizados
export function PackagesManagementWithCustomFilters() {
    // ... configuración básica igual que antes
    const handleEdit = (pkg: Package) => console.log('Editing package:', pkg);
    const handleDelete = (packageId: number) => console.log('Deleting package:', packageId);
    const handleView = (pkg: Package) => console.log('Viewing package:', pkg);
    const handleCreate = () => console.log('Creating new package');

    const config = createPackagesConfig(
        packages,
        PackageCard,
        { onEdit: handleEdit, onDelete: handleDelete, onView: handleView, onCreate: handleCreate }
    );

    // Agregar filtros personalizados
    config.customFilters = CustomPackageFilters;

    // Stats personalizadas para paquetes
    config.customStats = [
        {
            label: 'Paquetes Activos',
            value: packages.filter(p => p.status === 'active').length,
            icon: Package,
            color: 'text-blue-600'
        },
        {
            label: 'Precio Promedio',
            value: `${Math.round(packages.reduce((acc, p) => acc + p.price, 0) / packages.length).toLocaleString()}`,
            icon: Coffee,
            color: 'text-green-600'
        },
        {
            label: 'Categorías',
            value: new Set(packages.map(p => p.category)).size,
            icon: Tag,
            color: 'text-purple-600'
        }
    ];

    const sidebarItems = defaultSidebarItems.map(item => ({
        ...item,
        active: item.id === 'paquetes'
    }));

    return <GenericManagement config={config} sidebarItems={sidebarItems} />;
}

// Router/Navigation component example



// Ejemplo de configuración avanzada con hooks personalizados


// Uso del hook personalizado
