import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import useClickOutside from "@/hooks/useClickOutside";
import { useRef, useMemo, useCallback, memo } from "react";
import NotificationBell from "@/components/ui/display/Notification/NotificationBell";
import DropdownHeader from "@/components/ui/display/Notification/DropdownHeader";
import LoadingSpinner from "@/components/ui/display/LoadingSpinner";
import EmptyState from "@/components/ui/display/Notification/EmptyState";
import NotificationsList from "@/components/ui/display/Notification/NotificationsList";


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

  const handleNotificationClick = useCallback((notificationId: number, status: string) => {
    if (status === "No Vista") {
      handleMarkAsRead(notificationId);
    }
  }, [handleMarkAsRead]);

  const memoizedNotifications = useMemo(() => notifications, [notifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBell
        unreadCount={unreadCount}
        toggleNotifications={toggleNotifications}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-14 w-96 max-h-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-100/50 z-50 overflow-hidden backdrop-blur-xl"
          >
            <DropdownHeader
              unreadCount={unreadCount}
              handleMarkAllAsRead={handleMarkAllAsRead}
              closeNotifications={closeNotifications}
            />

            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {isLoading ? (
                <LoadingSpinner position="overlay" size="lg" variant="primary" speed="slow" overlayBg="bg-white/80" message="Cargando notificaciones..." />
              ) : memoizedNotifications.length === 0 ? (
                <EmptyState />
              ) : (
                <NotificationsList
                  notifications={memoizedNotifications}
                  onNotificationClick={handleNotificationClick}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(NotificationDropdown);