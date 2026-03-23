import express from 'express';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Place order
router.post('/', auth, (req, res) => {
  try {
    const { items, address, paymentMethod, subtotal, shipping, total } = req.body;
    const id = 'SMC' + Date.now().toString().slice(-8);
    db.prepare('INSERT INTO orders (id, user_email, items, address, payment_method, subtotal, shipping, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, req.user.email, JSON.stringify(items), JSON.stringify(address), paymentMethod, subtotal, shipping, total);
    res.json({ orderId: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get user's orders
router.get('/mine', auth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC').all(req.user.email);
  res.json(orders.map((o) => ({ ...o, items: JSON.parse(o.items), address: JSON.parse(o.address) })));
});

// Get all orders (admin)
router.get('/all', auth, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders.map((o) => ({ ...o, items: JSON.parse(o.items), address: JSON.parse(o.address) })));
});

// Analytics (admin)
router.get('/analytics', auth, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  const orders = db.prepare('SELECT * FROM orders').all();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const cogs = revenue * 0.55;
  const profit = revenue - cogs;
  res.json({ revenue, cogs, profit, totalOrders: orders.length, avgOrderValue: revenue / (orders.length || 1) });
});

export default router;
