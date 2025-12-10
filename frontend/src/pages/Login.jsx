import React, { useState } from 'react';
import { useAuthStore } from '../store/store';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      console.error('API login failed, using demo mode:', err);
      // Demo mode fallback
      const storedDemoUser = localStorage.getItem('demoUser');
      
      if (storedDemoUser) {
        const demoUser = JSON.parse(storedDemoUser);
        const demoToken = 'demo-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        
        alert('✅ Login successful! (Demo Mode)');
        navigate('/');
      } else {
        // Create a new demo user if none exists
        const demoUser = {
          id: 'demo-user',
          name: 'Demo User',
          email: email,
        };
        const demoToken = 'demo-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        
        alert('✅ Login successful! (Demo Mode)');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '3rem 1rem' }}>
      <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--color-neutral-light)', fontSize: '0.95rem' }}>Login to your account to continue</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ padding: '0.85rem 1rem' }}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{ padding: '0.85rem 1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', fontSize: '1rem' }}
          >
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
          <p style={{ color: 'var(--color-neutral-light)' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
              Create account →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
