import { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { HostelApi } from '@/services/hostel/hostelServices';
import { Hotel } from 'lucide-react';
import { SelectedRoomBanner } from './hostel/SelectedRoomBanner';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { MainButton } from '@/features/packages/components/hostel/MainButton';
import { ModalHeader } from '@/features/packages/components/hostel/ModalHeader';
import { RoomCard } from '@/features/packages/components/hostel/RoomCard';
import { HostelCard } from '@/features/packages/components/hostel/HostelCard';

export interface Hostel {
    hostel_id: number;
    name: string;
    image: string;
    price: number;
    rating: number;
}

export interface Room {
    room_id: number;
    name: string;
    image: string;
    capacity: number;
    price: number;
}

const Hostel = ({ selectedRoom, setSelectedRoom }: { selectedRoom: Room | null, setSelectedRoom: (room: Room | null) => void }) => {
    const [showHospedaje, setShowHospedaje] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
    const [showRooms, setShowRooms] = useState(false);

    

    const { data: hostels, isLoading: isLoadingHostels } = useQuery({
        queryKey: ['hostels'],
        queryFn: () => HostelApi.getHostels(),
    });

    const { data: rooms, refetch } = useQuery({
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
        setShowRooms(false);
        setShowHospedaje(false);
    };

    const handleCancelReservation = () => {
        setSelectedRoom(null);
        setSelectedHostel(null);
        setShowRooms(false);
    };

    const handleOpenHospedaje = () => {
        setShowHospedaje(true);
    };

    if (!showHospedaje) {
        return (
            <div className="mx-auto">
                {selectedRoom && (
                    <SelectedRoomBanner
                        room={selectedRoom}
                        onCancel={handleCancelReservation}
                    />
                )}
                <MainButton
                    hasSelectedRoom={!!selectedRoom}
                    onClick={handleOpenHospedaje}
                />
            </div>
        );
    }

    return (
        <div className="mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
                <ModalHeader
                    showRooms={showRooms}
                    selectedRoom={selectedRoom}
                    onBack={() => setShowRooms(false)}
                    onClose={() => setShowHospedaje(false)}
                />

                <div className="p-6">
                    {isLoadingHostels ? (
                        <LoadingSpinner message='Cargando hostales...' position='overlay' />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {showRooms ? (
                                    rooms?.map((room: Room) => (
                                        <RoomCard
                                            key={room.room_id}
                                            room={room}
                                            isSelected={selectedRoom?.room_id === room.room_id}
                                            onSelect={() => handleRoomClick(room)}
                                        />
                                    ))
                                ) : (
                                    hostels?.map((hostel: Hostel) => (
                                        <HostelCard
                                            key={hostel.hostel_id}
                                            hostel={hostel}
                                            onSelect={() => handleHostelClick(hostel)}
                                        />
                                    ))
                                )}
                            </div>

                            {(!hostels || hostels.length === 0) && (
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
        </div>
    );
};

export default Hostel;