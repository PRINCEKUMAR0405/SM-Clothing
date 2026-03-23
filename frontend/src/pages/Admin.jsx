import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign,
  BarChart3, ArrowUpRight, ArrowDownRight, Star, Eye
} from 'lucide-react';
import { products, categories, formatPrice } from '../data/products.js';
import { useAuth } from '../context/AuthContext.jsx';
import './Admin.css';

// Generate mock analytics data
const generateOrders = () => {
  const allOrders = JSON.parse(localStorage.getItem('sm_orders') || '[]');
  // Add mock historical data
  const mock = [];
  const now = Date.now();
  for (let i = 0; i < 48; i++) {
    const numItems = Math.floor(Math.random() * 4) + 1;
    const orderProducts = products.sort(() => Math.random() - 0.5).slice(0, numItems);
    const subtotal = orderProducts.reduce((s, p) => s + p.price, 0);
    mock.push({
      id: 'MOCK' + i,
      date: new Date(now - (i * 3.5 * 24 * 60 * 60 * 1000)).toISOString(),
      items: orderProducts.map((p) => ({ ...p, quantity: 1 })),
      total: subtotal + (subtotal > 999 ? 0 : 99),
      subtotal,
      status: ['Confirmed', 'Shipped', 'Delivered', 'Delivered', 'Delivered'][Math.floor(Math.random() * 5)],
    });
  }
  return [...allOrders, ...mock];
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user?.isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--muted)', marginTop: 10 }}>You need admin privileges to view this page.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Go Home</Link>
      </div>
    );
  }

  const orders = generateOrders();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const cogs = orders.reduce((s, o) => s + o.total * 0.55, 0);
  const profit = revenue - cogs;
  const totalOrders = orders.length;
  const avgOrderValue = revenue / totalOrders || 0;

  // Monthly revenue for chart
  const monthlyData = MONTHS.map((month, i) => {
    const monthOrders = orders.filter((o) => new Date(o.date).getMonth() === i);
    const rev = monthOrders.reduce((s, o) => s + o.total, 0);
    const cost = rev * 0.55;
    return { month, revenue: rev, profit: rev - cost, orders: monthOrders.length };
  });
  const maxRev = Math.max(...monthlyData.map((d) => d.revenue), 1);

  // Top products by appearance in orders
  const productSales = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      if (!productSales[item.id]) productSales[item.id] = { ...item, totalSold: 0, totalRevenue: 0 };
      productSales[item.id].totalSold += item.quantity || 1;
      productSales[item.id].totalRevenue += item.price * (item.quantity || 1);
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 8);

  // Category breakdown
  const catRevenue = categories.map((cat) => {
    const catOrders = orders.flatMap((o) => o.items || []).filter((i) => i.category === cat.id);
    const rev = catOrders.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    return { ...cat, revenue: rev, units: catOrders.length };
  });

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: formatPrice(revenue),
      icon: <DollarSign size={22} />,
      change: '+18.5%',
      up: true,
      color: '#14958F',
    },
    {
      label: 'Gross Profit',
      value: formatPrice(profit),
      icon: <TrendingUp size={22} />,
      change: '+12.3%',
      up: true,
      color: '#FF3F6C',
      sub: `Margin: ${((profit / revenue) * 100).toFixed(1)}%`,
    },
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: <ShoppingBag size={22} />,
      change: '+22%',
      up: true,
      color: '#5B6EE1',
    },
    {
      label: 'Avg Order Value',
      value: formatPrice(avgOrderValue),
      icon: <BarChart3 size={22} />,
      change: '-3.2%',
      up: false,
      color: '#FF905A',
    },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">Welcome back, {user.name}! Here's your store overview.</p>
          </div>
          <Link to="/" className="btn btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>← View Store</Link>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview', 'orders', 'products', 'analytics'].map((t) => (
            <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <>
            {/* Stat Cards */}
            <div className="stat-cards">
              {STAT_CARDS.map((card) => (
                <div key={card.label} className="stat-card">
                  <div className="stat-card-top">
                    <div className="stat-icon" style={{ background: card.color + '18', color: card.color }}>{card.icon}</div>
                    <span className={`stat-change${card.up ? ' up' : ' down'}`}>
                      {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {card.change}
                    </span>
                  </div>
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                  {card.sub && <div className="stat-sub">{card.sub}</div>}
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="admin-section">
              <h2 className="admin-section-title">Monthly Revenue vs Profit</h2>
              <div className="bar-chart">
                {monthlyData.map((d, i) => (
                  <div key={d.month} className="bar-col">
                    <div className="bars">
                      <div
                        className="bar bar-revenue"
                        style={{ height: `${(d.revenue / maxRev) * 100}%` }}
                        title={`Revenue: ${formatPrice(d.revenue)}`}
                      />
                      <div
                        className="bar bar-profit"
                        style={{ height: `${(d.profit / maxRev) * 100}%` }}
                        title={`Profit: ${formatPrice(d.profit)}`}
                      />
                    </div>
                    <span className="bar-label">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot revenue-dot" /> Revenue</span>
                <span className="legend-item"><span className="legend-dot profit-dot" /> Profit</span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="admin-section">
              <h2 className="admin-section-title">Revenue by Category</h2>
              <div className="cat-breakdown">
                {catRevenue.sort((a, b) => b.revenue - a.revenue).map((cat) => {
                  const pct = revenue > 0 ? (cat.revenue / revenue) * 100 : 0;
                  return (
                    <div key={cat.id} className="cat-breakdown-row">
                      <div className="cat-breakdown-name">
                        <img src={cat.image} alt={cat.name} className="cat-breakdown-img" />
                        <span>{cat.name}</span>
                      </div>
                      <div className="cat-breakdown-bar-wrap">
                        <div className="cat-breakdown-bar" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="cat-breakdown-stats">
                        <span className="cat-rev">{formatPrice(cat.revenue)}</span>
                        <span className="cat-pct">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="admin-section">
            <h2 className="admin-section-title">Recent Orders ({orders.length})</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice().reverse().slice(0, 30).map((order) => (
                    <tr key={order.id}>
                      <td className="order-id-cell">#{order.id}</td>
                      <td>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td className="order-total-cell">{formatPrice(order.total)}</td>
                      <td>
                        <span className={`order-status-badge ${(order.status || 'confirmed').toLowerCase()}`}>
                          {order.status || 'Confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="admin-section-title" style={{ marginBottom: 0 }}>Product Catalogue ({products.length})</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>MRP</th>
                    <th>Discount</th>
                    <th>Rating</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image} alt={p.name} style={{ width: 44, height: 55, objectFit: 'cover', borderRadius: 4, background: '#f0f0f0' }} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--dark)' }}>{p.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--muted)' }}>{p.subCategory}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize', fontSize: 13 }}>{p.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--dark)' }}>{formatPrice(p.price)}</td>
                      <td style={{ color: 'var(--muted)', textDecoration: 'line-through', fontSize: 13 }}>{formatPrice(p.originalPrice)}</td>
                      <td><span className="badge badge-primary">{p.discount}%</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={13} fill="#f5a623" stroke="#f5a623" />
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{p.rating}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: p.inStock ? 'var(--success)' : 'var(--error)', fontWeight: 600, fontSize: 12 }}>
                          {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab === 'analytics' && (
          <>
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#FF3F6C18', color: '#FF3F6C' }}><DollarSign size={22} /></div>
                <div className="stat-value">{formatPrice(revenue)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#14958F18', color: '#14958F' }}><TrendingUp size={22} /></div>
                <div className="stat-value">{formatPrice(profit)}</div>
                <div className="stat-label">Gross Profit</div>
                <div className="stat-sub">Margin: {((profit / revenue) * 100).toFixed(1)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#5B6EE118', color: '#5B6EE1' }}><TrendingDown size={22} /></div>
                <div className="stat-value">{formatPrice(cogs)}</div>
                <div className="stat-label">Cost of Goods Sold</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#FF905A18', color: '#FF905A' }}><Users size={22} /></div>
                <div className="stat-value">50,000+</div>
                <div className="stat-label">Total Customers</div>
              </div>
            </div>

            {/* Top Products */}
            <div className="admin-section">
              <h2 className="admin-section-title">Top Selling Products</h2>
              <div className="top-products">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="top-product-row">
                    <span className="top-rank">#{i + 1}</span>
                    <img src={p.image} alt={p.name} className="top-product-img" />
                    <div className="top-product-info">
                      <p className="top-product-name">{p.name}</p>
                      <p className="top-product-cat" style={{ textTransform: 'capitalize' }}>{p.category} · {p.subCategory}</p>
                    </div>
                    <div className="top-product-stats">
                      <div>
                        <p className="stat-num">{p.totalSold}</p>
                        <p className="stat-key">Units Sold</p>
                      </div>
                      <div>
                        <p className="stat-num">{formatPrice(p.totalRevenue)}</p>
                        <p className="stat-key">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* P&L Summary */}
            <div className="admin-section pnl-section">
              <h2 className="admin-section-title">Profit & Loss Summary</h2>
              <div className="pnl-grid">
                <div className="pnl-card pnl-revenue">
                  <p className="pnl-label">Total Revenue</p>
                  <p className="pnl-amount">{formatPrice(revenue)}</p>
                </div>
                <div className="pnl-card pnl-cogs">
                  <p className="pnl-label">Cost of Goods (55%)</p>
                  <p className="pnl-amount">−{formatPrice(cogs)}</p>
                </div>
                <div className="pnl-card pnl-profit">
                  <p className="pnl-label">Gross Profit (45%)</p>
                  <p className="pnl-amount">{formatPrice(profit)}</p>
                </div>
                <div className="pnl-card pnl-tax">
                  <p className="pnl-label">GST (18% on profit)</p>
                  <p className="pnl-amount">−{formatPrice(profit * 0.18)}</p>
                </div>
                <div className="pnl-card pnl-net">
                  <p className="pnl-label">Net Profit (After GST)</p>
                  <p className="pnl-amount net">{formatPrice(profit * 0.82)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
