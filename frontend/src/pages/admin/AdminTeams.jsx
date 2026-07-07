import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/admin/teams');
      setTeams(res.data);
    } catch (err) {}
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/teams', form);
      setTeams([res.data, ...teams]);
      setShowModal(false);
      setForm({ name: '', description: '' });
    } catch (err) {}
    setCreating(false);
  };

  const handleDelete = async (teamId) => {
    if (!confirm('Delete this team?')) return;
    try {
      await api.delete(`/teams/${teamId}`);
      setTeams(teams.filter(t => t.id !== teamId));
    } catch (err) {}
  };

  const inputStyle = {
    width: '100%', background: '#0f0f0f', border: '1px solid #1e1e1e',
    borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
    color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  if (loading) return (
    <Layout title="Teams">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Teams">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Admin</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Teams <span style={{ color: '#6366f1' }}>{teams.length}</span>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: '8px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          + New Team
        </button>
      </div>

      {/* Teams grid */}
      {teams.length === 0 ? (
        <div style={{ color: '#4a4a4a', fontSize: '13px' }}>No teams yet</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {teams.map(team => (
            <div key={team.id} style={{
              background: '#111', border: '1px solid #1e1e1e',
              borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>
                  👥
                </div>
                <button onClick={() => handleDelete(team.id)}
                  style={{ background: 'none', border: 'none', color: '#4a4a4a', fontSize: '12px', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#ef4444'}
                  onMouseLeave={e => e.target.style.color = '#4a4a4a'}
                >
                  delete
                </button>
              </div>

              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                {team.name}
              </div>
              <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '12px' }}>
                {team.description || 'No description'}
              </div>
              <div style={{ fontSize: '11px', color: '#4a4a4a' }}>
                {team.members_count || 0} members · by {team.creator?.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderRadius: '14px', padding: '28px',
            width: '100%', maxWidth: '440px', position: 'relative',
          }}>
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: '#1a1a1a', border: '1px solid #1e1e1e',
              borderRadius: '6px', width: '28px', height: '28px',
              color: '#4a4a4a', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>

            <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>New Team</div>
            <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '24px' }}>Create a new team</div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#4a4a4a', marginBottom: '6px' }}>Team name</label>
                <input type="text" required placeholder="e.g. Dev Team"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#4a4a4a', marginBottom: '6px' }}>Description</label>
                <textarea placeholder="What does this team do?" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#4a4a4a', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  style={{ padding: '10px 20px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {creating ? 'Creating...' : 'Create team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}