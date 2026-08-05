import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import Scheme from './models/Scheme.js'; // Import Scheme model to search database

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);

// Database-Driven AI Chatbot Route
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const q = prompt ? prompt.toLowerCase() : '';
    
    // Fetch all schemes dynamically from MongoDB Atlas
    const schemes = await Scheme.find({});
    
    let reply = "";

    // 1. Handle requests for listing all schemes
    if (q.includes('all scheme') || q.includes('list') || q.includes('show schemes') || q.includes('what schemes')) {
      if (schemes.length === 0) {
        reply = "No schemes are currently found in your database. Please add them via your bulk insert or Postman route!";
      } else {
        reply = `Here are the schemes available in your database (${schemes.length} total):\n\n` + 
          schemes.slice(0, 8).map(s => `• **${s.title}** (${s.category}) - ${s.amount}\n  ${s.description}`).join('\n\n') +
          (schemes.length > 8 ? `\n\n...and ${schemes.length - 8} more schemes! Ask about a specific category like Agriculture, Education, or Health.` : '');
      }
    } 
    // 2. Handle category or keyword searches directly from MongoDB
    else {
      const matchedSchemes = schemes.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
      );

      if (matchedSchemes.length > 0) {
        reply = `I found these matching schemes from your database:\n\n` +
          matchedSchemes.map(s => `• **${s.title}** (${s.category} - ${s.state})\n  Benefits: ${s.amount}\n  ${s.description}`).join('\n\n');
      } else {
        reply = `Namaste! 🙏 I am Saathi AI. I searched your database but couldn't find a direct match for "${prompt}". Try asking about categories like Agriculture, Education, Health, Women, or type "show schemes" to see everything!`;
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.json({ reply: "Namaste! I am your SchemeSaathi assistant. Check your MongoDB connection or try asking your query again." });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected Successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));