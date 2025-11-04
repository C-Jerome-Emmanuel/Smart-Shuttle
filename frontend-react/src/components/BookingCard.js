// frontend-react/src/components/BookingCard.js
import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend

const BookingCard = ({ onBookingSuccess }) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('Airport');
  const [availability, setAvailability] = useState('');
  const [isBooked, setIsBooked] = useState(false); // New state to track if current user booked

  useEffect(() => {
    fetchAvailability();
  }, [isBooked]); // Re-fetch availability when a booking is made or cancelled

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/seats`);
      const data = await response.json();
      const msg = data.availableSeats > 0 ? `${data.availableSeats} seat(s) remaining` : "Shuttle is fully booked!";
      setAvailability(msg);
      // You can also pass the available count back if needed, e.g., onBookingSuccess(data.availableSeats);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailability("Error fetching seat data.");
    }
  };

  const bookSeat = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const bookingData = {
      name: name.trim(),
      destination,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      qrData: `Name: ${name.trim()}\nDestination: ${destination}\nStatus: Confirmed ✅`
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle backend errors (e.g., already booked, no seats)
        alert(`Booking failed: ${result.message}`);
        return;
      }

      alert("Seat booked successfully!");
      setName(''); // Clear name input
      setIsBooked(true); // Trigger re-fetch of availability and bookings
      if(onBookingSuccess) onBookingSuccess(result); // Notify parent component
    } catch (error) {
      console.error("Error booking seat:", error);
      alert("An error occurred while booking. Please try again.");
    }
  };

  return (
    <div className="card">
      <h2>Shuttle Seat Booking</h2>
      <input
        type="text"
        id="name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        id="destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        <option value="Airport">Airport</option>
        <option value="Metro Station">Metro Station</option>
        <option value="Kelambakkam Bus Stand">Kelambakkam Bus Stand</option>
        <option value="Tambaram">Tambaram</option>
        <option value="Vandalur">Vandalur</option>
      </select>
      <button onClick={bookSeat}>Get My Seat</button>
      <p id="availability" style={{ color: availability.includes('remaining') ? 'green' : 'red' }}>
        {availability}
      </p>
    </div>
  );
};

export default BookingCard;