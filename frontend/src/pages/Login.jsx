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
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', padding: '3rem 1rem' }}>
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: 420 }}>
        <h2 className="text-2xl font-bold text-neutral mb-6 text-center">Login</h2>

        {error && <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleLogin} className="" style={{ display: 'grid', gap: '0.9rem' }}>
          <div>
            <label className="" style={{ display: 'block', color: 'var(--color-neutral)', fontWeight: 600, marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className=""
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label className="" style={{ display: 'block', color: 'var(--color-neutral)', fontWeight: 600, marginBottom: 8 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className=""
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center" style={{ color: 'var(--color-neutral)', marginTop: '1rem' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
