import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { createPortal } from 'react-dom';

interface DateCalendarProps {
    unavailableDates: string[];
    selectedDate?: string;
    onDateSelect: (date: string) => void;
    disabled?: boolean;
    anchorRef: React.RefObject<HTMLButtonElement>;
    onClose: () => void;
}

export const DateCalendar: React.FC<DateCalendarProps> = ({
    unavailableDates,
    selectedDate,
    onDateSelect,
    disabled = false,
    anchorRef,
    onClose
}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [closeCalendar, setCloseCalendar] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const daysInMonth = useMemo(() => {
        const date = currentMonth;
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonthCount = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();


        const days: (number | null)[] = [];

        const adjustedStartingDay = startingDayOfWeek;

        for (let i = 0; i < adjustedStartingDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonthCount; day++) {
            days.push(day);
        }

        return days;
    }, [currentMonth]);

    const formatDateToString = useCallback((day: number): string => {
        const year = currentMonth.getFullYear();
        const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
        const dayString = day.toString().padStart(2, '0');
        return `${year}-${month}-${dayString}`;
    }, [currentMonth]);

    const convertUnavailableDate = useCallback((dateStr: string): string => {
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
    }, []);

    const isDateUnavailable = useCallback((day: number): boolean => {
        const dateString = formatDateToString(day);
        const convertedUnavailableDates = unavailableDates.map(convertUnavailableDate);
        return convertedUnavailableDates.includes(dateString);
    }, [unavailableDates, formatDateToString, convertUnavailableDate]);

    const isDateSelected = useCallback((day: number): boolean => {
        if (!selectedDate) return false;
        const dateString = formatDateToString(day);
        return dateString === selectedDate;
    }, [selectedDate, formatDateToString]);

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
        if (disabled) return;
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    }, [disabled]);

    const handleDateClick = useCallback((day: number): void => {
        if (disabled || isPastDate(day) || isDateUnavailable(day)) {
            return;
        }
        const dateString = formatDateToString(day);
        onDateSelect(dateString);
    }, [disabled, formatDateToString, onDateSelect, isPastDate, isDateUnavailable]);

    useEffect(() => {
        if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPos({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [anchorRef]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node) &&
                !document.getElementById('calendar-portal')?.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [anchorRef, onClose]);

    const monthNames: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const availableDatesCount = useMemo(() => {
        let count = 0;
        const daysInCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

        for (let day = 1; day <= daysInCurrentMonth; day++) {
            if (!isPastDate(day) && !isDateUnavailable(day)) {
                count++;
            }
        }
        return count;
    }, [currentMonth, isPastDate, isDateUnavailable]);

    if (closeCalendar) return null;

    return createPortal(
        <div
            id="calendar-portal"
            style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 1000,
            }}
        >
            <div className={`w-60 absolute top-1/2 translate-y-1/5 shadow-lg bg-white rounded-lg ${disabled ? ' pointer-events-none' : ''}`}>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                    {disabled ? (
                        <div className="text-center py-8 text-gray-900">
                            <Calendar className="h-12 w-12 mx-auto mb-2" />
                            <p>Primero selecciona un paquete para ver las fechas disponibles</p>
                        </div>
                    ) : (
                        <>
                            {/* Navegación del mes */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-900"
                                >
                                    ←
                                </button>
                                <h3 className="font-medium text-gray-900">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-900"
                                >
                                    →
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map((day, index) => (
                                    <div key={`${day}-${index}`} className="text-center text-sm font-medium text-gray-900 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendario */}
                            <div className="grid grid-cols-7 gap-1">
                                {daysInMonth.map((day, index) => (
                                    <div key={index} className="aspect-square flex items-center justify-center">
                                        {day && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDateClick(day);
                                                    setCloseCalendar(true);
                                                }}
                                                disabled={isPastDate(day) || isDateUnavailable(day)}
                                                className={`w-6 h-6 rounded-full text-sm font-medium transition-all duration-200 ${isPastDate(day)
                                                        ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                                                        : isDateUnavailable(day)
                                                            ? 'bg-red-500/50 text-red-200 cursor-not-allowed line-through'
                                                            : isDateSelected(day)
                                                                ? 'bg-green-500 text-black shadow-lg scale-110 ring-2 ring-green-300'
                                                                : isToday(day)
                                                                    ? 'bg-blue-500/70 text-black hover:bg-blue-500 ring-2 ring-blue-300'
                                                                    : 'bg-white/20 text-black hover:bg-white/30 hover:scale-105'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        )}
                                        {!day && <span style={{ opacity: 0.3 }}>-</span>}
                                    </div>
                                ))}
                            </div>

                            {/* Leyenda */}
                            <div className="flex flex-wrap gap-3 text-xs p-2 ">
                                <div className="flex items-center text-black/80">
                                    <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                                    <span>Disponible</span>
                                </div>
                                <div className="flex items-center text-green-300">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span>Seleccionada</span>
                                </div>
                                <div className="flex items-center text-blue-300">
                                    <div className="w-3 h-3 bg-blue-500/70 rounded-full mr-2"></div>
                                    <span>Hoy</span>
                                </div>
                                <div className="flex items-center text-red-300">
                                    <div className="w-3 h-3 bg-red-500/50 rounded-full mr-2"></div>
                                    <span>No disponible</span>
                                </div>
                            </div>


                            {/* Aviso si no hay fechas disponibles */}
                            {availableDatesCount === 0 && (
                                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                    <div className="flex items-center text-yellow-300">
                                        <span>⚠️</span>
                                        <span className="ml-2 text-sm">
                                            No hay fechas disponibles en este mes. Navega a otro mes.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};