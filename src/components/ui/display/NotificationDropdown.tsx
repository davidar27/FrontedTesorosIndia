import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import useClickOutside from "@/hooks/useClickOutside";
import { useRef, useMemo, useCallback, memo, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'right' | 'center'>('right');

  useClickOutside(dropdownRef, closeNotifications);

  // Detectar el tamaño de pantalla y ajustar el comportamiento
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // md breakpoint
      
      // Ajustar posición del dropdown en pantallas medianas
      if (width >= 768 && width < 1024) {
        setDropdownPosition('center');
      } else {
        setDropdownPosition('right');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNotificationClick = useCallback((notificationId: number, status: string) => {
    if (status === "No Vista") {
      handleMarkAsRead(notificationId);
    }
  }, [handleMarkAsRead]);

  const memoizedNotifications = useMemo(() => notifications, [notifications]);

  // Clases responsivas para el dropdown
  const getDropdownClasses = () => {
    const baseClasses = "absolute bg-white rounded-2xl shadow-2xl border border-gray-100/50 z-50 overflow-hidden backdrop-blur-xl notification-dropdown";
    
    if (isMobile) {
      return `${baseClasses} inset-4 top-16 bottom-4 max-h-[calc(100vh-8rem)]`;
    }
    
    const positionClasses = dropdownPosition === 'center' 
      ? "left-1/2 transform -translate-x-1/2 top-14 w-[calc(100vw-2rem)] max-w-md" 
      : "right-0 top-14 w-96";
    
    return `${baseClasses} ${positionClasses} max-h-[28rem]`;
  };

  // Clases responsivas para el contenido
  const getContentClasses = () => {
    if (isMobile) {
      return "max-h-[calc(100vh-12rem)] overflow-y-auto notification-scrollbar";
    }
    return "max-h-80 overflow-y-auto notification-scrollbar";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBell
        unreadCount={unreadCount}
        toggleNotifications={toggleNotifications}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              y: isMobile ? 20 : -10, 
              scale: 0.95,
              x: isMobile ? 0 : (dropdownPosition === 'center' ? '-50%' : 0)
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: isMobile ? 0 : (dropdownPosition === 'center' ? '-50%' : 0)
            }}
            exit={{ 
              opacity: 0, 
              y: isMobile ? 20 : -10, 
              scale: 0.95,
              x: isMobile ? 0 : (dropdownPosition === 'center' ? '-50%' : 0)
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={getDropdownClasses()}
          >
            <DropdownHeader
              unreadCount={unreadCount}
              handleMarkAllAsRead={handleMarkAllAsRead}
              closeNotifications={closeNotifications}
            />

            <div className={getContentClasses()}>
              {isLoading ? (
                <LoadingSpinner 
                  position="overlay" 
                  size="lg" 
                  variant="primary" 
                  speed="slow" 
                  overlayBg="bg-white/80" 
                  message="Cargando notificaciones..." 
                />
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