/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Clock, DollarSign, MapPin, Star, Users } from 'lucide-react';
import { Package } from '@/features/admin/packages/PackageTypes';
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { formatPrice } from '@/utils/formatPrice';
import { InfoCard } from '@/features/packages/components/InfoCard';
import { ExperienceList } from '@/features/packages/components/ExperienceList';
import { Experience } from '@/features/packages/types/packagesTypes';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import UnavailableDatesComponent from './components/UnavailableDatesComponent';


interface DashboardDetails {
    detail_id: number;
    description: string;
}

interface ViewPackageInfoProps {
    packageData: Package
    experiences?: Experience[];
    details: DashboardDetails[];
}

function toYYYYMMDD(date: string) {
    if (date.includes('/')) {
        const [day, month, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('-')) {
        return date;
    }
    return date;
}

const ViewPackageInfo: React.FC<ViewPackageInfoProps> = ({
    packageData
}) => {
    const [loading,] = useState(false);
    const unavailableDates = Array.isArray(packageData.unavailableDates)
        ? packageData.unavailableDates.map(toYYYYMMDD)
        : [];

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-primary/20 space-y-4">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Información del Paquete</h1>
                <p className="text-gray-500">Visualiza la información del paquete turístico</p>
            </header>

            {/* Imagen */}

            <div className="mb-8 flex justify-center">
                {packageData.image && typeof packageData.image === 'string' && (
                    <Picture
                        src={getImageUrl(packageData.image)}
                        alt="Imagen del paquete"
                        className="rounded-xl max-h-64 object-cover border border-gray-200 shadow"
                    />
                )}
            </div>

            {/* Información básica */}
            <section className="grid grid-cols-1 gap-6 mb-8">
                <div className="w-full">
                    <label className="block text-sm font-medium text-green-600 mb-1">Nombre</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-gray-50">{packageData.name}</div>
                </div>
                {/* Descripción */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-green-700 mb-3">Descripción</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                    </div>
                </div>

            </section>

            {/* Información principal */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <InfoCard
                    title="Duración"
                    value={`${packageData.duration} horas`}
                    icon={<Clock className="mr-2 h-5 w-5" />}
                    bgColor="bg-blue-50"
                    textColor="text-blue-700"
                />
                <InfoCard
                    title="Precio por persona"
                    value={formatPrice(packageData.pricePerPerson ?? 0)}
                    icon={<DollarSign className="mr-2 h-5 w-5" />}
                    bgColor="bg-green-50"
                    textColor="text-green-700"
                />
                <InfoCard
                    title="Cantidad Máxima"
                    value={`${packageData.capacity} personas`}
                    icon={<Users className="mr-2 h-5 w-5" />}
                    bgColor="bg-green-50"
                    textColor="text-green-700"
                />
            </section>

            {/* Experiencias y fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <ExperienceList
                    title="Experiencias Incluidas"
                    icon={<MapPin className="mr-2 h-5 w-5" />}
                    experiences={packageData.experiences || []}
                    loading={false}
                    emptyMessage="No hay experiencias seleccionadas"
                />
                {/* Detalles */}
                <section className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-green-600" />
                        Detalles Incluidos
                    </h3>
                    <div className="grid grid-cols-1  gap-4">
                        {loading ? (
                            <LoadingSpinner message='Cargando detalles...' />
                        ) : Array.isArray(packageData.details) && packageData.details.length > 0 ? (
                            packageData.details.map((detail: any) => (
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


            <UnavailableDatesComponent
                unavailableDates={unavailableDates}
            />


        </div>
    );
};

export default ViewPackageInfo;
