import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Demo login – admin@smclothing.in gets admin access
    const isAdmin = form.email === 'admin@smclothing.in';
    login({
      name: isAdmin ? 'Admin User' : form.email.split('@')[0].replace(/[._]/g, ' '),
      email: form.email,
      isAdmin,
    });
    showToast(`Welcome back! 👋`);
    navigate(isAdmin ? '/admin' : '/');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-sm">SM</span>
          <span className="logo-text">Clothing</span>
        </div>
        <h1>Sign In</h1>
        <p className="auth-sub">Welcome back! Please sign in to continue.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required minLength={6} />
          </div>
          <div className="auth-forgot"><a href="#">Forgot password?</a></div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>

        <div className="auth-demo">
          <p>Demo accounts:</p>
          <button onClick={() => setForm({ email: 'admin@smclothing.in', password: 'admin123' })}>👤 Admin Login</button>
          <button onClick={() => setForm({ email: 'user@example.com', password: 'user123' })}>👤 User Login</button>
        </div>
      </div>
    </div>
  );
}
