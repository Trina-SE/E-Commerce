import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../store/store';
import { useCartStore } from '../store/store';

export default function Navbar() {
  const { user, logout, token } = useAuthStore();
  const { items } = useCartStore();

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">🛍️ EcomStore</Link>

        <div className="nav-search">
          <input type="text" placeholder="Search products, brands, or categories..." />
        </div>

        <div className="nav-actions">
          {token ? (
            <>
              <Link to="/orders">📦 Orders</Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUser /> {user?.name}
              </Link>
              <button onClick={logout} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
                <FiLogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</Link>
            </>
          )}

          <Link to="/cart" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', padding: '0.5rem' }}>
            <FiShoppingCart size={22} style={{ color: 'var(--color-neutral)' }} />
            {items.length > 0 && (
              <span className="cart-badge">{items.length}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
