import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { formatPrice } from '../data/products.js';
import './Orders.css';

const STATUS_ICONS = {
  Confirmed: <CheckCircle2 size={16} className="status-icon confirmed" />,
  Shipped: <Truck size={16} className="status-icon shipped" />,
  Delivered: <Package size={16} className="status-icon delivered" />,
  Cancelled: <XCircle size={16} className="status-icon cancelled" />,
};

export default function Orders() {
  const orders = JSON.parse(localStorage.getItem('sm_orders') || '[]').reverse();

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container orders-empty">
          <Package size={72} strokeWidth={1} style={{ color: 'var(--border)', margin: '0 auto' }} />
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-heading">My Orders</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-header-left">
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    <Clock size={13} /> {new Date(order.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="order-header-right">
                  <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                    {STATUS_ICONS[order.status]} {order.status}
                  </span>
                  <span className="order-total">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="order-item-preview">
                    <img src={item.image} alt={item.name} />
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-meta">Size: {item.selectedSize} · Qty: {item.quantity} · {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="order-more">+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className="order-card-footer">
                <div className="order-address">
                  <span>📍</span> {order.address.city}, {order.address.state}
                </div>
                <Link to={`/order-confirmation/${order.id}`} className="order-details-link">
                  View Details <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
