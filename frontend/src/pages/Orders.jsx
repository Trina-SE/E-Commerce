import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';
import { orderService } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders(user.id);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to view orders</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className="text-3xl font-bold text-neutral mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center" style={{ color: 'var(--color-neutral)' }}>No orders yet</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Order #{order._id}</h3>
                  <p style={{ color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>${order.totalAmount.toFixed(2)}</p>
                  <span style={{ display: 'inline-block', background: '#eff6ff', color: '#1e3a8a', padding: '0.25rem 0.6rem', borderRadius: 9999, fontSize: '0.85rem', fontWeight: 600 }}>{order.status}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0' }}>
                    <span>{item.productName}</span>
                    <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
