import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  adminStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);