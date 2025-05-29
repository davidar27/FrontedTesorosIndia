import { useMemo } from 'react';

type ValidationRule = {
    test: (value: string) => boolean;
    message: string;
};

export const useFieldValidation = (value: string, rules: ValidationRule[]) => {
    const validations = useMemo(() => {
        return rules.map(rule => ({
            message: rule.message,
            isValid: rule.test(value)
        }));
    }, [value, rules]);

    const isValid = useMemo(() => {
        return validations.every(v => v.isValid);
    }, [validations]);

    return {
        validations,
        isValid
    };
};

// Reglas de validación predefinidas
export const passwordRules: ValidationRule[] = [
    {
        test: (value) => value.length >= 8,
        message: 'Al menos 8 caracteres'
    },
    {
        test: (value) => /[A-Z]/.test(value),
        message: 'Al menos una mayúscula'
    },
    {
        test: (value) => /[a-z]/.test(value),
        message: 'Al menos una minúscula'
    },
    {
        test: (value) => /[0-9]/.test(value),
        message: 'Al menos un número'
    }
];

export const emailRules: ValidationRule[] = [
    {
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Formato de correo válido'
    }
];

export const phoneRules: ValidationRule[] = [
    {
        test: (value) => /^\d{10}$/.test(value),
        message: 'Número de 10 dígitos'
    }
]; 