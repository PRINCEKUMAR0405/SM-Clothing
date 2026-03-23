import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../data/products.js';
import './Wishlist.css';

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { dispatch } = useCart();
  const { showToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container wishlist-empty">
          <Heart size={72} strokeWidth={1} style={{ color: 'var(--border)', margin: '0 auto' }} />
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favourite items here so you never miss them.</p>
          <Link to="/products" className="btn btn-primary">Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="wishlist-heading">My Wishlist <span>({items.length} {items.length === 1 ? 'item' : 'items'})</span></h1>
        <div className="wishlist-grid">
          {items.map((product) => (
            <div key={product.id} className="wishlist-card">
              <Link to={`/product/${product.id}`} className="wishlist-img-wrap">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.discount > 0 && (
                  <span className="wishlist-discount">{product.discount}% OFF</span>
                )}
              </Link>
              <div className="wishlist-info">
                <p className="wishlist-sub">{product.subCategory}</p>
                <Link to={`/product/${product.id}`} className="wishlist-name">{product.name}</Link>
                <div className="wishlist-pricing">
                  <span className="wishlist-price">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="wishlist-original">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <div className="wishlist-actions">
                  <button
                    className="btn btn-black wishlist-add-btn"
                    onClick={() => {
                      dispatch({ type: 'ADD_ITEM', payload: { ...product, selectedSize: product.sizes[0], selectedColor: product.colors[0] } });
                      showToast('Added to bag!');
                    }}
                  >
                    <ShoppingBag size={15} /> Add to Bag
                  </button>
                  <button className="wishlist-remove-btn" onClick={() => { toggle(product); showToast('Removed from wishlist'); }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
