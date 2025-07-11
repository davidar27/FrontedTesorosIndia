import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";
import { memo, useCallback } from "react";
import { Notification } from "@/interfaces/notification";
import { motion } from "framer-motion";

const NotificationItem = memo(({
    notification,
    onNotificationClick
}: {
    notification: Notification;
    onNotificationClick: (id: number, status: string) => void;
}) => {
    const formatDate = useCallback((dateString: string) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true, locale: es });
        } catch {
            return "Fecha desconocida";
        }
    }, []);

    const handleClick = useCallback(() => {
        onNotificationClick(notification.notification_id, notification.status);
    }, [notification.notification_id, notification.status, onNotificationClick]);

    const isUnread = notification.status === "No Vista";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleClick}
            className={`p-3 sm:p-4 md:p-5 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/50 transition-all duration-300 cursor-pointer group active:scale-[0.98] ${
                isUnread ? "bg-gradient-to-r from-[#e6f0fd] to-[#e6f0fd] border-l-4 border-[#3b82f6]" : ""
            }`}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${
                        notification.status === "Vista"
                            ? "bg-[#e6f9ed] text-[#1db954]"
                            : "bg-[#e6f0fd] text-[#3b82f6]"
                    }`}>
                        {notification.status === "Vista" ? (
                            <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 leading-relaxed font-medium mb-1.5 sm:mb-2 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg whitespace-nowrap">
                            {formatDate(notification.send_date)}
                        </span>
                        {isUnread && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white shadow-md flex-shrink-0"
                            >
                                <span className="hidden sm:inline">Nuevo</span>
                                <span className="sm:hidden">N</span>
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default NotificationItem;