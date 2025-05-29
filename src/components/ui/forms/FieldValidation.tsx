import { Check, X } from 'lucide-react';

interface ValidationRule {
    message: string;
    isValid: boolean;
}

interface FieldValidationProps {
    value: string;
    rules: ValidationRule[];
    showValidation: boolean;
}

const FieldValidation = ({ value, rules, showValidation }: FieldValidationProps) => {
    if (!showValidation || !value) return null;

    return (
        <div className="mt-2 space-y-1">
            {rules.map((rule, index) => (
                <div
                    key={index}
                    className={`flex items-center text-sm gap-2 ${
                        rule.isValid ? 'text-green-600' : 'text-gray-500'
                    }`}
                >
                    {rule.isValid ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <X className="w-4 h-4" />
                    )}
                    <span>{rule.message}</span>
                </div>
            ))}
        </div>
    );
};

export default FieldValidation; 