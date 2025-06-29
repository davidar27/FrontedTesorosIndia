import React from 'react';

interface DateInputProps {
    date: string;
    setDate: (date: string) => void;
    touched?: boolean;
    label?: string;
    inputStyles?: string;
    availableDates?: string[];
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}

const DateInput: React.FC<DateInputProps> = ({
    date,
    setDate,
    label = "Fecha",
    inputStyles = "",
    availableDates = [],
    disabled = false,
    placeholder = "Selecciona una fecha",
    error
}) => {
    const formatDateForDisplay = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Función para obtener el rango de fechas para el input
    const getDateInputProps = () => {
        if (availableDates.length === 0) {
            // Si no hay fechas disponibles, usar rango normal
            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 365); // 1 año hacia adelante

            return {
                min: today.toISOString().split('T')[0],
                max: maxDate.toISOString().split('T')[0]
            };
        }

        // Si hay fechas disponibles, usar el rango de esas fechas
        const sortedDates = [...availableDates].sort();
        return {
            min: sortedDates[0],
            max: sortedDates[sortedDates.length - 1]
        };
    };

    const { min, max } = getDateInputProps();

    return (
        <div className="w-full">
            {label && (
                <label className="block text-white text-sm font-medium mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={disabled}
                    min={min}
                    max={max}
                    className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            text-gray-900 bg-white
            ${inputStyles}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          `}
                    placeholder={placeholder}
                />

                {/* Indicador de fechas disponibles */}
                {availableDates.length > 0 && !disabled && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <span className="text-green-500 text-xs">
                            📅 {availableDates.length}
                        </span>
                    </div>
                )}
            </div>

            {/* Información adicional */}
            {date && availableDates.length > 0 && (
                <div className="mt-1 text-xs text-white/80">
                    <span>✅ {formatDateForDisplay(date)}</span>
                </div>
            )}

            {/* Lista de primeras fechas disponibles (máximo 5) */}
            {!date && availableDates.length > 0 && !disabled && (
                <div className="mt-2 bg-white/10 rounded-lg p-2">
                    <p className="text-xs text-white/80 mb-1">Próximas fechas disponibles:</p>
                    <div className="flex flex-wrap gap-1">
                        {availableDates.slice(0, 5).map((availableDate, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setDate(availableDate)}
                                className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded transition-colors"
                            >
                                {formatDateForDisplay(availableDate)}
                            </button>
                        ))}
                        {availableDates.length > 5 && (
                            <span className="text-xs text-white/60 px-2 py-1">
                                +{availableDates.length - 5} más...
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Mensaje cuando no hay fechas disponibles */}
            {availableDates.length === 0 && !disabled && (
                <div className="mt-1 text-xs text-yellow-300">
                    ⚠️ No hay fechas disponibles para este paquete
                </div>
            )}

            {/* Mensaje cuando está deshabilitado */}
            {disabled && (
                <div className="mt-1 text-xs text-white/60">
                    {placeholder}
                </div>
            )}
        </div>
    );
};

export default DateInput;