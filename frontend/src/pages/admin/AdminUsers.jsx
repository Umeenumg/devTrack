import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    setUpdating(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) { }
    setUpdating(null);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) { }
  };

  if (loading) return (
    <Layout title="Users">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Users">

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Admin</div>
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
          Users <span style={{ color: '#6366f1' }}>{users.length}</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 200px 120px 140px',
          padding: '10px 16px', borderBottom: '1px solid #1e1e1e',
          fontSize: '11px', color: '#4a4a4a', fontWeight: '500',
        }}>
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Actions</span>
        </div>

        {users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#4a4a4a' }}>
            No users found
          </div>
        ) : (
          users.map(u => (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 200px 120px 140px',
              padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
              alignItems: 'center',
            }}>

              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: u.role === 'admin' ? '#6366f1' : '#1e1e1e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700',
                  color: u.role === 'admin' ? '#fff' : '#4a4a4a',
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{u.name}</span>
              </div>

              {/* Email */}
              <span style={{ fontSize: '12px', color: '#4a4a4a' }}>{u.email}</span>

              {/* Role */}
              <div>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                  disabled={updating === u.id}
                  style={{
                    background: '#0f0f0f', border: '1px solid #1e1e1e',
                    borderRadius: '6px', padding: '5px 10px',
                    fontSize: '12px', color: u.role === 'admin' ? '#6366f1' : '#888',
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Actions */}
              <div>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{
                    padding: '5px 12px', background: 'transparent',
                    border: '1px solid #1e1e1e', borderRadius: '6px',
                    color: '#4a4a4a', fontSize: '12px', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#4a4a4a'; }}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </Layout>
  );
}