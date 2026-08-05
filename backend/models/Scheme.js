import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  state: { type: String, default: 'All India' },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  users: { type: String, required: true },
  documentsCount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Scheme', schemeSchema);