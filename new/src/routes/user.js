const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../Model/booking');
const User = require('../Model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// --------------------------- AUTH MIDDLEWARE -----------------------------
const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dd6abd9b9cd1f721949ddde5dcb64e859aad8abcd9efbe87da225756120e707b');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// --------------------------- AUTH ROUTES -----------------------------

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, email, password: hashedPassword, role: role || 'user' });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: false,
      sameSite: 'lax',
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
res.cookie('token', token, {
  httpOnly: false, // must be false if you want to access it from JS (not recommended for production)
  sameSite: 'lax', // or 'none' and secure: true for HTTPS
  path: '/',
  domain: 'localhost', // optional, but can help
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    // ✅ Send the token and user details
    res.json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        _id: user._id
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });
  res.json({ message: 'Logged out successfully' });
});

// --------------------------- PROTECTED ROUTES -----------------------------
router.use(authenticate);

// Profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone, role } = req.body;

    // Only update provided fields
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;
    if (role)  update.role=role;
    const user = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET bookings for logged-in user only
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ user: userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create booking - associate with logged-in user
router.post('/', async (req, res) => {
  try {
    const { passengername, busnumber, seatnumber } = req.body;
    const userId = req.user.userId;

    const newBooking = new Booking({ passengername, busnumber, seatnumber, user: userId });
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update booking - only if booking belongs to user
router.put('/updatePassenger/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { passengername, busnumber, seatnumber } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    // Check booking ownership
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Passenger not found' });
    if (booking.user.toString() !== userId) return res.status(403).json({ error: 'Forbidden: Not your booking' });

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { passengername, busnumber, seatnumber },
      { new: true, runValidators: true }
    );

    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE booking - only if booking belongs to user
router.delete('/deletePassenger/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Passenger not found' });

    if (booking.user.toString() !== userId) return res.status(403).json({ error: 'Forbidden: Not your booking' });

    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Passenger deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET booking by ID - only if belongs to user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.user.toString() !== userId) return res.status(403).json({ error: 'Forbidden: Not your booking' });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
