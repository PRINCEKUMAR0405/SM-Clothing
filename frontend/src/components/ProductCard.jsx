import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../data/products.js';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        selectedSize: product.sizes[0],
        selectedColor: product.colors[0],
      },
    });
    showToast(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! ♥');
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80' : product.image}
          alt={product.name}
          className="product-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="product-overlay">
          <button className="overlay-btn" onClick={handleAddToCart} title="Add to bag">
            <ShoppingBag size={16} /> Add to Bag
          </button>
          <button className="overlay-icon-btn" onClick={() => { navigate(`/product/${product.id}`); }} title="Quick view">
            <Eye size={18} />
          </button>
        </div>
        {product.discount > 0 && (
          <span className="product-discount-badge">{product.discount}% OFF</span>
        )}
        {product.newArrival && (
          <span className="product-new-badge">NEW</span>
        )}
        <button
          className={`product-wishlist-btn${wishlisted ? ' wishlisted' : ''}`}
          onClick={handleWishlist}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.subCategory}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <Star size={13} fill="currentColor" className="star-icon" />
          <span>{product.rating}</span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-pricing">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="product-original">{formatPrice(product.originalPrice)}</span>
              <span className="product-disc-pct">({product.discount}% off)</span>
            </>
          )}
        </div>
        <p className="product-sizes">
          {product.sizes.slice(0, 5).join(' · ')}
          {product.sizes.length > 5 && ' …'}
        </p>
      </div>
    </Link>
  );
}
