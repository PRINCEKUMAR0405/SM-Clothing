import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4173'] }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'SM Clothing API' }));
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`✅ SM Clothing API running on http://localhost:${PORT}`);
});
