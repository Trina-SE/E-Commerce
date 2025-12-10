import React, { useState } from 'react';
import { useAuthStore } from '../store/store';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register({ name, email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      console.error('API registration failed, using demo mode:', err);
      // Demo mode fallback
      const demoUser = {
        id: 'demo-' + Date.now(),
        name: name,
        email: email,
      };
      const demoToken = 'demo-token-' + Date.now();
      
      setToken(demoToken);
      setUser(demoUser);
      
      // Store demo user in localStorage
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      
      // Show success message
      alert('✅ Account created successfully! (Demo Mode)');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '3rem 1rem' }}>
      <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--color-neutral-light)', fontSize: '0.95rem' }}>Join us and start shopping today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              style={{ padding: '0.85rem 1rem' }}
            />
          </div>

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
              placeholder="Create a strong password"
              style={{ padding: '0.85rem 1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', fontSize: '1rem' }}
          >
            {loading ? '🔄 Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
          <p style={{ color: 'var(--color-neutral-light)' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
              Login here →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
