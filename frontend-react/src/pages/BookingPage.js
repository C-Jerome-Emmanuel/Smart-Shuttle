// frontend-react/src/pages/BookingPage.js
import React, { useState } from 'react';
import BookingCard from '../components/BookingCard';
import MyBookingsCard from '../components/MyBookingsCard';
import AssistantCard from '../components/AssistantCard';
import MapCard from '../components/MapCard';
import '../App.css';

const BookingPage = () => {
  const [selectedDestination, setSelectedDestination] = useState('Airport');
  const [lastBooking, setLastBooking] = useState(null); // To trigger re-render of bookings

  const handleBookingSuccess = (booking) => {
    setLastBooking(booking); // Update state to trigger MyBookingsCard re-fetch
    // You might also want to update the selectedDestination here based on the booking
    setSelectedDestination(booking.destination);
  };

  return (
    <div className="container">
      <BookingCard onBookingSuccess={handleBookingSuccess} />
      <MyBookingsCard newBooking={lastBooking} />
      <AssistantCard destination={selectedDestination} />
      <MapCard destination={selectedDestination} />
    </div>
  );
};

export default BookingPage;