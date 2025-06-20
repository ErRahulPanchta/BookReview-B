import Book from '../models/book.model.js';

// Get all books with advanced filtering, sorting and pagination
export const getAllBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // Filtering options
    const { 
      search = '',
      genre = '',
      minRating = 0,
      maxRating = 5,
      author = ''
    } = req.query;

    // Sorting options
    const sortBy = req.query.sortBy || '-createdAt';
    const validSortFields = ['title', 'author', 'createdAt', 'rating'];
    const sortField = sortBy.replace('-', '');
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;

    // Validate sort field
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    // Build query
    const query = {
      ...(search && { 
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]
      }),
      ...(genre && { genre: { $in: genre.split(',') } }),
      ...(author && { author: { $regex: author, $options: 'i' } }),
      rating: { $gte: parseFloat(minRating), $lte: parseFloat(maxRating) }
    };

    // Get total count and paginated results
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortOrder });

    // Get all available genres for filter options
    const genres = await Book.distinct('genre');

    res.status(200).json({
      books,
      page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      availableGenres: genres,
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch books', 
      error: err.message 
    });
  }
};

// Get single book by ID with populated reviews
export const getBookById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID format' });
  }

  try {
    const book = await Book.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Optional: Calculate average rating without saving
    if (book.reviews.length > 0) {
      const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
      book.rating = totalRating / book.reviews.length;
    }

    res.status(200).json(book);
  } catch (err) {
    console.error('❌ Error in getBookById:', err);
    res.status(500).json({ 
      message: 'Failed to fetch book', 
      error: err.message 
    });
  }
};

// Add a new book (admin only)
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    // Validate required fields
    if (!title || !author || !genre) {
      return res.status(400).json({ 
        message: 'Title, author and genre are required' 
      });
    }

    const coverImage = req.file 
      ? `/uploads/${req.file.filename}`
      : '/default-book-cover.jpg';

    const book = new Book({
      title,
      author,
      genre: genre.split(',').map(g => g.trim()),
      description,
      coverImage,
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to add book', 
      error: err.message 
    });
  }
};

// Update a book (admin only)
export const updateBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (author) updates.author = author;
    if (genre) updates.genre = genre.split(',').map(g => g.trim());
    if (description) updates.description = description;
    if (req.file) updates.coverImage = `/uploads/${req.file.filename}`;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to update book', 
      error: err.message 
    });
  }
};

// Delete a book (admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // TODO: Delete associated cover image file if needed

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to delete book', 
      error: err.message 
    });
  }
};