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
    <div className="flex items-center justify-between py-4 sm:py-6 px-3 sm:px-4 border-b border-gray-100/60 bg-gradient-to-r from-[#c6f0d5] to-[#e0f7ef]">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary/80 to-secondary rounded-lg sm:rounded-xl flex-shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Notificaciones
            </h3>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {unreadCount > 0 && (
                <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs sm:text-sm font-medium text-[#1db954] transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-[#1db954] bg-white/80 cursor-pointer hover:bg-[#1db954] hover:text-white whitespace-nowrap"
                    type="button"
                >
                    <span className="hidden sm:inline">Marcar todas</span>
                    <span className="sm:hidden">Todas</span>
                </button>
            )}
            <button
                onClick={closeNotifications}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors group cursor-pointer flex-shrink-0"
                aria-label="Cerrar notificaciones"
                type="button"
            >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
        </div>
    </div>
));

export default DropdownHeader;