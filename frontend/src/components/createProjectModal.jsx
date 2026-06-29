import { useState, useEffect } from 'react';
import api from '../api/axios';

function CreateProjectModal({ onClose, onCreated }) {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', team_id: '', status: 'active', deadline: '', start_date: '' });
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

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '24px',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#111', border: '1px solid #222',
        borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '560px',
        position: 'relative',
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '6px', width: '28px', height: '28px',
          color: '#555', cursor: 'pointer', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          New Project
        </div>
        <div style={{ fontSize: '11px', color: '#555', fontFamily: 'monospace', marginBottom: '24px' }}>
          // spin up a new workspace
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '12px', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Project Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Project Name
            </label>
            <input
              type="text" required placeholder="e.g. SaaS Dashboard"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#a3e635'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>

          {/* Team + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                Team
              </label>
              <select
                required value={form.team_id}
                onChange={e => setForm({ ...form, team_id: e.target.value })}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: form.team_id ? '#fff' : '#555', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="">Select team...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Start Date + Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                Start Date
              </label>
              <input
                type="date" value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor = '#a3e635'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                Deadline
              </label>
              <input
                type="date" value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor = '#a3e635'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              placeholder="What is this project about?"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#a3e635'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '11px 24px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={creating}
              style={{ padding: '11px 24px', background: '#a3e635', border: 'none', borderRadius: '8px', color: '#000', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              {creating ? 'Creating...' : 'Create Project →'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;