import { Hotel, ArrowRight } from "lucide-react";

export const MainButton = ({ hasSelectedRoom, onClick }: { hasSelectedRoom: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-6 rounded-2xl w-full group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
    >
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <Hotel className="h-8 w-8 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-left">
                    <span className="text-xl font-semibold block group-hover:text-white transition-colors !duration-300">
                        {hasSelectedRoom ? "Cambiar Hospedaje" : "¿Necesitas Hospedaje?"}
                    </span>
                    <span className="text-sm text-emerald-100 group-hover:text-white transition-colors duration-300">
                        {hasSelectedRoom
                            ? "Dale click para cambiar tu habitación"
                            : "Dale click para ver los hostales disponibles"
                        }
                    </span>
                </div>
            </div>
            <ArrowRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
);