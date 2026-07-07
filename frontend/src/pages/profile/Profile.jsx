import { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });
  const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(''); setError('');
    try {
      const res = await api.put('/profile', form);
      setUser(res.data);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
    setSaving(false);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    setSuccess(''); setError('');
    try {
      await api.put('/profile/password', passwords);
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
      setSuccess('Password updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
    setSavingPw(false);
  };

  const inputStyle = {
    width: '100%', background: '#0f0f0f', border: '1px solid #1e1e1e',
    borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
    color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: '500',
    color: '#4a4a4a', marginBottom: '6px',
  };

  return (
    <Layout title="Profile">

      <div style={{ maxWidth: '600px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Account settings</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>Profile</div>
        </div>

        {/* Avatar + name */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '56px', height: '56px', background: '#6366f1',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: '#fff',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: '#4a4a4a', marginTop: '2px' }}>{user?.email}</div>
              <div style={{
                display: 'inline-block', marginTop: '6px',
                fontSize: '10px', fontWeight: '600',
                padding: '2px 8px', borderRadius: '4px',
                background: user?.role === 'admin' ? 'rgba(99,102,241,0.15)' : '#1a1a1a',
                color: user?.role === 'admin' ? '#6366f1' : '#4a4a4a',
              }}>
                {user?.role}
              </div>
            </div>
          </div>

          {success && (
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '12px', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '12px', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Full name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Bio</label>
              <textarea value={form.bio} rows={3}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>
            <button type="submit" disabled={saving}
              style={{ padding: '10px 20px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Change password</div>
          <form onSubmit={handleSavePassword}>
            {[
              { label: 'Current password', key: 'current_password' },
              { label: 'New password', key: 'password' },
              { label: 'Confirm new password', key: 'password_confirmation' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>{f.label}</label>
                <input type="password" required value={passwords[f.key]}
                  onChange={e => setPasswords({ ...passwords, [f.key]: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                />
              </div>
            ))}
            <button type="submit" disabled={savingPw}
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: '6px' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
            >
              {savingPw ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
}