import React, { useState, useCallback } from 'react';
import { DollarSign } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import Input from '@/components/ui/inputs/Input';

interface PriceFieldProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
}

export const PriceField: React.FC<PriceFieldProps> = ({ onChange, error }) => {
    const [displayValue, setDisplayValue] = useState('');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const number = parseInt(raw, 10);

        if (!isNaN(number)) {
            setDisplayValue(formatPrice(number));
            onChange(number);
        } else {
            setDisplayValue('');
            onChange(0);
        }
    }, [onChange]);

    return (
        <div className="space-y-3">
            <label htmlFor="price" className="block text-sm font-medium text-green-600">
                <DollarSign className="inline mr-2 h-4 w-4" />
                Precio por persona *
            </label>
            <Input
                id="price"
                value={displayValue}
                onChange={handleChange}
                placeholder="$1.000"
                inputMode="numeric"
                className='!p-2'
                min={0}
                max={10000000}

            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};