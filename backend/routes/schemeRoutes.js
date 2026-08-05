import express from 'express';
import Scheme from '../models/Scheme.js';

const router = express.Router();

// Get all schemes
router.get('/', async (req, res) => {
  try {
    const { category, state, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (state && state !== 'All India') query.state = state;
    if (search) query.title = { $regex: search, $options: 'i' };

    const schemes = await Scheme.find(query);
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add single scheme
router.post('/', async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add BULK schemes (New Route for Postman)
router.post('/bulk', async (req, res) => {
  try {
    const schemes = await Scheme.insertMany(req.body);
    res.status(201).json({ message: `${schemes.length} schemes added successfully!`, schemes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete scheme
router.delete('/:id', async (req, res) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scheme deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;