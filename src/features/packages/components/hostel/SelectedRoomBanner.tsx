import { XCircle } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { Check } from "lucide-react";
import { Room } from "@/features/packages/components/Hostel";



export const SelectedRoomBanner = ({ room, onCancel }: { room: Room; onCancel: () => void }) => (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-full">
                    <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h4 className="font-semibold text-emerald-800">Habitación seleccionada</h4>
                    <p className="text-sm text-emerald-600">
                        {room.name} - {formatPrice(room.price)}/noche
                    </p>
                </div>
            </div>
            <button
                onClick={onCancel}
                className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-full p-2 transition-all duration-300"
                title="Cancelar reserva"
            >
                <XCircle className="h-5 w-5" />
            </button>
        </div>
    </div>
);
