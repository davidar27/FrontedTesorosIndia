import { Calendar, X } from 'lucide-react';

interface UnavailableDatesProps {
    unavailableDates: string[];
    onRemoveDate?: (index: number) => void;
    editable?: boolean;
}

const UnavailableDatesComponent = ({
    unavailableDates,
    onRemoveDate,
    editable = false
}: UnavailableDatesProps) => {
    return (


        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl px-4 py-4  shadow-sm space-y-2">
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <label className="text-lg font-semibold text-gray-700">
                    Fechas no disponibles
                </label>
            </div>
            {unavailableDates.length === 0 ? (
                <div className="flex items-center justify-center h-12">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm italic">No hay fechas bloqueadas</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {unavailableDates.map((date, idx) => (
                            <div
                                key={idx}
                                className="inline-flex items-center gap-2 bg-white border border-red-200 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <span className="font-medium">{date}</span>
                                </div>

                                {editable && onRemoveDate && (
                                    <button
                                        onClick={() => onRemoveDate(idx)}
                                        className="ml-1 p-1 hover:bg-red-50 rounded-full transition-colors duration-200 group"
                                        title="Eliminar fecha"
                                    >
                                        <X className="w-3 h-3 text-red-400 group-hover:text-red-600" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{unavailableDates.length} fecha{unavailableDates.length !== 1 ? 's' : ''} bloqueada{unavailableDates.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnavailableDatesComponent;