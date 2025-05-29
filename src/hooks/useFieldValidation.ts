import { useMemo } from 'react';

export interface ValidationRule {
    message: string;
    test: (value: string) => boolean;
}

export const passwordRules: ValidationRule[] = [
    {
        message: "Al menos 8 caracteres",
        test: (value) => value.length >= 8
    },
    {
        message: "Al menos una letra mayúscula",
        test: (value) => /[A-Z]/.test(value)
    },
    {
        message: "Al menos una letra minúscula",
        test: (value) => /[a-z]/.test(value)
    },
    {
        message: "Al menos un número",
        test: (value) => /\d/.test(value)
    },
    {
        message: "No debe contener espacios",
        test: (value) => !/\s/.test(value)
    }
];

export const emailRules: ValidationRule[] = [
    {
        message: "Debe ser un correo electrónico válido",
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
];

export const phoneRules: ValidationRule[] = [
    {
        message: "Debe tener 10 dígitos",
        test: (value) => /^\d{10}$/.test(value)
    }
];

export const useFieldValidation = (value: string, rules: ValidationRule[]) => {
    const validations = useMemo(() => {
        return rules.map(rule => ({
            message: rule.message,
            isValid: rule.test(value),
            test: rule.test
        }));
    }, [value, rules]);

    const isValid = useMemo(() => {
        return validations.every(v => v.isValid);
    }, [validations]);

    const pendingValidations = useMemo(() => {
        return validations.filter(v => !v.isValid);
    }, [validations]);

    const completedValidations = useMemo(() => {
        return validations.filter(v => v.isValid);
    }, [validations]);

    return {
        validations,
        isValid,
        pendingValidations,
        completedValidations
    };
}; 