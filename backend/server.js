// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shuttleservice';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- JWT Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in again.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user; // { id, email, name }
    next();
  });
};

// --- Booking Model ---
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  qrData: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- Constants ---
const TOTAL_SHUTTLE_SEATS = 30;

// --- ROUTES ---

// ✅ GET /api/seats — Total and available seats
app.get('/api/seats', async (req, res) => {
  try {
    const bookedSeats = await Booking.countDocuments();
    const availableSeats = TOTAL_SHUTTLE_SEATS - bookedSeats;
    res.json({ totalSeats: TOTAL_SHUTTLE_SEATS, availableSeats });
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    res.status(500).json({ message: 'Error fetching seat availability', error: error.message });
  }
});

// ✅ GET /api/bookings — Fetch bookings for logged-in user
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// ✅ POST /api/bookings — Create a booking for logged-in user
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { name, destination, date, time, qrData } = req.body;

  if (!name || !destination || !date || !time || !qrData) {
    return res.status(400).json({ message: 'All fields are required for booking.' });
  }

  try {
    // Check if this user already has a booking
    const existingBooking = await Booking.findOne({ userId: req.user.id });
    if (existingBooking) {
      return res.status(409).json({
        message: 'You already have an active booking! Only one ticket per user is allowed.',
      });
    }

    // Check seat availability
    const bookedSeatsCount = await Booking.countDocuments();
    if (bookedSeatsCount >= TOTAL_SHUTTLE_SEATS) {
      return res.status(400).json({ message: 'No seats available! Shuttle is fully booked.' });
    }

    const newBooking = new Booking({
      name,
      destination,
      date,
      time,
      qrData,
      userId: req.user.id,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// ✅ DELETE /api/bookings/:id — Cancel a booking
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure booking belongs to this user
    const booking = await Booking.findOne({ _id: id, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized to delete.' });
    }

    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

// ✅ AUTH ROUTES
app.use('/api/auth', authRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access backend at http://localhost:${PORT}`);
});
