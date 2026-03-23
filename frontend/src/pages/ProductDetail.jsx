import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RotateCcw, Shield, ChevronRight, Star, Minus, Plus } from 'lucide-react';
import { getProductById, products, formatPrice } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('description');

  if (!product) return (
    <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Shop</Link>
    </div>
  );

  const wishlisted = isWishlisted(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { showToast('Please select a size', 'error'); return; }
    if (!selectedColor) { showToast('Please select a colour', 'error'); return; }
    dispatch({ type: 'ADD_ITEM', payload: { ...product, selectedSize, selectedColor, quantity } });
    showToast('Added to bag! 🛍️');
  };

  const handleBuyNow = () => {
    if (!selectedSize) { showToast('Please select a size', 'error'); return; }
    if (!selectedColor) { showToast('Please select a colour', 'error'); return; }
    dispatch({ type: 'ADD_ITEM', payload: { ...product, selectedSize, selectedColor, quantity } });
    navigate('/cart');
  };

  const imgs = product.images || [product.image];

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar"><div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to={`/category/${product.category}`} style={{ textTransform: 'capitalize' }}>{product.category}</Link><span>/</span>
          <span>{product.name}</span>
        </nav>
      </div></div>

      <div className="container pd-layout">
        {/* Image Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {imgs.map((img, i) => (
              <button key={i} className={`pd-thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                <img src={img} alt={`View ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <div className="pd-main-img">
            <img src={imgs[activeImg]} alt={product.name} />
            {product.discount > 0 && (
              <span className="pd-discount-badge">{product.discount}% OFF</span>
            )}
            <button
              className={`pd-wishlist-btn${wishlisted ? ' wishlisted' : ''}`}
              onClick={() => { toggle(product); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥'); }}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="pd-info">
          <p className="pd-category">{product.subCategory}</p>
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating-row">
            <div className="pd-rating">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#f5a623' : 'none'} stroke={s <= Math.round(product.rating) ? '#f5a623' : '#ccc'} />
              ))}
              <span className="pd-rating-val">{product.rating}</span>
            </div>
            <span className="pd-reviews">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="pd-pricing">
            <span className="pd-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="pd-mrp">MRP: {formatPrice(product.originalPrice)}</span>
                <span className="pd-off">({product.discount}% off)</span>
              </>
            )}
          </div>
          <p className="pd-tax-note">Inclusive of all taxes. Free delivery on orders above ₹999.</p>

          {/* Size selector */}
          <div className="pd-section">
            <div className="pd-section-header">
              <h4>Select Size</h4>
              <a href="#" className="size-guide-link">Size Guide <ChevronRight size={13} /></a>
            </div>
            <div className="size-options">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`size-btn${selectedSize === s ? ' selected' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colour selector */}
          <div className="pd-section">
            <h4>Select Colour {selectedColor && <span className="selected-color-label">— {selectedColor}</span>}</h4>
            <div className="color-options">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`color-btn${selectedColor === c ? ' selected' : ''}`}
                  onClick={() => setSelectedColor(c)}
                  title={c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="pd-section">
            <h4>Quantity</h4>
            <div className="quantity-ctrl">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}><Plus size={16} /></button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pd-cta">
            <button className="btn btn-outline-primary pd-cta-btn" onClick={handleAddToCart}>
              <ShoppingBag size={18} /> Add to Bag
            </button>
            <button className="btn btn-primary pd-cta-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
          <button
            className={`pd-wishlist-text${wishlisted ? ' wishlisted' : ''}`}
            onClick={() => { toggle(product); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥'); }}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </button>

          {/* Delivery perks */}
          <div className="pd-perks">
            <div className="pd-perk"><Truck size={16} /> <span>Free delivery on orders above ₹999</span></div>
            <div className="pd-perk"><RotateCcw size={16} /> <span>30-day easy returns</span></div>
            <div className="pd-perk"><Shield size={16} /> <span>100% authentic product</span></div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            {['description', 'details', 'reviews'].map((t) => (
              <button key={t} className={`pd-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="pd-tab-content">
            {tab === 'description' && <p>{product.description}</p>}
            {tab === 'details' && (
              <table className="pd-details-table">
                <tbody>
                  <tr><td>Category</td><td style={{ textTransform: 'capitalize' }}>{product.category}</td></tr>
                  <tr><td>Sub-category</td><td>{product.subCategory}</td></tr>
                  <tr><td>Available Sizes</td><td>{product.sizes.join(', ')}</td></tr>
                  <tr><td>Available Colours</td><td>{product.colors.join(', ')}</td></tr>
                  <tr><td>SKU</td><td>SMC-{String(product.id).padStart(5, '0')}</td></tr>
                </tbody>
              </table>
            )}
            {tab === 'reviews' && (
              <div className="pd-reviews-section">
                <div className="pd-reviews-summary">
                  <div className="big-rating">{product.rating}</div>
                  <div>
                    <div className="pd-rating" style={{ marginBottom: 6 }}>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={18} fill={s <= Math.round(product.rating) ? '#f5a623' : 'none'} stroke={s <= Math.round(product.rating) ? '#f5a623' : '#ccc'} />
                      ))}
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: 13 }}>Based on {product.reviews.toLocaleString()} reviews</p>
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>Customer reviews are verified purchases. Ratings shown are aggregated from all verified buyers.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ padding: '48px 0', background: 'var(--light-bg)' }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: 24 }}>You May Also Like</h2>
            <div className="grid-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
