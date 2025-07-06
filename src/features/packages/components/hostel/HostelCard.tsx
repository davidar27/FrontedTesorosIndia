import { Hostel } from "@/features/packages/components/Hostel";
import Picture from "@/components/ui/display/Picture";
import { getImageUrl } from "@/utils/getImageUrl";
import { ArrowRight } from "lucide-react";



export const HostelCard = ({
    hostel,
    onSelect
}: {
    hostel: Hostel;
    onSelect: () => void;
}) => (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02]">
        <div className="relative w-full h-48 overflow-hidden">
            <Picture
                src={getImageUrl(hostel.image)}
                alt={hostel.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                ⭐ {hostel.rating / 2 || 'N/A'}
            </div>
        </div>

        <div className="p-5">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                {hostel.name}
            </h4>
            <div className="flex items-end-safe gap-1 text-emerald-600 text-sm font-medium">
                <button
                    onClick={onSelect}
                    className='cursor-pointer hover:text-emerald-700 transition-colors duration-300'
                >
                    Ver habitaciones
                </button>
                <ArrowRight className="h-4 w-4" />
            </div>
        </div>
    </div>
);