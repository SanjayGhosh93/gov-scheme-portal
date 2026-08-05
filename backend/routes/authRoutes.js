import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Get All Users (For Admin Panel)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Social Login / Registration Route (Google & Facebook)
router.post('/social', async (req, res) => {
  try {
    const { name, email, provider } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// User Favourites Database Routes
// ==========================================

// Get user's saved favourites from MongoDB
router.get('/favourites', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favourites');
    res.json(user.favourites || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle and store favorite scheme in MongoDB database
router.post('/favourites/toggle', verifyToken, async (req, res) => {
  try {
    const { schemeId } = req.body;
    const user = await User.findById(req.user.id);

    const index = user.favourites.indexOf(schemeId);
    if (index > -1) {
      user.favourites.splice(index, 1); // Remove if already saved
    } else {
      user.favourites.push(schemeId); // Add if not saved
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('favourites');
    res.json(updatedUser.favourites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Forgot / Reset Password Route
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User with this email does not exist' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;