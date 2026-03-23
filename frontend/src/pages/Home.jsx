import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Truck, RotateCcw, Shield, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { products, categories, getFeaturedProducts, getNewArrivals, formatPrice } from '../data/products.js';
import './Home.css';

const HERO_SLIDES = [
  {
    headline: 'New Season,\nNew You',
    sub: 'Explore our curated spring/summer 2025 collection',
    cta: 'Shop Women',
    ctaPath: '/category/women',
    bg: '#0f0f0f',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85',
    accent: '#FF3F6C',
  },
  {
    headline: 'Bold.\nRefined.\nYou.',
    sub: 'Premium menswear that moves with you all day long',
    cta: 'Shop Men',
    ctaPath: '/category/men',
    bg: '#111',
    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=85',
    accent: '#fff',
  },
  {
    headline: 'Up to 40% off\nSale Items',
    sub: "Limited time deals across all categories. Don't miss out!",
    cta: 'Shop Sale',
    ctaPath: '/products?sale=true',
    bg: '#1a0005',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85',
    accent: '#FF3F6C',
  },
];

const PERKS = [
  { icon: <Truck size={28} />, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: <RotateCcw size={28} />, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: <Shield size={28} />, title: '100% Genuine', desc: 'Authentic products guaranteed' },
  { icon: <Star size={28} />, title: 'Top Rated', desc: '4.5★ average across 10,000+ reviews' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const s = HERO_SLIDES[slide];

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero" style={{ background: s.bg }}>
        <img src={s.img} alt="Hero" className="hero-bg-img" loading="eager" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="hero-eyebrow">SM Clothing · 2025</p>
          <h1 className="hero-headline" style={{ '--accent': s.accent }}>
            {s.headline.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          <p className="hero-sub">{s.sub}</p>
          <div className="hero-actions">
            <Link to={s.ctaPath} className="btn btn-primary hero-cta">{s.cta} <ArrowRight size={16} /></Link>
            <Link to="/products" className="btn hero-browse">Browse All</Link>
          </div>
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot${i === slide ? ' active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="perks-bar">
        <div className="container perks-grid">
          {PERKS.map((p) => (
            <div key={p.title} className="perk-item">
              <div className="perk-icon">{p.icon}</div>
              <div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-sub">Find your perfect style</p>
            </div>
            <Link to="/products" className="see-all">View All <ChevronRight size={16} /></Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="cat-card">
                <div className="cat-img-wrap">
                  <img src={cat.image} alt={cat.name} className="cat-img" loading="lazy" />
                  <div className="cat-overlay" />
                </div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="cat-cta">Explore <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="home-section home-section-grey">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Collection</h2>
              <p className="section-sub">Handpicked favourites this season</p>
            </div>
            <Link to="/products" className="see-all">See All <ChevronRight size={16} /></Link>
          </div>
          <div className="grid-4">
            {featured.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <p className="promo-eyebrow">Limited Time</p>
            <h2>Summer Sale — Up to <span>40% Off</span></h2>
            <p className="promo-sub">Massive discounts on top picks. Offer valid while stocks last.</p>
            <Link to="/products?sale=true" className="btn btn-primary">Shop Sale <ArrowRight size={16} /></Link>
          </div>
          <div className="promo-img-wrap">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80" alt="Sale" />
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-sub">Fresh drops you'll love</p>
            </div>
            <Link to="/products?new=true" className="see-all">See All <ChevronRight size={16} /></Link>
          </div>
          <div className="grid-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Brand Strip ── */}
      <section className="brand-strip">
        <div className="container brand-strip-inner">
          <p className="brand-strip-label">Trusted by 50,000+ happy customers</p>
          <div className="brand-strip-stats">
            {[['50K+', 'Happy Customers'], ['10K+', 'Reviews'], ['200+', 'Styles'], ['100%', 'Authentic']].map(([num, label]) => (
              <div key={label} className="brand-stat">
                <strong>{num}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
