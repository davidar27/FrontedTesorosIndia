import { useState, useEffect, useCallback } from 'react';
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
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
    });

    const markAsReadMutation = useMutation({
        mutationFn: NotificationsService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: NotificationsService.markAllAsRead,
        onSuccess: () => {
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