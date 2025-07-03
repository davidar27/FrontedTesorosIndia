import { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { HostelApi } from '@/services/hostel/hostelServices';
import { Hotel, ArrowRight, X, Bed, ArrowLeft } from 'lucide-react';
import Picture from '@/components/ui/display/Picture';
import { getImageUrl } from '@/utils/getImageUrl';
import { formatPrice } from '@/utils/formatPrice';

interface Hostel {
    hostel_id: number;
    name: string;
    image: string;
    price: number;
    rating: number;
}

interface Room {
    room_id: number;
    name: string;
    image: string;
    price: number;
}

const Hostel = () => {
    const [showHospedaje, setShowHospedaje] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
    const [showRooms, setShowRooms] = useState(false);
    const [/* selectedRoom */, setSelectedRoom] = useState<Room | null>(null);

    const { data: hostel, isLoading: isLoadingHostels } = useQuery({
        queryKey: ['hostels'],
        queryFn: () => HostelApi.getHostels(),
    });


    const {
        data: rooms,
        refetch,
    } = useQuery({
        queryKey: ['rooms', selectedHostel?.hostel_id],
        queryFn: () => HostelApi.getRoomsHostel(selectedHostel!.hostel_id),
        enabled: !!selectedHostel?.hostel_id,
    });


    const handleHostelClick = (hostel: Hostel) => {
        setSelectedHostel(hostel);
        setShowRooms(true);
        refetch();
    };

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
        setShowRooms(true);
        refetch();
    };


    return (
        <div className="mx-auto ">
            {!showHospedaje ? (
                <button
                    onClick={() => setShowHospedaje(!showHospedaje)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-6 rounded-2xl w-full group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Hotel className="h-8 w-8 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="text-left">
                                <span className="text-xl font-semibold block group-hover:text-white transition-colors !duration-300">¿Necesitas Hospedaje?</span>
                                <span className="text-sm text-emerald-100 group-hover:text-white transition-colors duration-300">
                                    Dale click para ver los hostales disponibles
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    {showRooms ? (
                                        <Bed className="h-6 w-6" />
                                    ) : (
                                        <Hotel className="h-6 w-6" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold">{showRooms ? "Habitaciones" : "Hostales"} Disponibles</h3>
                            </div>
                            {showRooms ? (
                                <button
                                    onClick={() => setShowRooms(false)}
                                    className="text-gray-200 hover:bg-white/20 rounded-full p-2 bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowHospedaje(false)}
                                    className="text-gray-200 hover:bg-white/20 rounded-full p-2 bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Grid de hostales */}
                    <div className="p-6">
                        {isLoadingHostels ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <Hotel className="h-10 w-10 text-gray-400 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cargando hostales...</h3>
                                <p className="text-gray-600">Por favor espera mientras cargamos los hostales disponibles.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {showRooms ? (
                                        rooms?.map((room: Room) => (
                                            <div
                                                key={room.room_id}
                                                className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02]"
                                            >
                                                {/* Imagen */}
                                                <div className="relative w-full h-48 overflow-hidden">
                                                    <Picture
                                                        src={getImageUrl(room.image)}
                                                        alt={room.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    {/* Overlay gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>

                                                {/* Contenido */}
                                                <div className="p-5">
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                                                        {room.name}
                                                    </h4>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl font-bold text-emerald-600">
                                                                {formatPrice(room.price) || 'N/A'}
                                                            </span>
                                                            <span className="text-sm text-gray-500">/noche</span>
                                                        </div>

                                                        <div className="flex items-end-safe gap-1 text-emerald-600 text-sm font-medium">
                                                            <button
                                                                onClick={() => handleRoomClick(room)}
                                                                className='cursor-pointer'
                                                            >
                                                                Seleccionar habitación
                                                            </button>
                                                            <ArrowRight className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        hostel?.map((hostel: Hostel) => (
                                            <div
                                                key={hostel.hostel_id}
                                                className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02]"
                                            >
                                                {/* Imagen */}
                                                <div className="relative w-full h-48 overflow-hidden">
                                                    <Picture
                                                        src={getImageUrl(hostel.image)}
                                                        alt={hostel.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    {/* Overlay gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    {/* Badge de valoración */}
                                                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                        ⭐ {hostel.rating / 2 || 'N/A'}
                                                    </div>
                                                </div>

                                                {/* Contenido */}
                                                <div className="p-5">
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                                                        {hostel.name}
                                                    </h4>
                                                    <div className="flex items-end-safe gap-1 text-emerald-600 text-sm font-medium">
                                                        <button
                                                            onClick={() => handleHostelClick(hostel)}
                                                            className='cursor-pointer'
                                                        >
                                                            Ver habitaciones
                                                        </button>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        )))}
                                </div>

                                {/* Mensaje si no hay hostales */}
                                {(!hostel || hostel.length === 0) && (
                                    <div className="text-center py-12">
                                        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                            <Hotel className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay hostales disponibles</h3>
                                        <p className="text-gray-600">Por el momento no tenemos hostales disponibles en esta zona.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Hostel