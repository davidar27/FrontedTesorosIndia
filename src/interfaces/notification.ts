export interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  type: string;
  send_date: string;
  status: "Vista" | "No Vista";
}

export interface NotificationResponse {
  notifications: Notification[];
} 