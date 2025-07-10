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
        className="relative p-3 text-white transition-all duration-300 focus:outline-none rounded-full group cursor-pointer"
        aria-label="Notificaciones"
        type="button"
      >
        <Bell className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full min-w-[22px] h-5 flex items-center justify-center px-1 "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
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
            className="absolute right-0 top-14 w-96 max-h-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-100/50 z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
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

            {/* Content */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <span className="ml-3 text-gray-600 font-medium">Cargando notificaciones...</span>
                </div>
              ) : notifications.length === 0 ? (
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
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.notification_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleNotificationClick(notification.notification_id, notification.status)}
                      className={`p-5 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/50 transition-all duration-300 cursor-pointer group ${notification.status === "No Vista" ? "bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-l-4 border-blue-400" : ""
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
                            {notification.status === "No Vista" && (
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