import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import bookRoutes from './routes/book.routes.js'
import reviewRoutes from './routes/review.routes.js'
import userRoutes from './routes/user.routes.js'
import errorHandler from './middlewares/error.middleware.js'
import path from 'path';

dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();


const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim().replace(/\/$/, '')); // remove trailing slash

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error(`❌ Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

