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
            className={`p-5 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/50 transition-all duration-300 cursor-pointer group ${isUnread ? "bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-l-4 border-blue-400" : ""
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-xl ${notification.status === "Vista"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                        }`}>
                        {notification.status === "Vista" ? (
                            <CheckCheck className="w-4 h-4" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-relaxed font-medium mb-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg">
                            {formatDate(notification.send_date)}
                        </span>
                        {isUnread && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                            >
                                Nuevo
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
export default NotificationItem;