import express from 'express';
import Scheme from '../models/Scheme.js';

const router = express.Router();

// GET all schemes strictly from MongoDB Database
router.get('/', async (req, res) => {
  try {
    const { category, state, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (state && state !== 'All India') query.state = state;
    if (search) query.title = { $regex: search, $options: 'i' };

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Database fetch error', details: err.message });
  }
});

// GET single scheme by ID from MongoDB
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found in MongoDB' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Add new scheme to MongoDB Database (Admin)
router.post('/', async (req, res) => {
  try {
    const { title, category, state, description, amount, users, documentsCount } = req.body;
    
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required' });
    }

    const scheme = await Scheme.create({
      title: title.trim(),
      category: category.trim(),
      state: state ? state.trim() : 'All India',
      description: description.trim(),
      amount: amount || '₹50,000/yr',
      users: users || '1M+',
      documentsCount: documentsCount ? Number(documentsCount) : 3
    });

    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create scheme in MongoDB', details: err.message });
  }
});

// PUT Update existing scheme in MongoDB (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { title, category, state, description, amount, users, documentsCount } = req.body;
    
    const updated = await Scheme.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        category: category?.trim(),
        state: state?.trim() || 'All India',
        description: description?.trim(),
        amount: amount || '₹50,000/yr',
        users: users || '1M+',
        documentsCount: documentsCount ? Number(documentsCount) : 3
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Scheme not found in MongoDB' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update scheme in MongoDB', details: err.message });
  }
});

// DELETE scheme from MongoDB (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Scheme.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Scheme not found in MongoDB' });
    res.json({ message: 'Scheme deleted successfully from MongoDB', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete scheme from MongoDB', details: err.message });
  }
});

// POST Bulk insert schemes directly into MongoDB
router.post('/bulk', async (req, res) => {
  try {
    const schemes = await Scheme.insertMany(req.body);
    res.status(201).json({ message: `${schemes.length} schemes stored in MongoDB successfully!`, schemes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;