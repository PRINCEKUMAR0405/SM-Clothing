import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, MapPin } from 'lucide-react';
import { formatPrice } from '../data/products.js';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const orders = JSON.parse(localStorage.getItem('sm_orders') || '[]');
  const order = orders.find((o) => o.id === orderId);

  if (!order) return (
    <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
      <h2>Order not found</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Go Home</Link>
    </div>
  );

  const deliveryDate = new Date(order.date);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="confirmation-page">
      <div className="container confirmation-inner">
        <div className="confirmation-card">
          <CheckCircle2 size={64} className="confirm-icon" />
          <h1>Order Confirmed! 🎉</h1>
          <p className="confirm-sub">Thank you for your purchase. Your order has been placed successfully.</p>
          <div className="order-id-badge">Order ID: <strong>{orderId}</strong></div>

          <div className="confirm-timeline">
            <div className="timeline-step done"><Package size={20} /> <span>Order Placed</span></div>
            <div className="timeline-line" />
            <div className="timeline-step"><Truck size={20} /> <span>Shipped</span></div>
            <div className="timeline-line" />
            <div className="timeline-step"><MapPin size={20} /> <span>Delivered by {deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span></div>
          </div>

          <div className="confirm-details">
            <div className="confirm-address">
              <h4>Delivering To</h4>
              <p><strong>{order.address.name}</strong> · {order.address.phone}</p>
              <p>{order.address.street}, {order.address.city}, {order.address.state} – {order.address.pincode}</p>
            </div>
            <div className="confirm-payment">
              <h4>Payment</h4>
              <p style={{ textTransform: 'capitalize' }}>{order.payment.replace(/-/g, ' ')}</p>
              <p className="confirm-total">Total Paid: <strong>{formatPrice(order.total)}</strong></p>
            </div>
          </div>

          <div className="confirm-items">
            {order.items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="confirm-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="confirm-item-name">{item.name}</p>
                  <p className="confirm-item-meta">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                  <p className="confirm-item-price">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="confirm-actions">
            <Link to="/orders" className="btn btn-outline">View All Orders</Link>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
