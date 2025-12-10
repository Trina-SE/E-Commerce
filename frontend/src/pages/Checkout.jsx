import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store/store';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-light)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2 className="text-3xl font-bold text-neutral mb-2">Please log in to checkout</h2>
          <p className="text-neutral-light mb-6">You need to be logged in to place an order</p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-light)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="text-3xl font-bold text-neutral mb-2">Your cart is empty</h2>
          <p className="text-neutral-light mb-6">Add some products to continue</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = 10;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!name || !phone || !address) {
      alert('⚠️ Please fill in all fields');
      return;
    }

    setLoading(true);

    // Create order object
    const order = {
      id: 'ORD-' + Date.now(),
      userId: user.id,
      userName: name,
      phone: phone,
      address: address,
      items: items,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      status: 'Confirmed',
      date: new Date().toISOString(),
    };

    // Save order to localStorage
    try {
      const existingOrders = localStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }

    // Simulate order processing
    setTimeout(() => {
      clearCart();
      alert('✅ Order placed successfully!');
      navigate('/orders');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-light)', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Poppins, sans-serif', color: 'var(--color-neutral)', marginBottom: '2rem', textAlign: 'center' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Order Items */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-neutral)', marginBottom: '1.5rem' }}>
              Your Order
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid var(--color-border)' }}>
              {items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--color-neutral)' }}>{item.productName}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-light)' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-light)' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-light)' }}>Tax (10%)</span>
                <span style={{ fontWeight: '600' }}>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-light)' }}>Shipping</span>
                <span style={{ fontWeight: '600' }}>${shipping.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-neutral)' }}>Total</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Simple Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-neutral)', marginBottom: '1.5rem' }}>
              Delivery Details
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }} style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  style={{ padding: '0.85rem 1rem' }}
                />
              </div>

              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  style={{ padding: '0.85rem 1rem' }}
                />
              </div>

              <div>
                <label>Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  required
                  rows="4"
                  style={{ padding: '0.85rem 1rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}
                >
                  {loading ? '🔄 Processing...' : '✅ Place Order'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn btn-ghost"
                  style={{ padding: '0.9rem 1.5rem' }}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
