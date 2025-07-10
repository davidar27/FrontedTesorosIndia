import { AlertCircle } from "lucide-react";



const ChangesIndicator = ({ hasChanges }: { hasChanges: () => boolean }) => (
    hasChanges() && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
                Tienes cambios sin guardar
            </span>
        </div>
    )
);

export default ChangesIndicator;