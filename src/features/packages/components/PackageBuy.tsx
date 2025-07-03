import { HostelApi } from '@/services/hostel/hostelServices';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DateSelector } from '@/features/home/handleFastPackage/components/DateSelector';
import { PeopleCounter } from '@/features/home/handleFastPackage/components/PeopleCounter';
import Button from '@/components/ui/buttons/Button';
import { Hotel, ArrowRight, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { PackageData } from '../types/packagesTypes';
import Picture from '@/components/ui/display/Picture';
import { getImageUrl } from '@/utils/getImageUrl';

interface Hostel {
    id: number;
    name: string;
    image: string;
}




const PackageBuy = ({ packageData }: { packageData: PackageData }) => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [showHospedaje, setShowHospedaje] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    console.log("showHospedaje", showHospedaje);

    const date = searchParams.get("date");
    const people = searchParams.get("people")

    const [selectedDate, setSelectedDate] = useState(date || "");
    const [selectedPeople, setSelectedPeople] = useState(Number(people) || 1);

    const totalPrice = packageData ? Number(packageData.price) * selectedPeople : 0;

    const { data: hostels, /* isLoading: isLoadingHostels */ } = useQuery({
        queryKey: ['hostels'],
        queryFn: () => HostelApi.getHostels(),
    });
    console.log("showHospedaje", showHospedaje);

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
                id: packageData.id,
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
    console.log("showHospedaje", showHospedaje);


    const handleHostelClick = (hostel: Hostel) => {
        console.log("hostel", hostel);
        setShowHospedaje(true);
    };

    console.log("showHospedaje", showHospedaje);




    return (
        < section className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200 space-y-4" >
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                ¡Reserva tu Paquete!
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-center justify-center">
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
                        maxCapacity={packageData?.capacity || 0}
                        classNameButton="bg-white/20 text-white hover:bg-white/30"
                    />
                </div>


            </div>

            <div className="mx-auto">
                {!showHospedaje ? (
                    <Button onClick={() => setShowHospedaje(!showHospedaje)} className="bg-primary text-white flex flex-col items-center justify-center gap-y-4  px-13 rounded-lg w-full group relative">
                        <div className="flex items-center gap-2 text-xl">
                            <span
                                className="flex items-center gap-2 text-xl"><Hotel className="h-8 w-8 " /> ¿Necesitas Hospedaje?</span>
                            <span
                                className="text-sm text-gray-100 group-hover:text-gray-500 flex items-center  justify-center transition-all duration-300">
                                Dale click para ver los hostales disponibles
                                <ArrowRight
                                    className="h-6 w-6 absolute right-5" />
                            </span>
                        </div>
                    </Button>
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                            <Hotel className="mr-2 h-5 w-5 text-green-600" />
                            Hostales Disponibles
                        </h3>
                        {hostels?.map((hostel: Hostel) => (
                            <div
                                key={hostel.id}
                                onClick={() => handleHostelClick(hostel)}
                                className="text-gray-700 hover:text-green-600 cursor-pointer flex items-center justify-between flex-col bg-green-400 w-fit p-2">
                                <Picture
                                    src={getImageUrl(hostel.image)}
                                    alt={hostel.name}
                                    className="object-cover"
                                />
                                <h3 className="text-gray-700 hover:text-green-600 cursor-pointer">{hostel.name}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resumen de Precio */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Precio por persona:</span>
                    <span className="font-semibold">{formatPrice(Number(packageData?.price || 0))}</span>
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

            {
                !canPurchase && !isProcessing && (
                    <p className="text-center text-red-600 text-sm mt-3">
                        {!selectedDate && "Selecciona una fecha para continuar"}
                        {selectedDate && selectedPeople > (packageData?.capacity || 0) &&
                            `El número de personas excede la capacidad máxima (${packageData?.capacity || 0})`}
                    </p>
                )
            }
        </section >
    )
}

export default PackageBuy