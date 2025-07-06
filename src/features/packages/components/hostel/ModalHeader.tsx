import { Room } from "@/features/packages/components/Hostel";
import { Hotel, Bed, ArrowLeft, X } from "lucide-react";



export const ModalHeader = ({
    showRooms,
    selectedRoom,
    onBack,
    onClose
}: {
    showRooms: boolean;
    selectedRoom: Room | null;
    onBack: () => void;
    onClose: () => void;
}) => (
    <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    {showRooms ? <Bed className="h-6 w-6" /> : <Hotel className="h-6 w-6" />}
                </div>
                <div>
                    <h3 className="text-2xl font-bold">
                        {showRooms ? "Habitaciones" : "Hostales"} Disponibles
                    </h3>
                    {selectedRoom && (
                        <p className="text-emerald-100 text-sm">
                            Habitación actual: {selectedRoom.name}
                        </p>
                    )}
                </div>
            </div>
            {showRooms ? (
                <button
                    onClick={onBack}
                    className="text-gray-200 hover:bg-white/20 rounded-full p-2 bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
            ) : (
                <button
                    onClick={onClose}
                    className="text-gray-200 hover:bg-white/20 rounded-full p-2 bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    </div>
);