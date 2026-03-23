import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { User, Mail, Phone, MapPin, Lock, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import './Profile.css';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const orders = JSON.parse(localStorage.getItem('sm_orders') || '[]');

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', email: user?.email || '' });

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <User size={60} style={{ color: 'var(--border)', margin: '0 auto 20px' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 10 }}>Please Sign In</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>You need to be signed in to view your profile.</p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    login({ ...user, name: form.name, email: form.email });
    showToast('Profile updated!');
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-email">{user.email}</p>
          {user.isAdmin && <span className="admin-badge">Admin</span>}
          <nav className="profile-nav">
            <a href="#details" className="profile-nav-item active"><User size={16} /> Profile Details</a>
            <Link to="/orders" className="profile-nav-item"><Package size={16} /> My Orders</Link>
            <Link to="/wishlist" className="profile-nav-item"><Mail size={16} /> Wishlist</Link>
            {user.isAdmin && <Link to="/admin" className="profile-nav-item admin-link">📊 Admin Dashboard</Link>}
            <button className="profile-nav-item profile-logout" onClick={() => { logout(); navigate('/'); showToast('Signed out'); }}>
              <Lock size={16} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="profile-main">
          <section id="details" className="profile-section">
            <div className="profile-section-header">
              <h2>Profile Details</h2>
              {!editing && <button className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => setEditing(true)}>Edit</button>}
            </div>
            {editing ? (
              <form onSubmit={handleSave} className="profile-form">
                <div className="form-group"><label>Full Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter mobile number" /></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>Save Changes</button>
                  <button type="button" className="btn btn-outline" style={{ padding: '10px 24px' }} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-detail-row"><User size={16} /><div><label>Full Name</label><p>{user.name}</p></div></div>
                <div className="profile-detail-row"><Mail size={16} /><div><label>Email</label><p>{user.email}</p></div></div>
                <div className="profile-detail-row"><Phone size={16} /><div><label>Phone</label><p>Not provided</p></div></div>
              </div>
            )}
          </section>

          {/* Recent Orders */}
          <section className="profile-section">
            <div className="profile-section-header">
              <h2>Recent Orders</h2>
              <Link to="/orders" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>View All</Link>
            </div>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>No orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.slice(-3).reverse().map((order) => (
                  <Link key={order.id} to={`/order-confirmation/${order.id}`} className="profile-order-row">
                    <div>
                      <p className="profile-order-id">#{order.id}</p>
                      <p className="profile-order-date">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="profile-order-items">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                    <span className={`order-status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    <p className="profile-order-total">{formatPrice(order.total)}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
