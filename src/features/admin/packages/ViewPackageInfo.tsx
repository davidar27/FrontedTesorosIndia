import React from 'react';
import { Clock, DollarSign, MapPin } from 'lucide-react';
import { UpdatePackageData } from '@/features/admin/packages/PackageTypes';
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { formatPrice } from '@/utils/formatPrice';
import { InfoCard } from '@/features/packages/components/InfoCard';
import { ExperienceList } from '@/features/packages/components/ExperienceList';
import { Experience } from '@/features/packages/types/packagesTypes';



interface DashboardDetails {
    detail_id: number;
    description: string;
}

interface ViewPackageInfoProps {
    packageData: Partial<UpdatePackageData> & { image?: string };
    experiences?: Experience[];
    details?: DashboardDetails[];
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
    packageData,
    experiences = [],
    details = [],
}) => {
    // Obtener los datos a mostrar
    

    const selectedExperiences = Array.isArray(packageData.selectedExperiences)
        ? packageData.selectedExperiences as number[]
        : [];
    const selectedDetails = Array.isArray(packageData.details)
        ? packageData.details.map((d: unknown) => (typeof d === 'object' && d !== null && 'detail_id' in d ? (d as { detail_id: number }).detail_id : d as number))
        : [];
    const unavailableDates = Array.isArray(packageData.unavailableDates)
        ? packageData.unavailableDates.map(toYYYYMMDD)
        : [];

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-primary/20">
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
                    <div className="w-full px-4 py-3 border rounded-lg bg-gray-50">{packageData.name}</div>
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

            {/* Experiencias y fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-8">
                <ExperienceList
                    title="Experiencias Incluidas"
                    icon={<MapPin className="mr-2 h-5 w-5" />}
                    experiences={experiences.filter(e =>
                        selectedExperiences.includes(e.experience_id)
                    )}
                    loading={false}
                    emptyMessage="No hay experiencias seleccionadas"
                />
                <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Fechas no disponibles</label>
                    <div className="bg-gray-50 border rounded-lg px-4 py-3 min-h-[48px]">
                        {unavailableDates.length === 0 ? (
                            <span className="text-gray-400">Sin fechas</span>
                        ) : (
                            <ul className="list-disc pl-5">
                                {unavailableDates.map((date, idx) => (
                                    <li key={idx}>{date}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Duración y precio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Duración Por Horas
                    </label>
                    <div className="w-full px-4 py-3 border rounded-lg bg-gray-50">{packageData.duration}</div>
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">Precio</label>
                    <div className="w-full px-4 py-3 border rounded-lg bg-gray-50">
                        {packageData.price ? `$${packageData.price}` : 'No especificado'}
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Cantidad de Personas
                    </label>
                    <div className="w-full px-4 py-3 border rounded-lg bg-gray-50">{packageData.capacity}</div>
                </div>
            </div>

            {/* Detalles */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-green-600 mb-1">Detalles</label>
                <ul className="list-disc pl-5 bg-gray-50 border rounded-lg px-4 py-3 min-h-[48px]">
                    {selectedDetails.length === 0 && <li className="text-gray-400">Sin detalles</li>}
                    {selectedDetails.map((id: number) => {
                        const det = details.find(d => d.detail_id === id);
                        return (
                            <li key={id}>{det ? det.description : `ID: ${id}`}</li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ViewPackageInfo;
