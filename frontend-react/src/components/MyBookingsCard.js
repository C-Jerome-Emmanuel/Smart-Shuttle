// frontend-react/src/components/MyBookingsCard.js
import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:5000/api';

const MyBookingsCard = ({ newBooking, onAuthError }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newBooking]); // Re-fetch bookings when a new one is made

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // ✅ Get latest token each time

    if (!token) {
      console.warn('No token found. User might be logged out.');
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ send JWT token
        },
      });

      if (response.status === 401 || response.status === 403) {
        console.warn('Unauthorized or invalid token.');
        localStorage.removeItem('token');
        if (onAuthError) onAuthError(); // optional callback to trigger logout
        setBookings([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]); // Clear bookings on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>My Bookings</h2>

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet. Book your seat above!</p>
      ) : (
        <div id="ticketContainer">
          {bookings.map((ticket) => (
            <div className="ticket" key={ticket._id}>
              <div className="ticket-left">
                <h3>🎟️ Shuttle Ticket</h3>
                <strong>👤 Name:</strong> {ticket.name} <br />
                <strong>📍 Destination:</strong> {ticket.destination} <br />
                <strong>🕒 Time:</strong> {ticket.time}, {ticket.date} <br />
                <strong>Status:</strong> Confirmed ✅
              </div>
              <div className="ticket-right">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                    ticket.qrData
                  )}&size=100x100`}
                  alt="QR Code"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsCard;
