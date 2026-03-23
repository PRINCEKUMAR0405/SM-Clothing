import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Strict limiter for auth routes (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again in 15 minutes.' },
});

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4173'] }));
app.use(express.json());
app.use(globalLimiter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'SM Clothing API' }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`✅ SM Clothing API running on http://localhost:${PORT}`);
});
