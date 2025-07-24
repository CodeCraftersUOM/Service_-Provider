"use client";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
// ...existing imports...
import styles from "./Navbar.module.css";

interface Notification {
  _id: string;
  customerName: string;
  accommodationName: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
}

// Removed SOCKET_URL and socket.io-client

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  // Removed socketRef, no socket.io
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from backend API
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
        // Optionally handle error
      }
    }
    fetchNotifications();
  }, []);

  // Removed socket.io useEffect

  // Close dropdown on outside click
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
    <div className={styles.iconButton} style={{ position: "relative" }} ref={dropdownRef}>
      <button onClick={handleBellClick} aria-label="Notifications" style={{ position: "relative" }}>
        <FaBell />
        {hasNew && <span style={{position: "absolute", top: 2, right: 2, width: 10, height: 10, background: "#ff3b3b", borderRadius: "50%", display: "inline-block", border: "2px solid #fff"}}></span>}
      </button>
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "120%",
          minWidth: 320,
          background: "#fff",
          color: "#222",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          zIndex: 1000,
          padding: 12,
          maxHeight: 400,
          overflowY: "auto"
        }}>
          <div style={{fontWeight: 700, fontSize: 16, marginBottom: 8}}>Notifications</div>
          {notifications.length === 0 ? (
            <div style={{color: "#888", fontSize: 14, padding: 12}}>No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} style={{borderBottom: "1px solid #eee", padding: "8px 0"}}>
                <div style={{fontWeight: 600}}>
                  {(n.customerName || n.message || 'Unknown')} booked {(n.accommodationName || 'Unknown')}
                </div>
                <div style={{fontSize: 13, color: "#555"}}>
                  {n.checkInDate && n.checkOutDate
                    ? `${new Date(n.checkInDate).toLocaleDateString()} - ${new Date(n.checkOutDate).toLocaleDateString()}`
                    : ''}
                </div>
                <div style={{fontSize: 12, color: "#aaa"}}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
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
