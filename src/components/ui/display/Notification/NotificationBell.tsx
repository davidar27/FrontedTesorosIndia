import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

const NotificationBell = memo(({
    unreadCount,
    toggleNotifications
}: {
    unreadCount: number;
    toggleNotifications: () => void;
}) => (
    <button
        onClick={toggleNotifications}
        className="relative p-2 sm:p-3 text-white transition-all duration-300 focus:outline-none rounded-full group cursor-pointer hover:bg-white/10 active:scale-95"
        aria-label="Notificaciones"
        type="button"
    >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
        {unreadCount > 0 && (
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-5 flex items-center justify-center px-0.5 sm:px-1 text-[10px] sm:text-xs font-medium"
            >
                {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
        )}
    </button>
));

export default NotificationBell;