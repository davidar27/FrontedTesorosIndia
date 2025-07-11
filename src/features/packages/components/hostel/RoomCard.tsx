import { Room } from "@/features/packages/components/Hostel";
import { formatPrice } from "@/utils/formatPrice";
import { Check, ArrowRight } from "lucide-react";
import Picture from "@/components/ui/display/Picture";
import { getImageUrl } from "@/utils/getImageUrl";


export const RoomCard = ({
    room,
    isSelected,
    onSelect
}: {
    room: Room;
    isSelected: boolean;
    onSelect: () => void;
}) => (
    <div className={`group bg-white rounded-xl border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02] ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'
        }`}>
        <div className="relative w-full h-48 overflow-hidden">
            <Picture
                src={getImageUrl(room.image)}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {isSelected && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Seleccionada
                </div>
            )}
        </div>

        <div className="p-5">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                {room.name}
            </h4>
            <p className="text-sm text-gray-500 mb-2">
                Cantidad: {room.capacity} personas
            </p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-emerald-600">
                        {formatPrice(room.price) || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-500">/noche</span>
                </div>

                <div className="flex items-end-safe gap-1 text-emerald-600 text-sm font-medium">
                    <button
                        onClick={onSelect}
                        className='cursor-pointer hover:text-emerald-700 transition-colors duration-300'
                    >
                        {isSelected ? 'Habitación actual' : 'Seleccionar habitación'}
                    </button>
                    {!isSelected && <ArrowRight className="h-4 w-4" />}
                </div>
            </div>
        </div>
    </div>
);