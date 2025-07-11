import { memo, useState, useEffect } from "react";
import NotificationItem from "@/components/ui/display/Notification/NotificationItem";
import { Notification } from "@/interfaces/notification";

const NotificationsList = memo(({
    notifications,
    onNotificationClick
}: {
    notifications: Notification[];
    onNotificationClick: (id: number, status: string) => void;
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Ajustar límite de notificaciones según el tamaño de pantalla
    const getNotificationLimit = () => {
        if (isMobile) return 10;
        if (isTablet) return 15;
        return 20;
    };

    const limit = getNotificationLimit();
    const shouldLimit = notifications.length > limit;

    if (shouldLimit) {
        const limitedNotifications = notifications.slice(0, limit);

        return (
            <div className="divide-y divide-gray-50">
                {limitedNotifications.map((notification) => (
                    <NotificationItem
                        key={notification.notification_id}
                        notification={notification}
                        onNotificationClick={onNotificationClick}
                    />
                ))}
                <div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm bg-gray-50/50">
                    Mostrando las {limit} notificaciones más recientes de {notifications.length}
                </div>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.notification_id}
                    notification={notification}
                    onNotificationClick={onNotificationClick}
                />
            ))}
        </div>
    );
});

export default NotificationsList;