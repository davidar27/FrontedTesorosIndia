import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, X, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import useClickOutside from "@/hooks/useClickOutside";
import { useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const NotificationDropdown = () => {
  const {
    notifications,
    isLoading,
    unreadCount,
    isOpen,
    toggleNotifications,
    closeNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, closeNotifications);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch {
      return "Fecha desconocida";
    }
  };

  const handleNotificationClick = (notificationId: number, status: string) => {
    if (status === "No Vista") {
      handleMarkAsRead(notificationId);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full"
        aria-label="Notificaciones"
        type="button"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-12 w-80 max-h-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificaciones
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    type="button"
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button
                  onClick={closeNotifications}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar notificaciones"
                  type="button"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Cargando notificaciones...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">
                    No tienes notificaciones
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.notification_id}
                      onClick={() => handleNotificationClick(notification.notification_id, notification.status)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.status === "No Vista" ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {notification.status === "Vista" ? (
                            <CheckCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.send_date)}
                            </span>
                            {notification.status === "No Vista" && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Nuevo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown; 