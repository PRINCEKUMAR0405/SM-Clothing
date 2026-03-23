import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-sm">SM</span>
              <span className="logo-text">Clothing</span>
            </Link>
            <p className="footer-tagline">Premium fashion for everyone. Crafted with care, styled for life.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/category/men">Men</Link></li>
              <li><Link to="/category/women">Women</Link></li>
              <li><Link to="/category/kids">Kids</Link></li>
              <li><Link to="/category/accessories">Accessories</Link></li>
              <li><Link to="/products?sale=true">Sale</Link></li>
              <li><Link to="/products?new=true">New Arrivals</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/orders">Track Order</Link></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Returns Policy</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li><Mail size={15} /> support@smclothing.in</li>
              <li><Phone size={15} /> +91 98765 43210</li>
              <li><MapPin size={15} /> Mumbai, Maharashtra, India</li>
            </ul>
            <div className="footer-newsletter">
              <p>Subscribe for offers & new arrivals</p>
              <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button type="submit">Join</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2025 SM Clothing. All rights reserved.</p>
          <div className="footer-payments">
            <span>💳</span> <span>UPI</span> <span>Net Banking</span> <span>COD</span>
          </div>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
