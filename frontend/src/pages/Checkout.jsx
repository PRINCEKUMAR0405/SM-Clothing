import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../data/products.js';
import { CheckCircle2, CreditCard, Smartphone, Building2, PackageCheck } from 'lucide-react';
import './Checkout.css';

const STEPS = ['Address', 'Payment', 'Review'];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: <Smartphone size={18} /> },
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
  { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={18} /> },
  { id: 'cod', label: 'Cash on Delivery', icon: <PackageCheck size={18} /> },
];

export default function Checkout() {
  const { items, subtotal, shipping, total, dispatch } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '',
    pincode: '',
    street: '',
    city: '',
    state: '',
  });
  const [payment, setPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressNext = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.pincode || !address.street || !address.city || !address.state) {
      showToast('Please fill all address fields', 'error');
      return;
    }
    setStep(1);
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const orderId = 'SMC' + Date.now().toString().slice(-8);
    // Save to localStorage orders
    const prev = JSON.parse(localStorage.getItem('sm_orders') || '[]');
    prev.push({
      id: orderId,
      date: new Date().toISOString(),
      items: [...items],
      address,
      payment,
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
    });
    localStorage.setItem('sm_orders', JSON.stringify(prev));
    dispatch({ type: 'CLEAR_CART' });
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Stepper */}
            <div className="stepper">
              {STEPS.map((s, i) => (
                <div key={s} className={`step${step === i ? ' active' : step > i ? ' done' : ''}`}>
                  <div className="step-num">
                    {step > i ? <CheckCircle2 size={18} /> : <span>{i + 1}</span>}
                  </div>
                  <span className="step-label">{s}</span>
                  {i < STEPS.length - 1 && <div className="step-connector" />}
                </div>
              ))}
            </div>

            {/* Step 0: Address */}
            {step === 0 && (
              <form className="checkout-form" onSubmit={handleAddressNext}>
                <h2 className="form-section-title">Delivery Address</h2>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit number" maxLength={10} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <textarea value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="House no., Building, Street…" rows={2} required />
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit pincode" maxLength={6} required />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required>
                      <option value="">Select State</option>
                      {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Other'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary checkout-next-btn">Continue to Payment</button>
              </form>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <form className="checkout-form" onSubmit={handlePaymentNext}>
                <h2 className="form-section-title">Payment Method</h2>
                <div className="payment-options">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.id} className={`payment-option${payment === m.id ? ' selected' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={(e) => setPayment(e.target.value)} />
                      <span className="pm-icon">{m.icon}</span>
                      <span className="pm-label">{m.label}</span>
                    </label>
                  ))}
                </div>
                {payment === 'upi' && (
                  <div className="form-group" style={{ marginTop: 16 }}>
                    <label>UPI ID</label>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
                  </div>
                )}
                {payment === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group"><label>Expiry</label><input type="text" placeholder="MM/YY" maxLength={5} /></div>
                      <div className="form-group"><label>CVV</label><input type="password" placeholder="•••" maxLength={4} /></div>
                    </div>
                    <div className="form-group"><label>Name on Card</label><input type="text" placeholder="As on card" /></div>
                  </div>
                )}
                <div className="checkout-step-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button type="submit" className="btn btn-primary checkout-next-btn">Review Order</button>
                </div>
              </form>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="checkout-form">
                <h2 className="form-section-title">Review Your Order</h2>
                <div className="review-section">
                  <div className="review-block">
                    <div className="review-block-header">
                      <h4>Deliver To</h4>
                      <button className="review-edit" onClick={() => setStep(0)}>Edit</button>
                    </div>
                    <p className="review-address-name">{address.name} · {address.phone}</p>
                    <p className="review-address-detail">{address.street}, {address.city}, {address.state} – {address.pincode}</p>
                  </div>
                  <div className="review-block">
                    <div className="review-block-header">
                      <h4>Payment</h4>
                      <button className="review-edit" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p>{PAYMENT_METHODS.find((m) => m.id === payment)?.label}</p>
                  </div>
                </div>
                <div className="review-items">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div className="review-item-info">
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-meta">Size: {item.selectedSize} · Colour: {item.selectedColor} · Qty: {item.quantity}</p>
                      </div>
                      <p className="review-item-price">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="checkout-step-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary checkout-next-btn" onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? 'Placing Order…' : `Place Order · ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="checkout-summary">
            <h3>Price Details</h3>
            <div className="summary-row"><span>Price ({items.length} items)</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Delivery</span><span style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="checkout-summary-divider" />
            <div className="summary-row checkout-total"><span>Total Amount</span><span>{formatPrice(total)}</span></div>
            {subtotal > 0 && (
              <p className="checkout-saving">
                You save {formatPrice(items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0))} on this order 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
