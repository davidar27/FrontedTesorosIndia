import { Check, X } from 'lucide-react';

interface FieldValidationProps {
    validations: {
        message: string;
        isValid: boolean;
    }[];
    showValidation?: boolean;
}

const FieldValidation = ({ validations, showValidation = false }: FieldValidationProps) => {
    if (!showValidation) return null;

    return (
        <div className="mt-2 space-y-1">
            {validations.map((validation, index) => (
                <div
                    key={index}
                    className={`flex items-center space-x-2 text-sm ${
                        validation.isValid ? 'text-green-600' : 'text-gray-500'
                    }`}
                >
                    {validation.isValid ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span>{validation.message}</span>
                </div>
            ))}
        </div>
    );
};

export default FieldValidation; 