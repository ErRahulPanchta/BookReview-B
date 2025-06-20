import express from 'express';
import { addBook, getAllBooks, getBookById } from '../controllers/book.controller.js';
import { protect , isAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);

router.post(
  '/',
  protect,
  isAdmin,
  upload.single('cover'),
  addBook
);

export default router;
