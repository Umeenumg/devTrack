import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CreateProjectModal({ onClose, onCreated }) {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', team_id: '', status: 'active', deadline: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/teams').then(res => setTeams(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await api.post('/projects', form);
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
    setCreating(false);
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
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '24px',
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{
        background: '#111', border: '1px solid #1e1e1e',
        borderRadius: '14px', padding: '28px',
        width: '100%', maxWidth: '520px', position: 'relative',
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: '#1a1a1a', border: '1px solid #1e1e1e',
          borderRadius: '6px', width: '28px', height: '28px',
          color: '#4a4a4a', cursor: 'pointer', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
          New Project
        </div>
        <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '24px' }}>
          Create a new project for your team
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '12px', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Project name</label>
            <input type="text" required placeholder="e.g. E-Commerce Platform"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Team</label>
              <select required value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })}
                style={{ ...inputStyle, color: form.team_id ? '#fff' : '#4a4a4a' }}>
                <option value="">Select team...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Description</label>
            <textarea placeholder="What is this project about?" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', background: 'transparent', border: '1px solid #1e1e1e',
              borderRadius: '8px', color: '#4a4a4a', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>Cancel</button>
            <button type="submit" disabled={creating} style={{
              padding: '10px 20px', background: '#6366f1', border: 'none',
              borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              {creating ? 'Creating...' : 'Create project'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}