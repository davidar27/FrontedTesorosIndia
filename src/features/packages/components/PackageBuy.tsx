import { useState } from 'react'
import { DateSelector } from '@/features/home/handleFastPackage/components/DateSelector';
import { PeopleCounter } from '@/features/home/handleFastPackage/components/PeopleCounter';
import { formatPrice } from '@/utils/formatPrice';
import { PackageData } from '../types/packagesTypes';
import Hostel, { Room } from './Hostel';
import { MercadoPagoWallet } from '@/pages/payment/MercadoPagoWallet';
import { useAuth } from '@/context/AuthContext';


const PackageBuy = ({ packageData, date, people }: { packageData: PackageData, date: string | null, people: string | null }) => {

    const [isProcessing,] = useState(false);
    const { user } = useAuth();

    const [selectedDate, setSelectedDate] = useState(date || "");
    const [selectedPeople, setSelectedPeople] = useState(Number(people) || 1);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    

    const totalPrice = packageData ? Number(packageData.price) * selectedPeople : 0;

    const items = [
        {
            id: packageData.id,
            name: packageData.name,
            quantity: selectedPeople,
            priceWithTax: Number(packageData.price),
        }
    ];

    const finalTotal = items.reduce((acc, item) => acc + item.priceWithTax * item.quantity, 0);

    const handleBeforePay = () => {

        const reservationData = {
            id: packageData.id,
            date: selectedDate,
            people: selectedPeople,
            totalPrice: totalPrice,
            room_id: selectedRoom?.room_id,
            user_id: user?.id,
            // ...otros datos necesarios
        };
        localStorage.setItem("reservationData", JSON.stringify(reservationData));
    };

    const canPurchase = selectedDate && selectedPeople > 0 && selectedPeople <= (packageData?.capacity || 0);


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
            <Hostel selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
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
            {
                !canPurchase && !isProcessing && (
                    <p className="text-center text-red-600 text-sm mt-3">
                        {!selectedDate && "Selecciona una fecha para continuar"}
                        {selectedDate && selectedPeople > (packageData?.capacity || 0) &&
                            `El número de personas excede la capacidad máxima (${packageData?.capacity || 0})`}
                    </p>
                )
            }

            {/* Botón de Compra */}
            <MercadoPagoWallet items={items} total={finalTotal} onBeforePay={handleBeforePay} disabled={!canPurchase} />




        </section >
    )
}

export default PackageBuy