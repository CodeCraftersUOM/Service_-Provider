"use client";
// pages/provider/bookings.tsx
import { useEffect, useState } from "react";
// src/app/Bookings/bookings.tsx
import styles from "./BookingDashboard.module.css"; // Corrected path based on your file structure
interface Booking {
  _id: string;
  accommodationId: string;
  accommodationName: string;
  customerName: string;
  customerEmail: string;
  checkInDate: string; // ISO string or similar
  checkOutDate: string; // ISO string or similar
  numberOfGuests: number;
  roomType: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

const SERVICE_PROVIDER_ID = "your_provider_id_here"; // TODO: Replace with dynamic provider ID from authentication

const BookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Base URL for your Node.js backend API
  const API_BASE_URL = "http://localhost:2000/api"; // Ensure this matches your Node.js server URL

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch bookings for a specific provider.
      // In a real app, 'your_provider_id_here' would come from authenticated user context.
      const response = await fetch(
        `${API_BASE_URL}/provider/bookings/${SERVICE_PROVIDER_ID}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        // Filter for only 'pending' bookings to display on this dashboard
        setBookings(
          data.data.filter((booking: Booking) => booking.status === "pending")
        );
      } else {
        setError(data.error || "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to connect to the server or fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: "confirmed" | "rejected"
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the updated booking from the list or update its status locally
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        alert(`Booking ${bookingId} ${newStatus}!`);
      } else {
        alert(
          `Failed to update booking status: ${data.error || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to connect to the server or update booking status.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Error: {error}</p>
        <button onClick={fetchBookings} className={styles.button}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Service Provider Dashboard</h1>
          <p className={styles.subtitle}>Manage Pending Bookings</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className={styles.noBookings}>No pending bookings found. 🎉</p>
      ) : (
        <div className={styles.bookingList}>
          {bookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <h2 className={styles.cardTitle}>{booking.accommodationName}</h2>
              <p>
                <strong>Customer:</strong> {booking.customerName} (
                {booking.customerEmail})
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Guests:</strong> {booking.numberOfGuests}
              </p>
              <p>
                <strong>Room Type:</strong> {booking.roomType}
              </p>
              <p>
                <strong>Total Price:</strong> LKR{" "}
                {booking.totalPrice.toLocaleString()}
              </p>
              <p>
                <strong>Booked On:</strong>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
              <p className={styles.cardStatus}>
                Status:{" "}
                <span
                  className={
                    booking.status === "pending" ? styles.statusPending : ""
                  }
                >
                  {booking.status.toUpperCase()}
                </span>
              </p>

              <div className={styles.actions}>
                <button
                  className={`${styles.button} ${styles.confirmButton}`}
                  onClick={() => updateBookingStatus(booking._id, "confirmed")}
                >
                  Confirm
                </button>
                <button
                  className={`${styles.button} ${styles.rejectButton}`}
                  onClick={() => updateBookingStatus(booking._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;
