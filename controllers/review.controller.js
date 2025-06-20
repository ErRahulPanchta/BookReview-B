import Review from '../models/review.model.js';
import Book from '../models/book.model.js';

export const getReviewsByBookId = async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name avatar');
  res.json(reviews);
};

export const submitReview = async (req, res) => {
  const { rating, comment, bookId } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    book: bookId,
  });
  if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed this book' });

  const review = new Review({
    user: req.user._id,
    book: bookId,
    rating,
    comment,
  });

  await review.save();

  // Update average rating
  const reviews = await Review.find({ book: bookId });
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await Book.findByIdAndUpdate(bookId, { rating: avgRating });

  res.status(201).json(review);
};
