import { memo } from "react";
import NotificationItem from "@/components/ui/display/Notification/NotificationItem";
import { Notification } from "@/interfaces/notification";

const NotificationsList = memo(({
    notifications,
    onNotificationClick
}: {
    notifications: Notification[];
    onNotificationClick: (id: number, status: string) => void;
}) => {
    // Si hay menos de 10 notificaciones, usar renderizado normal
    // Si hay más, considerar virtualización (implementación futura)
    const shouldVirtualize = notifications.length > 10;

    if (shouldVirtualize) {
        // Por ahora, limitar a mostrar solo las primeras 20 notificaciones
        // En el futuro se puede implementar react-window para virtualización completa
        const limitedNotifications = notifications.slice(0, 20);

        return (
            <div className="divide-y divide-gray-50">
                {limitedNotifications.map((notification) => (
                    <NotificationItem
                        key={notification.notification_id}
                        notification={notification}
                        onNotificationClick={onNotificationClick}
                    />
                ))}
                {notifications.length > 20 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        Mostrando las 20 notificaciones más recientes de {notifications.length}
                    </div>
                )}
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