import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Left side — branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        borderRight: '1px solid #1e1e1e',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: '#6366f1',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: '800' }}>P</span>
            </div>
            <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>ProjectFlow</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#4a4a4a', fontFamily: 'monospace', marginBottom: '16px' }}>
            // manage your projects
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '16px' }}>
            Ship faster.<br />
            <span style={{ color: '#6366f1' }}>Stay aligned.</span>
          </div>
          <div style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.6' }}>
            Project management powered by AI. <br />
            Track tasks, manage teams, ship on time.
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#2a2a2a', fontFamily: 'monospace' }}>
          // v2.0 — powered by Claude AI
        </div>
      </div>

      {/* Right side — form */}
      <div style={{
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}>
        <div style={{ width: '100%' }}>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
              Welcome back
            </div>
            <div style={{ fontSize: '13px', color: '#4a4a4a' }}>
              Sign in to your workspace
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', fontSize: '13px',
              borderRadius: '10px', padding: '12px 16px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#888', marginBottom: '8px',
              }}>
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', background: '#111',
                  border: '1px solid #1e1e1e', borderRadius: '10px',
                  padding: '12px 16px', fontSize: '14px', color: '#fff',
                  fontFamily: 'Inter, sans-serif', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#888', marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%', background: '#111',
                  border: '1px solid #1e1e1e', borderRadius: '10px',
                  padding: '12px 16px', fontSize: '14px', color: '#fff',
                  fontFamily: 'Inter, sans-serif', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#3730a3' : '#6366f1',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontSize: '14px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#4a4a4a', marginTop: '24px' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
              Create one →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;