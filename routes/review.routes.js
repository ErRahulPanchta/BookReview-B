import express from 'express';
import { getReviewsByBookId, submitReview } from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/:bookId', getReviewsByBookId);
router.post('/', protect, submitReview);
export default router;
