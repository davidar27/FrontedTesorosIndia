import { Bell, X } from "lucide-react";
import { memo } from "react";

const DropdownHeader = memo(({
    unreadCount,
    handleMarkAllAsRead,
    closeNotifications
}: {
    unreadCount: number;
    handleMarkAllAsRead: () => void;
    closeNotifications: () => void;
}) => (
    <div className="flex items-center justify-between py-6 px-4 border-b border-gray-100/60 bg-gradient-to-r from-primary/30 to-secondary/50">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/80 to-secondary rounded-xl">
                <Bell className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
                Notificaciones
            </h3>
        </div>
        {unreadCount > 0 && (
            <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-primary transition-colors px-3 py-1.5 rounded-lg border border-primary bg-white/80 cursor-pointer"
                type="button"
            >
                Marcar todas
            </button>
        )}
        <div className="flex items-center gap-3">
            <button
                onClick={closeNotifications}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors group cursor-pointer"
                aria-label="Cerrar notificaciones"
                type="button"
            >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
        </div>
    </div>
));
export default DropdownHeader;