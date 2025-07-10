import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsService } from '@/services/notifications/notificationsService';
import { Notification } from '@/interfaces/notification';
import { useAuth } from '@/context/AuthContext';

export const useNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const {
        data: notifications = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: () => NotificationsService.getNotifications(Number(user?.id)),
        enabled: !!user?.id && user?.role !== 'observador',
        refetchInterval: 60000, 
        staleTime: 10000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true
    });

    const markAsReadMutation = useMutation({
        mutationFn: NotificationsService.markAsRead,
        onMutate: async (notificationId: number) => {
            await queryClient.cancelQueries({ queryKey: ['notifications', user?.id] });

            const previousNotifications = queryClient.getQueryData(['notifications', user?.id]);

            queryClient.setQueryData(['notifications', user?.id], (old: Notification[] | undefined) => {
                if (!old) return old;
                return old.map(notification => 
                    notification.notification_id === notificationId 
                        ? { ...notification, status: 'Vista' as const }
                        : notification
                );
            });

            return { previousNotifications };
        },
        onError: (_err, _notificationId, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notifications', user?.id], context.previousNotifications);
            }
        },
        onSettled: () => {
            // Siempre refetch para asegurar sincronización con el servidor
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: NotificationsService.markAllAsRead,
        onMutate: async () => {
            // Cancelar queries en curso
            await queryClient.cancelQueries({ queryKey: ['notifications', user?.id] });

            // Guardar el estado anterior
            const previousNotifications = queryClient.getQueryData(['notifications', user?.id]);

            // Actualizar optimistamente todas las notificaciones como leídas
            queryClient.setQueryData(['notifications', user?.id], (old: Notification[] | undefined) => {
                if (!old) return old;
                return old.map(notification => ({ ...notification, status: 'Vista' as const }));
            });

            return { previousNotifications };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notifications', user?.id], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });

    const unreadCount = notifications.filter(n => n.status === 'No Vista').length;

    const handleMarkAsRead = useCallback((notificationId: number) => {
        markAsReadMutation.mutate(notificationId);
    }, [markAsReadMutation]);

    const handleMarkAllAsRead = useCallback(() => {
        if (user?.id) {
            markAllAsReadMutation.mutate(Number(user.id));
        }
    }, [markAllAsReadMutation, user?.id]);

    const toggleNotifications = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const closeNotifications = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        notifications,
        isLoading,
        error,
        unreadCount,
        isOpen,
        toggleNotifications,
        closeNotifications,
        handleMarkAsRead,
        handleMarkAllAsRead,
        refetch
    };
}; 