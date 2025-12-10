import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = () => {
    try {
      // Get orders from localStorage
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const allOrders = JSON.parse(storedOrders);
        // Filter orders for current user
        const userOrders = allOrders.filter(order => order.userId === user.id);
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-light)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2 className="text-3xl font-bold text-neutral mb-2">Please log in</h2>
          <p className="text-neutral-light mb-6">You need to be logged in to view your orders</p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--color-neutral-light)' }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-light)', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Poppins, sans-serif', color: 'var(--color-neutral)', marginBottom: '2rem' }}>
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 className="text-2xl font-bold text-neutral mb-2">No orders yet</h2>
            <p className="text-neutral-light mb-6">Start shopping to see your order history</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order.id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-neutral)', marginBottom: '0.5rem' }}>
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p style={{ color: 'var(--color-neutral-light)', fontSize: '0.95rem' }}>
                      📅 {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>
                      ${order.total.toFixed(2)}
                    </p>
                    <span style={{ 
                      display: 'inline-block', 
                      background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                      color: 'white',
                      padding: '0.4rem 1rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.85rem', 
                      fontWeight: '700',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      ✅ {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'var(--color-bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-neutral)', marginBottom: '1rem' }}>Order Items</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: 'var(--color-neutral)' }}>{item.productName}</span>
                          <span style={{ color: 'var(--color-neutral-light)', marginLeft: '0.5rem' }}>x{item.quantity}</span>
                        </div>
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-neutral-light)' }}>📍 Delivery Address:</span>
                      <span style={{ fontWeight: '600', textAlign: 'right', maxWidth: '60%' }}>{order.address}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-neutral-light)' }}>📞 Phone:</span>
                      <span style={{ fontWeight: '600' }}>{order.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
