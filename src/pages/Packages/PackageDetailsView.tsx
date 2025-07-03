import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, Users, Briefcase } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { PackageData, PackageDetailsViewProps } from '@/features/packages/types/packagesTypes';
import { usePackageData } from '@/features/packages/hooks/usePackageData';
import HeroSection from '@/features/packages/components/HeroSection';
import { InfoCard } from '@/features/packages/components/InfoCard';
import { ExperienceList } from '@/features/packages/components/ExperienceList';
import PackageBuy from '@/features/packages/components/PackageBuy';


const PackageDetailsView: React.FC<PackageDetailsViewProps> = (
) => {
    const { packageId } = useParams<{ packageId: string }>();
    const { packageData, loading, error } = usePackageData(packageId);
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date");
    const people = searchParams.get("people")


    useEffect(() => {
        console.log(date, people)
    }, [date, people])


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
        <section className="w-full mx-auto border border-primary/20 my-8">


            <HeroSection
                packageData={packageData as unknown as PackageData}
            />

            <section className="responsive-padding-x responsive-padding-y space-y-8 rounded-2xl">
                {/* Descripción */}

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-green-700 flex items-center"> <Briefcase className="mr-2 h-5 w-5" />Descripción</h2>
                        <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                        <div className="border-2 border-primary/30 rounded-lg p-6 bg-white shadow-md">
                            <h3 className="text-lg font-semibold text-green-700 flex items-center ">
                                <Users className="mr-2 h-5 w-5" />
                                Capacidad Máxima
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <p className="text-2xl font-bold text-green-800">{packageData.capacity} personas</p>
                                <p className="text-gray-600 text-sm ">Máximo de personas por reserva</p>
                            </div>
                        </div>
                    </div>
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
                    {/* Detalles del paquete */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-md">
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
                </section>
                <PackageBuy packageData={packageData} date={date} people={people} />
            </section>
        </section>
    );
};

export default PackageDetailsView;