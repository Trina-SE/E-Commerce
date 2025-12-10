import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/store';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-light)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="text-3xl font-bold text-neutral mb-2">Your cart is empty</h2>
          <p className="text-neutral-light mb-6">Add some amazing products to get started</p>
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-light)', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Poppins, sans-serif', color: 'var(--color-neutral)', marginBottom: '2rem' }}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '2rem' }}>
          <div className="lg:col-span-2">
            <div className="card" style={{ padding: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}
                  className="last:border-b-0"
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '600', color: 'var(--color-neutral)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.productName}</h3>
                    <p style={{ color: 'var(--color-neutral-light)', fontSize: '1rem' }}>${item.price.toFixed(2)}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, parseInt(e.target.value))
                      }
                      style={{ width: '70px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', textAlign: 'center', fontWeight: '600' }}
                    />
                    <p style={{ minWidth: '100px', textAlign: 'right', fontWeight: '700', fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="icon-btn"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-neutral)', marginBottom: '1.5rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-light)' }}>Subtotal</span>
                <span style={{ fontWeight: '600', color: 'var(--color-neutral)' }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-light)' }}>Tax (10%)</span>
                <span style={{ fontWeight: '600', color: 'var(--color-neutral)' }}>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-light)' }}>Shipping</span>
                <span style={{ fontWeight: '600', color: 'var(--color-neutral)' }}>$10.00</span>
              </div>
            </div>
            <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: 'var(--color-neutral)', fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontWeight: '800', fontSize: '1.75rem', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  ${(total * 1.1 + 10).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '0.75rem', padding: '0.9rem' }}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="btn btn-ghost w-full"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
