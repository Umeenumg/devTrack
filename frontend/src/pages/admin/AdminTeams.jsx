import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        api.get('/admin/teams'),
        api.get('/admin/users'),
      ]);
      setTeams(teamsRes.data);
      setUsers(usersRes.data);
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
      if (selectedTeam?.id === teamId) setSelectedTeam(null);
    } catch (err) {}
  };

  const handleSelectTeam = async (team) => {
    try {
      const res = await api.get(`/teams/${team.id}`);
      setSelectedTeam(res.data);
    } catch (err) {}
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    setAddingMember(true);
    try {
      await api.post(`/teams/${selectedTeam.id}/members`, { user_id: selectedUserId });
      const res = await api.get(`/teams/${selectedTeam.id}`);
      setSelectedTeam(res.data);
      setSelectedUserId('');
    } catch (err) {}
    setAddingMember(false);
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/teams/${selectedTeam.id}/members`, { data: { user_id: userId } });
      const res = await api.get(`/teams/${selectedTeam.id}`);
      setSelectedTeam(res.data);
    } catch (err) {}
  };

  const inputStyle = {
    width: '100%', background: '#0f0f0f', border: '1px solid #1e1e1e',
    borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
    color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  const availableUsers = users.filter(u =>
    !selectedTeam?.members?.some(m => m.id === u.id)
  );

  if (loading) return (
    <Layout title="Teams">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Teams">

      <div style={{ display: 'grid', gridTemplateColumns: selectedTeam ? '1fr 1fr' : '1fr', gap: '16px' }}>

        {/* Left — Teams list */}
        <div>

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

          {/* Teams */}
          {teams.length === 0 ? (
            <div style={{ color: '#4a4a4a', fontSize: '13px' }}>No teams yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {teams.map(team => (
                <div
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  style={{
                    background: '#111',
                    border: `1px solid ${selectedTeam?.id === team.id ? '#6366f1' : '#1e1e1e'}`,
                    borderRadius: '12px', padding: '16px',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                  onMouseEnter={e => { if (selectedTeam?.id !== team.id) e.currentTarget.style.borderColor = '#333'; }}
                  onMouseLeave={e => { if (selectedTeam?.id !== team.id) e.currentTarget.style.borderColor = '#1e1e1e'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    }}>
                      👥
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{team.name}</div>
                      <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '2px' }}>
                        {team.members_count || 0} members · by {team.creator?.name}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(team.id); }}
                    style={{ background: 'none', border: 'none', color: '#4a4a4a', fontSize: '12px', cursor: 'pointer', padding: '4px 8px' }}
                    onMouseEnter={e => e.target.style.color = '#ef4444'}
                    onMouseLeave={e => e.target.style.color = '#4a4a4a'}
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Team detail */}
        {selectedTeam && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Team</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{selectedTeam.name}</div>
              </div>
              <button onClick={() => setSelectedTeam(null)}
                style={{ background: 'none', border: '1px solid #1e1e1e', borderRadius: '6px', color: '#4a4a4a', fontSize: '12px', cursor: 'pointer', padding: '5px 10px' }}>
                ✕ Close
              </button>
            </div>

            {/* Add member */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>Add Member</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  style={{ flex: 1, background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: selectedUserId ? '#fff' : '#4a4a4a', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                >
                  <option value="">Select user...</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUserId || addingMember}
                  style={{
                    padding: '10px 16px', background: '#6366f1', border: 'none',
                    borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600',
                    cursor: !selectedUserId ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif', opacity: !selectedUserId ? 0.5 : 1,
                  }}
                >
                  {addingMember ? '...' : 'Add'}
                </button>
              </div>
            </div>

            {/* Members list */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e1e', fontSize: '12px', fontWeight: '600', color: '#fff' }}>
                Members <span style={{ color: '#6366f1' }}>{selectedTeam.members?.length || 0}</span>
              </div>

              {!selectedTeam.members || selectedTeam.members.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: '#4a4a4a' }}>
                  No members yet
                </div>
              ) : (
                selectedTeam.members.map(member => (
                  <div key={member.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '7px',
                        background: member.role === 'admin' ? '#6366f1' : '#1e1e1e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '700',
                        color: member.role === 'admin' ? '#fff' : '#4a4a4a',
                      }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: '#4a4a4a' }}>{member.email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '600',
                        padding: '2px 8px', borderRadius: '4px',
                        background: member.pivot?.role === 'admin' ? 'rgba(99,102,241,0.15)' : '#1a1a1a',
                        color: member.pivot?.role === 'admin' ? '#6366f1' : '#4a4a4a',
                      }}>
                        {member.pivot?.role || 'member'}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        style={{ background: 'none', border: 'none', color: '#4a4a4a', fontSize: '11px', cursor: 'pointer' }}
                        onMouseEnter={e => e.target.style.color = '#ef4444'}
                        onMouseLeave={e => e.target.style.color = '#4a4a4a'}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
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