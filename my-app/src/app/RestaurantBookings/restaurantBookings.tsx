'use client';
import React, { useEffect, useState } from 'react';
import './restaurantBooking.css'; // Assuming you have a CSS file for styles

type Booking = {
  _id: string;
  restaurantId: string;
  restaurantName: string;
  bookingDateTime: string;
  numberOfGuests: number;
  tableType: string;
  specialRequest: string;
  customerName: string;
  customerEmail: string;
  status: string; // e.g., 'pending', 'confirmed', 'rejected'
  createdAt: string;
  updatedAt: string;
};

// Define a type for the structure you're receiving from the server
type BookingsListResponse = {
  bookings: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    limit: number;
  };
};

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2000');
    setWs(socket);

    socket.onopen = () => {
      console.log('✅ Connected to WebSocket server');
      // Request initial list of bookings when connected
      socket.send(JSON.stringify({ type: 'get_bookings' }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message); // Log all incoming messages for debugging

      switch (message.type) {
        case 'bookings_list':
          const data = message.data as BookingsListResponse;
          if (data && Array.isArray(data.bookings)) {
            // Sort bookings to show pending ones first, then by date
            const sortedBookings = [...data.bookings].sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(a.bookingDateTime).getTime() - new Date(b.bookingDateTime).getTime();
            });
            setBookings(sortedBookings);
          } else {
            console.error('Expected data.bookings to be an array but got:', data);
          }
          break;

        case 'booking_received':
        case 'booking_status_update':
          const updatedBooking = message.data as Booking; // Type assertion
          setBookings((prev) => {
            // Find if the booking already exists and replace it, otherwise add it
            const existingIndex = prev.findIndex((b) => b._id === updatedBooking._id);
            if (existingIndex > -1) {
              const newBookings = [...prev];
              newBookings[existingIndex] = updatedBooking;
              return newBookings;
            } else {
              // Add new booking if it doesn't exist (e.g., from 'booking_received')
              return [...prev, updatedBooking];
            }
          });
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    };

    socket.onclose = () => {
      console.log('❌ WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  // Function to handle status updates (Confirm/Reject)
  const handleUpdateStatus = (bookingId: string, newStatus: 'confirmed' | 'rejected') => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'update_booking_status', // This should match what your backend expects
        data: {
          bookingId: bookingId,
          status: newStatus,
        },
      }));
      console.log(`Sent request to update booking ${bookingId} to ${newStatus}`);
    } else {
      console.error('WebSocket not connected or not ready.');
      // Optionally, show a user-friendly alert here
      alert('Cannot connect to the server. Please refresh the page.');
    }
  };

  return (
  <div className="container">
    <div className="formWrapper">
      <h1 className="register-title">📅 Restaurant Bookings</h1>
      {bookings.length === 0 ? (
        <p className="no-bookings-text">No bookings received yet.</p>
      ) : (
        <div className="tabledata">
          <table className="custom-table">
            <thead>
              <tr className="table-header">
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="table-row">
                  <td>{booking.customerName}</td>
                  <td>{booking.restaurantName}</td>
                  <td>{new Date(booking.bookingDateTime).toLocaleString()}</td>
                  <td>{booking.numberOfGuests}</td>
                  <td>{booking.tableType}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'pending' ? (
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="status-actioned">Actioned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

}