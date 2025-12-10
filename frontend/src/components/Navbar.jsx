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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="nav-logo">EcomStore</Link>
        </div>

        <div className="nav-search">
          <input type="text" placeholder="Search products, brands or categories" />
        </div>

        <div className="nav-actions">
          {token ? (
            <>
              <Link to="/orders" style={{ color: 'var(--color-neutral)' }}>Orders</Link>
              <Link to="/profile" style={{ color: 'var(--color-neutral)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiUser /> {user?.name}
              </Link>
              <button onClick={logout} className="btn btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--color-neutral)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}

          <Link to="/cart" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <FiShoppingCart size={20} />
            {items.length > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', width: 20, height: 20, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
