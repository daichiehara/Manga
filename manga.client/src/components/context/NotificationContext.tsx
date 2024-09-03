import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { SnackbarContext } from './SnackbarContext';
import { API_BASE_URL } from '../../apiName';

export interface Notification {
    sellId: number;
    message: string;
    sellImage: string;
    updatedDateTime: string;
    type: number;
    title: string;
}

interface NotificationContextType {
    unreadCount: number;
    updateUnreadCount: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
    isLoading: boolean;
}

export const NotificationContext = createContext<NotificationContextType>({
    unreadCount: 0,
    updateUnreadCount: async () => {},
    markAllAsRead: async () => {},
    notifications: [],
    fetchNotifications: async () => {},
    isLoading: false,
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { authState } = useContext(AuthContext);
    const { showSnackbar } = useContext(SnackbarContext);

    const fetchNotifications = async () => {
        if (authState.isAuthenticated) {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/Notifications`, {
                    withCredentials: true
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const updateUnreadCount = async () => {
        if (authState.isAuthenticated) {
            try {
                const response = await axios.get(`${API_BASE_URL}/Notifications/unread-count`, {
                    withCredentials: true
                });
                const newUnreadCount = response.data;
                console.log(`new:${newUnreadCount}, old:${unreadCount}`);
                
                if (newUnreadCount !== unreadCount) {
                    setUnreadCount(newUnreadCount);
                    showSnackbar(`${newUnreadCount}件の新着通知があります。`, 'info');
                    
                    // 未読カウントが増加した場合のみ通知を再取得
                    if (newUnreadCount > unreadCount) {
                        await fetchNotifications();
                    }
                }
            } catch (error) {
                console.error('Failed to fetch unread notifications count:', error);
            }
        }
    };

    const markAllAsRead = async () => {
        if (authState.isAuthenticated) {
            try {
                await axios.post(`${API_BASE_URL}/Notifications/mark-all-as-read`, null, {
                    withCredentials: true
                });
                setUnreadCount(0);
                await fetchNotifications();
            } catch (error) {
                console.error('Failed to mark all notifications as read:', error);
            }
        }
    };

    useEffect(() => {
        if (authState.isAuthenticated) {
            const initializeNotifications = async () => {
                await fetchNotifications();
                await updateUnreadCount();
                setIsInitialized(true);
            };
            
            if (!isInitialized) {
                initializeNotifications();
            }
        }
    }, [authState.isAuthenticated, isInitialized]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (authState.isAuthenticated && isInitialized) {
            interval = setInterval(updateUnreadCount, 60000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [authState.isAuthenticated, isInitialized]);

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications, updateUnreadCount, markAllAsRead, fetchNotifications, isLoading }}>
            {children}
        </NotificationContext.Provider>
    );
};