import { axiosInstance } from "@/api/axiosInstance";
import { Notification } from "@/interfaces/notification";

export const NotificationsService = {
    getNotifications: async (userId: number): Promise<Notification[]> => {
        const response = await axiosInstance.get(`/notificaciones/${userId}`);
        return response.data;
    },

    markAsRead: async (notificationId: number): Promise<void> => {
        await axiosInstance.put(`/notificaciones/${notificationId}/read`);
    },

    markAllAsRead: async (userId: number): Promise<void> => {
        await axiosInstance.patch(`/notificaciones/${userId}/marcar`);
    }
}; 