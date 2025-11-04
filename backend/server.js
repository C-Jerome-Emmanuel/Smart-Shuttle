// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shuttleservice';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Booking Model ---
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  qrData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- API Endpoints ---

// Global variable for total seats (can be moved to a config file or admin panel later)
const TOTAL_SHUTTLE_SEATS = 30;

// GET /api/seats - Get total seats and current availability
app.get('/api/seats', async (req, res) => {
  try {
    const bookedSeats = await Booking.countDocuments();
    const availableSeats = TOTAL_SHUTTLE_SEATS - bookedSeats;
    res.json({ totalSeats: TOTAL_SHUTTLE_SEATS, availableSeats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seat availability', error: error.message });
  }
});

// GET /api/bookings - Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }); // Latest bookings first
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// POST /api/bookings - Create a new booking
app.post('/api/bookings', async (req, res) => {
  const { name, destination, date, time, qrData } = req.body;

  if (!name || !destination || !date || !time || !qrData) {
    return res.status(400).json({ message: 'All fields are required for booking.' });
  }

  try {
    // Check if the user has already booked
    const existingBooking = await Booking.findOne({ name: new RegExp(`^${name}$`, 'i') }); // Case-insensitive
    if (existingBooking) {
      return res.status(409).json({ message: 'You have already booked a seat! Only one ticket per person is allowed.' });
    }

    // Check if seats are available
    const bookedSeatsCount = await Booking.countDocuments();
    if (bookedSeatsCount >= TOTAL_SHUTTLE_SEATS) {
      return res.status(400).json({ message: 'No more seats available! Shuttle is fully booked.' });
    }

    const newBooking = new Booking({
      name,
      destination,
      date,
      time,
      qrData
    });

    await newBooking.save();
    res.status(201).json(newBooking); // Respond with the created booking
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// DELETE /api/bookings/:id - Cancel a booking (optional, but good practice)
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json({ message: 'Booking cancelled successfully.', booking: deletedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access backend at http://localhost:${PORT}`);
});