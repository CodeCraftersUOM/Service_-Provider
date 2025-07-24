"use client";
import { useState, useEffect, useCallback } from "react";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./NotificationPanel.module.css";

interface Notification {
  id: string;
  type: "new_booking" | "booking_confirmed" | "booking_rejected" | "booking_cancelled";
  title: string;
  message: string;
  bookingId: string;
  read: boolean;
  timestamp: string;
  data?: {
    booking?: unknown;
    accommodation?: unknown;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

interface NotificationPanelProps {
  apiBaseUrl?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  apiBaseUrl = "http://localhost:2000/api",
  autoRefresh = true,
  refreshInterval = 30000
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [notificationStats, setNotificationStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0
  });
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      console.log("Fetching notifications from:", `${apiBaseUrl}/notifications`);
      const response = await fetch(`${apiBaseUrl}/notifications`);
      console.log("Notification response status:", response.status);
      const data = await response.json();
      console.log("Notification response data:", data);
      
      if (response.ok && data.success) {
        setNotifications(data.data);
        const unread = data.data.filter((notif: Notification) => !notif.read).length;
        setUnreadCount(unread);
        console.log("Notifications set:", data.data.length, "Unread:", unread);
      } else {
        console.error("Failed to fetch notifications:", data.error);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [apiBaseUrl]);

  const fetchNotificationStats = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/notifications/stats`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setNotificationStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching notification stats:", err);
    }
  }, [apiBaseUrl]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        fetchNotificationStats();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    
    setShowNotifications(false);
    
    if (notification.type === "new_booking" || 
        notification.type === "booking_confirmed" || 
        notification.type === "booking_rejected" || 
        notification.type === "booking_cancelled") {
      router.push("/Bookings");
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(notif => !notif.read);
    
    if (unreadNotifications.length === 0) return;
    
    try {
      const promises = unreadNotifications.map(notification =>
        fetch(`${apiBaseUrl}/notifications/${notification.id}/read`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      
      await Promise.all(promises);
      
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
      await fetchNotificationStats();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
      await fetchNotificationStats();
    };
    
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [apiBaseUrl, autoRefresh, refreshInterval, fetchNotifications, fetchNotificationStats]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_booking":
        return "📋";
      case "booking_confirmed":
        return "✅";
      case "booking_rejected":
        return "❌";
      case "booking_cancelled":
        return "🚫";
      default:
        return "🔔";
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(notif => !notif.read);
      case 'read':
        return notifications.filter(notif => notif.read);
      default:
        return notifications;
    }
  };

  return (
    <div className={styles.notificationWrapper}>
      <button
        className={styles.notificationIconBtn}
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <FaBell className={styles.bellIcon} />
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}></span>
        )}
      </button>
      
      {showNotifications && (
        <div className={styles.notificationDropdown}>
          <div className={styles.notificationHeader}>
            <h3>Notifications</h3>
            <div className={styles.headerActions}>
              {unreadCount > 0 && (
                <button 
                  className={styles.markAllBtn}
                  onClick={markAllAsRead}
                >
                  Mark All Read
                </button>
              )}
              <button 
                className={styles.closeBtn}
                onClick={() => setShowNotifications(false)}
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className={styles.notificationTabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({notificationStats.total})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'unread' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread ({notificationStats.unread})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'read' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('read')}
            >
              Read ({notificationStats.read})
            </button>
          </div>
          
          <div className={styles.notificationList}>
            {getFilteredNotifications().length === 0 ? (
              <p className={styles.noNotifications}>
                {activeTab === 'unread' ? 'No unread notifications' : 
                 activeTab === 'read' ? 'No read notifications' : 
                 'No notifications yet'}
              </p>
            ) : (
              getFilteredNotifications().slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.read ? styles.unread : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view booking details"
                >
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className={styles.notificationText}>
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <small>
                        {new Date(notification.timestamp).toLocaleString()}
                      </small>
                      {(notification.type === "new_booking" || 
                        notification.type === "booking_confirmed" || 
                        notification.type === "booking_rejected" || 
                        notification.type === "booking_cancelled") && (
                        <div className={styles.clickHint}>
                          <small>📋 Click to view bookings</small>
                        </div>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className={styles.unreadDot}></div>
                  )}
                  {(notification.type === "new_booking" || 
                    notification.type === "booking_confirmed" || 
                    notification.type === "booking_rejected" || 
                    notification.type === "booking_cancelled") && (
                    <div className={styles.navigationArrow}>→</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;