// frontend-react/src/components/MyBookingsCard.js
import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend

const MyBookingsCard = ({ newBooking }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [newBooking]); // Re-fetch bookings when a new one is made

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // Clear bookings on error
    }
  };

  return (
    <div className="card">
      <h2>My Bookings</h2>
      <div id="ticketContainer">
        {bookings.length === 0 ? (
          <p>No bookings yet. Book your seat above!</p>
        ) : (
          bookings.map(ticket => (
            <div className="ticket" key={ticket._id}> {/* Use MongoDB _id as key */}
              <div className="ticket-left">
                <h3>🎟️ Shuttle Ticket</h3>
                <strong>👤 Name:</strong> {ticket.name}<br />
                <strong>📍 Destination:</strong> {ticket.destination}<br />
                <strong>🕒 Time:</strong> {ticket.time}, {ticket.date}<br />
                <strong>Status:</strong> Confirmed ✅
              </div>
              <div className="ticket-right">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(ticket.qrData)}&size=100x100`} alt="QR Code" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookingsCard;