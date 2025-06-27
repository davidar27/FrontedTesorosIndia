import React, { useState, useCallback } from 'react';
import { DollarSign } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';

interface PriceFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const PriceField: React.FC<PriceFieldProps> = ({ onChange, error }) => {
    const [displayValue, setDisplayValue] = useState('');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const number = parseInt(raw, 10);

        if (!isNaN(number)) {
            setDisplayValue(formatPrice(number));
            onChange(number.toString());
        } else {
            setDisplayValue('');
            onChange('');
        }
    }, [onChange]);

    return (
        <div className="space-y-3">
            <label htmlFor="price" className="block text-sm font-medium text-green-600">
                <DollarSign className="inline mr-2 h-4 w-4" />
                Precio por persona *
            </label>
            <input
                id="price"
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder="$1.000"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};