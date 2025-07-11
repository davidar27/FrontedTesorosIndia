import { Bell } from "lucide-react";
import { memo } from "react";

const EmptyState = memo(() => (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 text-center">
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <Bell className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300" />
        </div>
        <p className="text-gray-500 text-base sm:text-lg font-medium mb-1 sm:mb-2">
            No hay notificaciones
        </p>
        <p className="text-gray-400 text-xs sm:text-sm px-2">
            Cuando recibas notificaciones aparecerán aquí
        </p>
    </div>
));

export default EmptyState;