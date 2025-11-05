// frontend-react/src/components/BookingCard.js
import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:5000/api';

const BookingCard = ({ onBookingSuccess }) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('Airport');
  const [availability, setAvailability] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  // Fetch seat availability
  useEffect(() => {
    fetchAvailability();
  }, [isBooked]);

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats`);
      const data = await res.json();
      const msg =
        data.availableSeats > 0
          ? `${data.availableSeats} seat(s) remaining`
          : 'Shuttle is fully booked!';
      setAvailability(msg);
    } catch (err) {
      console.error('Error fetching seats:', err);
      setAvailability('Error fetching seat data');
    }
  };

  const bookSeat = async () => {
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ Please log in again.');
      window.location.href = '/login';
      return;
    }

    const bookingData = {
      name: name.trim(),
      destination,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      qrData: `Name: ${name.trim()}\nDestination: ${destination}\nStatus: Confirmed ✅`,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error(result.message || 'Booking failed.');
      }

      alert('🎉 Seat booked successfully!');
      setName('');
      setIsBooked(true);
      if (onBookingSuccess) onBookingSuccess(result);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Only one ticket per user is allowed per day!!.');
    }
  };

  return (
    <div className="card">
      <h2>🚌 Shuttle Seat Booking</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        <option value="Airport">Airport</option>
        <option value="Metro Station">Metro Station</option>
        <option value="Kelambakkam Bus Stand">Kelambakkam Bus Stand</option>
        <option value="Tambaram">Tambaram</option>
        <option value="Vandalur">Vandalur</option>
      </select>

      <button onClick={bookSeat}>Book My Seat</button>

      <p
        style={{
          color: availability.includes('remaining') ? 'green' : 'red',
          marginTop: '10px',
        }}
      >
        {availability}
      </p>
    </div>
  );
};

export default BookingCard;
