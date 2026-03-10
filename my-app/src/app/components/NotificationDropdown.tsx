"use client";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import styles from "./Navbar.module.css";

interface Notification {
  _id: string;
  customerName: string;
  accommodationName: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  message?: string;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [hasNew, setHasNew] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("http://localhost:2000/api/notifications");
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched notifications:", data);
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
    setHasNew(false);
  };

  return (
    <div className={styles.notificationDropdownWrapper} ref={dropdownRef}>
      <button 
        onClick={handleBellClick} 
        aria-label="Notifications" 
        className={styles.bellButton}
      >
        <FaBell className={styles.bellIcon} />
        {hasNew && (
          <span className={styles.newNotificationDot}></span>
        )}
      </button>
      {open && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>Notifications</div>
          {notifications.length === 0 ? (
            <div className={styles.noNotifications}>No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={styles.notificationDropdownItem}>
                <div className={styles.notificationTitle}>
                  {(n.customerName || n.message || "Unknown")} booked {(n.accommodationName || "Unknown")}
                </div>
                <div className={styles.notificationDates}>
                  {n.checkInDate && n.checkOutDate
                    ? `${new Date(n.checkInDate).toLocaleDateString()} - ${new Date(
                        n.checkOutDate
                      ).toLocaleDateString()}`
                    : ""}
                </div>
                <div className={styles.notificationTimestamp}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;