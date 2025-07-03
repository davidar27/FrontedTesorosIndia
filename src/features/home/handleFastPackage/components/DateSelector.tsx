import React, { useState, useRef } from "react";
import { Calendar } from "lucide-react";
import { DateCalendar } from "@/features/home/handleFastPackage/components/DateCalendar";

interface DateSelectorProps {
    date: string;
    onDateChange: (date: string) => void;
    unavailableDates: string[];
    disabled?: boolean;
    className?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
    date,
    onDateChange,
    unavailableDates,
    disabled = false,
    className = ""
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);

    return (
        <div className={` space-y-1 flex items-center flex-col pb-4 ${className}`}>
            <span className="text-white text-sm font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Selecciona la fecha
            </span>
            <button
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                disabled={disabled}
                className={`w-full py-4 flex items-center justify-between border border-white/50 rounded-xl px-4 cursor-pointer ${disabled
                    ? 'bg-white/30 text-gray-400'
                    : 'bg-white/80 hover:bg-white/90'
                    }`}
            >
                <span>
                    {date
                        ? (() => {
                            const [year, month, day] = date.split('-');
                            return `${day}/${month}/${year}`;
                        })()
                        : "dd/mm/aaaa"}
                </span>
                <Calendar className="w-4 h-4" />
            </button>

            {/* Componente de calendario - se podría mostrar condicionalmente */}
            {open && (
                <DateCalendar
                    anchorRef={buttonRef as React.RefObject<HTMLButtonElement>}
                    unavailableDates={unavailableDates}
                    selectedDate={date}
                    onDateSelect={onDateChange}
                    onClose={() => setOpen(false)}
                    disabled={disabled}
                />
            )}
        </div>
    );
};  