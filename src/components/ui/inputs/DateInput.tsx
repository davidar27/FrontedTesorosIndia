


const DateInput = ({ date, setDate, touched, label }: {
    date: string;
    setDate: (date: string) => void;
    touched: boolean;
    label: string;
}) => {
    const inputStyles = `
    w-full rounded-lg p-3 bg-white/90 text-gray-800 border border-gray-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
    transition-all duration-200 hover:shadow-sm date-input
    ${touched && !date ? 'border-red-500' : ''}
  `;

    return (
        <div className="space-y-1">
            <label htmlFor="date" className="block text-sm font-semibold mb-1 text-white">
                {label}
            </label>
            <div className="relative">
                <input
                    id="date"
                    type="date"
                    className={inputStyles}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    onFocus={(e) => e.target.showPicker()}
                />
                {!date && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none md:hidden">
                        Selecciona fecha
                    </span>
                )}

            </div>
        </div>
    );
}

export default DateInput;