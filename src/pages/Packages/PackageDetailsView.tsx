import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, Users } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { PackageDetailsViewProps } from '@/features/packages/types/packagesTypes';
import { usePackageData } from '@/features/packages/hooks/usePackageData';
import { PackageHeader } from '@/features/packages/components/PackageHeader';
import { PackageImage } from '@/features/packages/components/PackageImage';
import { InfoCard } from '@/features/packages/components/InfoCard';
import { ExperienceList } from '@/features/packages/components/ExperienceList';

const PackageDetailsView: React.FC<PackageDetailsViewProps> = ({
    onEdit,
    onDelete,
    onStatusChange,
    isEditable = true,
    showActions = true
}) => {
    const { packageId } = useParams<{ packageId: string }>();
    const { packageData, loading, error } = usePackageData(packageId);
    console.log(packageData);

    // Event handlers
    const handleEdit = () => {
        if (onEdit && packageData) {
            onEdit(packageData);
        }
    };

    const handleDelete = () => {
        if (onDelete && packageData?.package_id) {
            if (window.confirm('¿Estás seguro de que deseas eliminar este paquete?')) {
                onDelete(packageData.package_id.toString());
            }
        }
    };

    const handleStatusChange = (newStatus: string) => {
        if (onStatusChange && packageData?.package_id) {
            onStatusChange(packageData.package_id.toString(), newStatus);
        }
    };

    // Loading state
    if (loading || !packageData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner message="Cargando detalles del paquete..." />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-600 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-primary/20
        my-30">
            <PackageHeader
                packageData={packageData}
                showActions={showActions}
                isEditable={isEditable}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
            />

            <div className="p-8">
                <PackageImage
                    image={packageData.image}
                    name={packageData.name}
                />

                {/* Descripción */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-green-700 mb-3">Descripción</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                    </div>
                </section>

                {/* Información principal */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InfoCard
                        title="Duración"
                        value={`${packageData.duration} horas`}
                        icon={<Clock className="mr-2 h-5 w-5" />}
                        bgColor="bg-blue-50"
                        textColor="text-blue-700"
                    />
                    <InfoCard
                        title="Precio por persona"
                        value={formatPrice(Number(packageData.price))}
                        icon={<DollarSign className="mr-2 h-5 w-5" />}
                        bgColor="bg-green-50"
                        textColor="text-green-700"
                    />
                </section>

                {/* Experiencias y Capacidad */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ExperienceList
                        title="Experiencias Incluidas"
                        icon={<MapPin className="mr-2 h-5 w-5" />}
                        experiences={packageData.experiences || []}
                        loading={loading}
                        emptyMessage="No hay experiencias seleccionadas"
                    />

                    <div className="border-2 border-primary/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Cantidad
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-green-800">{packageData.capacity} personas</p>
                            <p className="text-gray-600 text-sm mt-2">Máximo de personas por reserva</p>
                        </div>
                    </div>
                </section>

                {/* Detalles del paquete */}
                <section className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-green-600" />
                        Detalles Incluidos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            <LoadingSpinner message='Cargando detalles...' />
                        ) : packageData.details.length > 0 ? (
                            packageData.details.map((detail) => (
                                <div
                                    key={detail.detail_id}
                                    className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
                                >
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">{detail.detail}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic col-span-full">
                                No hay detalles seleccionados
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PackageDetailsView;