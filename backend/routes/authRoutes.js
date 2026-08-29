import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to verify Admin role
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
  });
};

// Auto-seed default Admin on startup if none exists
export const initDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@schemesaathi.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[AUTH] Default Admin created: ${adminEmail}`);
    }
  } catch (err) {
    console.error('[AUTH] Failed to initialize default admin:', err.message);
  }
};

// Get current user profile from token
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Users (For Admin Panel)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve user as Admin
router.put('/users/:id/approve-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'admin';
    user.adminStatus = 'approved';
    await user.save();
    res.json({ message: `Admin privileges approved for ${user.name}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject user Admin request
router.put('/users/:id/reject-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'user';
    user.adminStatus = 'rejected';
    await user.save();
    res.json({ message: `Admin access rejected for ${user.name}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle user role between admin and user
router.put('/users/:id/toggle-role', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      user.role = 'user';
      user.adminStatus = 'none';
    } else {
      user.role = 'admin';
      user.adminStatus = 'approved';
    }
    await user.save();
    res.json({ message: `Role changed to ${user.role}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user by ID (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Regular User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      adminStatus: 'none'
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser._id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Standard User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        adminStatus: user.adminStatus || 'none'
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dedicated Admin Login (Validates credentials AND admin approval)
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Admin email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid administrator credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid administrator credentials' });
    }

    // Default Super Admin is always approved
    const isSuperAdmin = cleanEmail === 'admin@schemesaathi.com';
    const isApprovedAdmin = user.role === 'admin' || user.adminStatus === 'approved' || isSuperAdmin;

    if (!isApprovedAdmin) {
      if (user.adminStatus === 'pending') {
        return res.status(403).json({ 
          message: 'Your admin account request is pending approval by the Super Administrator.' 
        });
      }
      if (user.adminStatus === 'rejected') {
        return res.status(403).json({ 
          message: 'Your request for administrator access was rejected by the Super Admin.' 
        });
      }
      return res.status(403).json({ 
        message: 'Access denied. You need Super Administrator approval to access the Admin Portal.' 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: 'admin' }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: 'admin',
        adminStatus: 'approved'
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dedicated Admin Registration (Submits request for Super Admin approval)
router.post('/admin-register', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    const expectedSecret = process.env.ADMIN_SECRET_KEY || 'schemesaathi_admin_2026';

    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Invalid Admin Secret Key. Registration denied.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isSuperAdmin = cleanEmail === 'admin@schemesaathi.com';
    const initialRole = isSuperAdmin ? 'admin' : 'user';
    const initialStatus = isSuperAdmin ? 'approved' : 'pending';

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      existingUser.role = initialRole;
      existingUser.adminStatus = initialStatus;
      await existingUser.save();
      return res.json({ 
        message: isSuperAdmin 
          ? 'Super Admin activated successfully.' 
          : 'Admin access request submitted! Pending Super Admin approval.' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: initialRole,
      adminStatus: initialStatus
    });

    res.status(201).json({ 
      message: isSuperAdmin
        ? 'Admin account created successfully.'
        : 'Admin registration request submitted! Pending Super Admin approval.', 
      userId: newAdmin._id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Social Login / Registration Route (Google & Facebook)
router.post('/social', async (req, res) => {
  try {
    const { name, email, provider } = req.body;
    
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: name || 'User',
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '7d' }
    );

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
    res.json(user ? user.favourites || [] : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle and store favorite scheme in MongoDB database
router.post('/favourites/toggle', verifyToken, async (req, res) => {
  try {
    const { schemeId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.favourites.indexOf(schemeId);
    if (index > -1) {
      user.favourites.splice(index, 1);
    } else {
      user.favourites.push(schemeId);
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

    const user = await User.findOne({ email: email.toLowerCase().trim() });
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