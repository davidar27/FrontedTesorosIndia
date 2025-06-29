import React, { useState, useCallback, useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface DateCalendarProps {
    unavailableDates: string[];
    onDateToggle: (date: string) => void;
}

export const DateCalendar: React.FC<DateCalendarProps> = ({ unavailableDates, onDateToggle }) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5));

    const daysInMonth = useMemo(() => {
        const date = currentMonth;
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonthCount = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonthCount; day++) {
            days.push(day);
        }

        return days;
    }, [currentMonth]);

    const formatDateToString = useCallback((day: number): string => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, day);

        return date.toISOString().split('T')[0];
    }, [currentMonth]);

    const isDateUnavailable = useCallback((day: number): boolean => {
        const dateString = formatDateToString(day);
        return unavailableDates.includes(dateString);
    }, [unavailableDates, formatDateToString]);

    const isToday = useCallback((day: number): boolean => {
        const today = new Date();
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        return today.toDateString() === currentDate.toDateString();
    }, [currentMonth]);

    const isPastDate = useCallback((day: number): boolean => {
        const today = new Date();
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        today.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return currentDate < today;
    }, [currentMonth]);

    const navigateMonth = useCallback((direction: number): void => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    }, []);

    const handleDateClick = useCallback((day: number): void => {
        if (isPastDate(day)) {
            return;
        }

        const dateString = formatDateToString(day);
        onDateToggle(dateString);
    }, [formatDateToString, onDateToggle, isPastDate]);

    const monthNames: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <div className="w-full border-2 border-primary/30 rounded-lg p-4">
            <label className="text-sm font-medium text-green-600 mb-2 flex items-center">
                <Calendar className="inline mr-2 h-4 w-4" />
                Fechas no disponibles
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                        ←
                    </button>
                    <h3 className="font-medium">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                        →
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day, index) => (
                        <div key={`${day}-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((day, index) => (
                        <div key={index} className="aspect-square flex items-center justify-center">
                            {day && (
                                <button
                                    type="button"
                                    onClick={() => handleDateClick(day)}
                                    disabled={isPastDate(day)}
                                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${isPastDate(day)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : isDateUnavailable(day)
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : isToday(day)
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {day}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 mt-4 text-sm">
                    <div className="flex items-center text-red-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>No disponibles</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Hoy</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-2"></div>
                        <span>Fechas pasadas</span>
                    </div>
                </div>

                {unavailableDates.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Fechas no disponibles:</h4>
                        <div className="flex flex-wrap gap-1">
                            {unavailableDates.map((date, index) => (
                                <span key={index} className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                                    {new Date(date).toLocaleDateString('es-ES')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};