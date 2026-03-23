import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import './Contact.css';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you within 24 hours. 📩');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <div className="container contact-hero-inner">
          <MessageSquare size={40} className="contact-hero-icon" />
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* Info */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p className="contact-info-sub">Reach out to us through any of the following channels.</p>
          <div className="contact-info-items">
            <div className="contact-info-item"><Mail size={20} /><div><h4>Email</h4><p>support@smclothing.in</p><p>business@smclothing.in</p></div></div>
            <div className="contact-info-item"><Phone size={20} /><div><h4>Phone</h4><p>+91 98765 43210</p><p>+91 80000 12345</p></div></div>
            <div className="contact-info-item"><MapPin size={20} /><div><h4>Address</h4><p>SM Clothing HQ, 5th Floor,</p><p>Fashion Street, Mumbai – 400001</p></div></div>
            <div className="contact-info-item"><Clock size={20} /><div><h4>Working Hours</h4><p>Mon – Fri: 9 AM – 6 PM</p><p>Sat: 10 AM – 4 PM</p></div></div>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-card">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                <option value="">Select a subject</option>
                <option>Order Issue</option>
                <option>Return/Refund</option>
                <option>Product Query</option>
                <option>Shipping Info</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you…" rows={5} required />
            </div>
            <button type="submit" className="btn btn-primary contact-submit">
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
