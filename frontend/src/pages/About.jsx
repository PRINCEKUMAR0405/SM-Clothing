import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Globe, Users } from 'lucide-react';
import './About.css';

const TEAM = [
  { name: 'Suresh Kumar', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
  { name: 'Meera Sharma', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&q=80' },
  { name: 'Arjun Patel', role: 'Marketing Lead', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Priya Singh', role: 'Operations Head', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80" alt="SM Clothing" className="about-hero-img" />
        <div className="about-hero-overlay" />
        <div className="container about-hero-content">
          <p className="hero-eyebrow">Our Story</p>
          <h1>Fashion That Tells<br />Your Story</h1>
          <p>SM Clothing was founded with a simple belief — everyone deserves to look and feel amazing, every single day.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="container about-mission">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>At SM Clothing, we believe fashion is more than just clothes — it's a language. We craft premium-quality, trend-forward apparel that empowers people to express themselves authentically.</p>
            <p>Since 2018, we've been committed to ethical manufacturing, sustainable materials, and fair wages for every worker in our supply chain.</p>
            <Link to="/products" className="btn btn-primary">Explore Collection <ArrowRight size={16} /></Link>
          </div>
          <div className="mission-img">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="Our Mission" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>What We Stand For</h2>
          <div className="values-grid">
            {[
              { icon: <Award size={32} />, title: 'Quality First', desc: 'Every piece is crafted from premium materials with rigorous quality checks.' },
              { icon: <Heart size={32} />, title: 'Made with Love', desc: 'Our designers pour passion into every stitch, cut, and collection.' },
              { icon: <Globe size={32} />, title: 'Sustainable Fashion', desc: 'Eco-conscious practices from sourcing to packaging — planet first.' },
              { icon: <Users size={32} />, title: 'Community Driven', desc: 'Built by you, for you. Customer feedback shapes every new collection.' },
            ].map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-section about-section-grey">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>Meet the Team</h2>
          <p className="section-sub" style={{ textAlign: 'center', marginBottom: 40 }}>The talented people behind SM Clothing</p>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-img-wrap">
                  <img src={member.img} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container stats-grid">
          {[['2018', 'Founded'], ['50,000+', 'Happy Customers'], ['200+', 'Unique Styles'], ['15+', 'Industry Awards']].map(([num, label]) => (
            <div key={label} className="about-stat">
              <strong>{num}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
