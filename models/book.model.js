import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  coverImage: String,
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
