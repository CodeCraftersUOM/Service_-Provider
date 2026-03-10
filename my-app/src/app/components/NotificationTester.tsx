"use client";
import { useState } from "react";

const NotificationTester: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const API_BASE_URL = "http://localhost:2000/api";

  const testNotificationEndpoints = async () => {
    setLoading(true);
    setResult("Testing notification endpoints...\n\n");
    
    try {
      // Test 1: Get all notifications
      setResult(prev => prev + "1. Testing GET /api/notifications\n");
      const allNotifications = await fetch(`${API_BASE_URL}/notifications`);
      const allData = await allNotifications.json();
      setResult(prev => prev + `   Status: ${allNotifications.status}\n   Response: ${JSON.stringify(allData, null, 2)}\n\n`);

      // Test 2: Get unread notifications
      setResult(prev => prev + "2. Testing GET /api/notifications/unread\n");
      const unreadNotifications = await fetch(`${API_BASE_URL}/notifications/unread`);
      const unreadData = await unreadNotifications.json();
      setResult(prev => prev + `   Status: ${unreadNotifications.status}\n   Response: ${JSON.stringify(unreadData, null, 2)}\n\n`);

      // Test 3: Get notification stats
      setResult(prev => prev + "3. Testing GET /api/notifications/stats\n");
      const statsResponse = await fetch(`${API_BASE_URL}/notifications/stats`);
      const statsData = await statsResponse.json();
      setResult(prev => prev + `   Status: ${statsResponse.status}\n   Response: ${JSON.stringify(statsData, null, 2)}\n\n`);

      // Test 4: Create a test booking to trigger notification
      setResult(prev => prev + "4. Creating a test booking to trigger notification\n");
      const testBooking = {
        accommodationId: "68359c350d63ab63f4eb981c", // Use real accommodation ID from your data
        accommodationName: "Test Hotel",
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(Date.now() + 86400000).toISOString(),
        numberOfGuests: 2,
        roomType: "Standard",
        pricePerNight: 50,
        totalPrice: 100
      };
      
      const bookingResponse = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testBooking),
      });
      const bookingData = await bookingResponse.json();
      setResult(prev => prev + `   Status: ${bookingResponse.status}\n   Response: ${JSON.stringify(bookingData, null, 2)}\n\n`);

      setResult(prev => prev + "✅ All tests completed! Check your notification dashboard for new notifications.");
      
    } catch (error) {
      setResult(prev => prev + `❌ Error during testing: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🔔 Notification System Tester</h2>
      <p>This component helps you test your notification system endpoints.</p>
      
      <button 
        onClick={testNotificationEndpoints}
        disabled={loading}
        style={{
          backgroundColor: "#4A90E2",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          marginBottom: "20px"
        }}
      >
        {loading ? "Testing..." : "🧪 Test Notification Endpoints"}
      </button>

      {result && (
        <div style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "14px",
          maxHeight: "500px",
          overflowY: "auto"
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#e8f4fd", borderRadius: "8px" }}>
        <h3>📋 Available Notification Endpoints:</h3>
        <ul style={{ margin: 0 }}>
          <li><code>GET /api/notifications</code> - Get all notifications</li>
          <li><code>GET /api/notifications/unread</code> - Get unread notifications only</li>
          <li><code>PUT /api/notifications/:id/read</code> - Mark notification as read</li>
          <li><code>GET /api/notifications/stats</code> - Get notification statistics</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
        <h3>🎯 How to Test:</h3>
        <ol style={{ margin: 0 }}>
          <li>Make sure your backend server is running on localhost:2000</li>
          <li>Click the "Test Notification Endpoints" button above</li>
          <li>Check the results to see if endpoints are working</li>
          <li>Go to your booking dashboard to see notifications in action</li>
          <li>Create bookings and update their status to trigger new notifications</li>
        </ol>
      </div>
    </div>
  );
};

export default NotificationTester;
