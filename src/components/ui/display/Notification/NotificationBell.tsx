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
        className="relative p-3 text-white transition-all duration-300 focus:outline-none rounded-full group cursor-pointer"
        aria-label="Notificaciones"
        type="button"
    >
        <Bell className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        {unreadCount > 0 && (
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full min-w-[22px] h-5 flex items-center justify-center px-1"
            >
                {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
        )}
    </button>
));
export default NotificationBell;