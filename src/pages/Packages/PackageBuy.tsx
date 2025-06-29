import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, Users, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { PackageDetailsViewProps } from '@/features/packages/types/packagesTypes';
import { usePackageData } from '@/features/packages/hooks/usePackageData';
import { PackageHeader } from '@/features/packages/components/PackageHeader';
import { PackageImage } from '@/features/packages/components/PackageImage';
import { InfoCard } from '@/features/packages/components/InfoCard';
import { ExperienceList } from '@/features/packages/components/ExperienceList';
import { DateSelector } from '@/features/home/handleFastPackage/components/DateSelector';
import { PeopleCounter } from '@/features/home/handleFastPackage/components/PeopleCounter';
const PackageBuy: React.FC<PackageDetailsViewProps> = (
) => {
    const { packageId } = useParams<{ packageId: string }>();
    const { packageData, loading, error } = usePackageData(packageId);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const date = searchParams.get("date");
    const people = searchParams.get("people");
    const [selectedDate, setSelectedDate] = useState(date || "");
    const [selectedPeople, setSelectedPeople] = useState(Number(people) || 1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calcular precio total
    const totalPrice = packageData ? Number(packageData.price) * selectedPeople : 0;

    // Manejar compra del paquete
    const handlePurchase = async () => {
        if (!selectedDate) {
            alert('Por favor selecciona una fecha para tu reserva');
            return;
        }

        if (!packageData) return;

        setIsProcessing(true);

        try {
            // Aquí iría la lógica de compra/reserva
            // Por ejemplo, llamar a tu API para crear la reserva

            const reservationData = {
                packageId: packageData.package_id,
                date: selectedDate,
                people: selectedPeople,
                totalPrice: totalPrice,
            };

            console.log('Datos de reserva:', reservationData);

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Redirigir a página de pago o confirmación
            navigate(`/checkout?date=${selectedDate}&people=${selectedPeople}`, {
                state: {
                    type: 'package',
                    data: reservationData,
                    packageInfo: packageData
                }
            });

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            alert('Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Validar si se puede comprar
    const canPurchase = selectedDate && selectedPeople > 0 && selectedPeople <= (packageData?.capacity || 0);

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
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-primary/20 my-8">
            <PackageHeader
                packageData={packageData}
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
                            Capacidad Máxima
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-green-800">{packageData.capacity} personas</p>
                            <p className="text-gray-600 text-sm mt-2">Máximo de personas por reserva</p>
                        </div>
                    </div>
                </section>

                {/* Detalles del paquete */}
                <section className="bg-gray-50 p-6 rounded-lg mb-8">
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

                {/* Sección de Reserva */}
                <section className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                        ¡Reserva tu Paquete!
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Selección de Fecha */}
                        <div className="bg-primary p-4 rounded-lg shadow-sm">

                            <DateSelector
                                date={selectedDate}
                                onDateChange={setSelectedDate}
                                unavailableDates={[]}
                            />
                        </div>

                        {/* Selección de Personas */}
                        <div className="bg-secondary p-4 rounded-lg shadow-sm">
                            <PeopleCounter
                                people={selectedPeople}
                                setPeople={setSelectedPeople}
                                maxCapacity={packageData.capacity}
                                classNameButton="bg-white/20 text-white hover:bg-white/30"
                            />
                        </div>
                    </div>

                    {/* Resumen de Precio */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Precio por persona:</span>
                            <span className="font-semibold">{formatPrice(Number(packageData.price))}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Cantidad de personas:</span>
                            <span className="font-semibold">{selectedPeople}</span>
                        </div>
                        <hr className="my-3" />
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-800">Total:</span>
                            <span className="text-2xl font-bold text-green-800">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Botón de Compra */}
                    <button
                        onClick={handlePurchase}
                        disabled={!canPurchase || isProcessing}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${canPurchase && !isProcessing
                                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <LoadingSpinner message="" />
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5" />
                                <span>Comprar Paquete - {formatPrice(totalPrice)}</span>
                            </>
                        )}
                    </button>

                    {!canPurchase && !isProcessing && (
                        <p className="text-center text-red-600 text-sm mt-3">
                            {!selectedDate && "Selecciona una fecha para continuar"}
                            {selectedDate && selectedPeople > (packageData.capacity || 0) &&
                                `El número de personas excede la capacidad máxima (${packageData.capacity})`}
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default PackageBuy;