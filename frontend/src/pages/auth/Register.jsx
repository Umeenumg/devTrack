import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', fontFamily: 'Inter, sans-serif',
    }}>

      {/* Left side */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px',
        borderRight: '1px solid #1e1e1e',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '16px', fontWeight: '800' }}>P</span>
          </div>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>ProjectFlow</span>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#4a4a4a', fontFamily: 'monospace', marginBottom: '16px' }}>
            // join your team
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '16px' }}>
            Start shipping.<br />
            <span style={{ color: '#6366f1' }}>Together.</span>
          </div>
          <div style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.6' }}>
            Create your account and join<br />your team's workspace.
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#2a2a2a', fontFamily: 'monospace' }}>
          // v2.0 — powered by Claude AI
        </div>
      </div>

      {/* Right side */}
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%' }}>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
              Create account
            </div>
            <div style={{ fontSize: '13px', color: '#4a4a4a' }}>
              Fill in your details to get started
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#888', marginBottom: '8px' }}>
                Full name
              </label>
              <input
                type="text" required placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#888', marginBottom: '8px' }}>
                Email address
              </label>
              <input
                type="email" required placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#888', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password" required placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#888', marginBottom: '8px' }}>
                Confirm password
              </label>
              <input
                type="password" required placeholder="••••••••"
                value={form.password_confirmation}
                onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Button */}
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#3730a3' : '#6366f1', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>

          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#4a4a4a', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
              Sign in →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;