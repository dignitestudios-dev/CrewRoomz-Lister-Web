// src/store/useNotificationStore.ts
import { create } from "zustand";

import { onMessageListener } from "../firebase/messages";
import type { MessagePayload } from "firebase/messaging";

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  data?: Record<string, string>;
}

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  addNotification: (payload: MessagePayload) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  initForegroundListener: () => () => void; // returns cleanup
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  notifications: [],

  addNotification: (payload: MessagePayload) => {
    const notification = payload.notification;
    const data = payload.data;

    if (!notification) return;

    const newNotif: Notification = {
      id: payload.messageId || `${Date.now()}`,
      title: notification.title || "New Message",
      body: notification.body || "",
      timestamp: Date.now(),
      read: false,
      data: data as Record<string, string>,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  initForegroundListener: () => {
    let isActive = true;

    const startListening = async () => {
      while (isActive) {
        try {
          const payload = await onMessageListener();
          if (isActive) {
            get().addNotification(payload);
          }
        } catch (error) {
          console.error("Error in onMessage listener:", error);
        }
      }
    };

    startListening();

    // Return cleanup
    return () => {
      isActive = false;
    };
  },
}));
