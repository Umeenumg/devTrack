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
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>

      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Card */}
        <div style={{ background: '#111111', border: '1px solid #222', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid #1f1f1f' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#a3e635', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Project Manager
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '32px' }}>

            <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              Sign In
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#ccc', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#a3e635'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#ccc', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#a3e635'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>

              {/* Remember + Forgot */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    style={{ width: '14px', height: '14px', accentColor: '#a3e635', cursor: 'pointer' }}
                  />
                  Remember me
                </label>
                <span style={{ fontSize: '12px', color: '#a3e635', cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#5a7a1a' : '#a3e635',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '20px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>

            </form>

            {/* Footer */}
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#444' }}>
              No account?{' '}
              <Link to="/register" style={{ color: '#a3e635', fontWeight: '700', textDecoration: 'none' }}>
                Create one →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;