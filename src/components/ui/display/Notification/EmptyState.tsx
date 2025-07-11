import { Bell } from "lucide-react";
import { memo } from "react";

const EmptyState = memo(() => (
    <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-gray-50 rounded-2xl mb-4">
            <Bell className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-gray-500 text-lg font-medium mb-2">
            No hay notificaciones
        </p>
        <p className="text-gray-400 text-sm">
            Cuando recibas notificaciones aparecerán aquí
        </p>
    </div>
));
export default EmptyState;