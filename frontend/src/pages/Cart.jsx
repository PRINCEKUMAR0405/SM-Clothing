import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/products.js';
import './Cart.css';

export default function Cart() {
  const { items, dispatch, subtotal, shipping, total, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-inner">
          <ShoppingBag size={72} strokeWidth={1} className="cart-empty-icon" />
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet. Let's change that!</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-heading">Shopping Bag <span>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-item-img">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-header">
                    <div>
                      <p className="cart-item-sub">{item.subCategory}</p>
                      <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                    </div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor } })}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div className="cart-item-meta">
                    <span>Size: <strong>{item.selectedSize}</strong></span>
                    <span>Colour: <strong>{item.selectedColor}</strong></span>
                  </div>
                  <div className="cart-item-footer">
                    <div className="cart-qty">
                      <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor, quantity: item.quantity - 1 } })}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor, quantity: item.quantity + 1 } })}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="cart-item-price">
                      <span className="cart-price-current">{formatPrice(item.price * item.quantity)}</span>
                      {item.originalPrice > item.price && (
                        <span className="cart-price-original">{formatPrice(item.originalPrice * item.quantity)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <div className="free-delivery-msg"><Truck size={14} /> Free delivery applied!</div>
              )}
              {shipping > 0 && (
                <div className="free-delivery-msg" style={{ color: 'var(--muted)' }}>
                  <Truck size={14} /> Add {formatPrice(999 - subtotal)} more for free delivery
                </div>
              )}
              <div className="summary-divider" />

              <div className="coupon-row">
                <Tag size={16} />
                <input type="text" placeholder="Enter coupon code" />
                <button>Apply</button>
              </div>

              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {subtotal > 0 && (
                <p className="summary-saving">
                  You save {formatPrice(items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0))} on this order!
                </p>
              )}

              <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
            </div>

            <div className="secure-checkout">
              <p>🔒 100% Secure Checkout</p>
              <p>We accept UPI, Cards, Net Banking & COD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
