import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsService } from '@/services/notifications/notificationsService';
import { Notification } from '@/interfaces/notification';
import { useAuth } from '@/context/AuthContext';

export const useNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Memoizar el userId para evitar re-renders innecesarios
    const userId = useMemo(() => user?.id ? Number(user.id) : null, [user?.id]);
    const shouldFetch = useMemo(() => !!userId && user?.role !== 'observador', [userId, user?.role]);

    const {
        data: notifications = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['notifications', userId],
        queryFn: () => NotificationsService.getNotifications(userId!),
        enabled: shouldFetch,
        refetchInterval: 60000,
        staleTime: 30000, // Aumentado para reducir refetch innecesarios
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false, // Cambiado a false para evitar refetch en focus
        refetchOnMount: true,
        refetchOnReconnect: true,
    });

    const markAsReadMutation = useMutation({
        mutationFn: NotificationsService.markAsRead,
        onMutate: async (notificationId: number) => {
            await queryClient.cancelQueries({ queryKey: ['notifications', userId] });

            const previousNotifications = queryClient.getQueryData(['notifications', userId]);

            queryClient.setQueryData(['notifications', userId], (old: Notification[] | undefined) => {
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
                queryClient.setQueryData(['notifications', userId], context.previousNotifications);
            }
        },
        onSettled: () => {
            // Solo invalidar si es necesario
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: NotificationsService.markAllAsRead,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['notifications', userId] });

            const previousNotifications = queryClient.getQueryData(['notifications', userId]);

            queryClient.setQueryData(['notifications', userId], (old: Notification[] | undefined) => {
                if (!old) return old;
                return old.map(notification => ({ ...notification, status: 'Vista' as const }));
            });

            return { previousNotifications };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notifications', userId], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        },
    });

    // Memoizar el conteo de no leídas para evitar recálculos
    const unreadCount = useMemo(() =>
        notifications.filter(n => n.status === 'No Vista').length,
        [notifications]
    );

    const handleMarkAsRead = useCallback((notificationId: number) => {
        markAsReadMutation.mutate(notificationId);
    }, [markAsReadMutation]);

    const handleMarkAllAsRead = useCallback(() => {
        if (userId) {
            markAllAsReadMutation.mutate(userId);
        }
    }, [markAllAsReadMutation, userId]);

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