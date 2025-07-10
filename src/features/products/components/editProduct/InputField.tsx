import { AlertCircle } from "lucide-react";

const InputField = ({
    label,
    children,
    error,
    required = false
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
    required?: boolean;
}) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        )}
    </div>
);

export default InputField;