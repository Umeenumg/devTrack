import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function ProjectsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', team_id: '', status: 'active', deadline: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'admin') fetchTeams();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {}
    setLoading(false);
  };

  const fetchTeams = async () => {
    try {
      const res = await api.get('/admin/teams');
      setTeams(res.data);
    } catch (err) {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await api.post('/projects', form);
      setProjects([res.data, ...projects]);
      setShowModal(false);
      setForm({ title: '', description: '', team_id: '', status: 'active', deadline: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
    setCreating(false);
  };

  const statusColor = (s) => {
    if (s === 'active') return '#a3e635';
    if (s === 'completed') return '#fff';
    return '#555';
  };

  if (loading) return (
    <Layout title="Projects">
      <div style={{ color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>// loading...</div>
    </Layout>
  );

  return (
    <Layout title="Projects">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace', marginBottom: '4px' }}>
            // all projects
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            Projects <span style={{ color: '#a3e635' }}>{projects.length} total</span>
          </div>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '8px 16px', background: '#a3e635',
              border: 'none', borderRadius: '8px',
              color: '#000', fontSize: '12px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}
          >
            + New Project
          </button>
        )}
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div style={{ color: '#444', fontFamily: 'monospace', fontSize: '12px' }}>// no projects yet</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{
                background: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '20px',
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#a3e635'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1f1f1f'}
            >
              {/* Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', background: '#1a1a1a',
                  border: '1px solid #2a2a2a', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  📁
                </div>
                <span style={{
                  fontSize: '9px', fontWeight: '700',
                  color: project.status === 'active' ? '#000' : '#555',
                  background: project.status === 'active' ? '#a3e635' : '#1a1a1a',
                  padding: '3px 8px', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {project.status}
                </span>
              </div>

              {/* Title */}
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                {project.title}
              </div>
              <div style={{ fontSize: '11px', color: '#444', marginBottom: '12px', fontFamily: 'monospace' }}>
                {project.team?.name || 'No team'}
              </div>

              {/* Description */}
              {project.description && (
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px', lineHeight: '1.5' }}>
                  {project.description.length > 80
                    ? project.description.slice(0, 80) + '...'
                    : project.description}
                </div>
              )}

              {/* Progress bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px' }}>
                  <div style={{
                    height: '2px', background: '#a3e635', borderRadius: '2px',
                    width: project.status === 'completed' ? '100%' : project.status === 'active' ? '50%' : '20%',
                  }} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#444' }}>
                  {project.tasks_count} tasks
                </span>
                {project.deadline && (
                  <span style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>
                    {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

 {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            background: '#111', border: '1px solid #222',
            borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '560px',
            position: 'relative',
          }}>

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: '6px', width: '28px', height: '28px',
                color: '#555', cursor: 'pointer', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>

            {/* Title */}
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

            <form onSubmit={handleCreate}>

              {/* Project Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SaaS Dashboard"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#a3e635'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>

              {/* Client + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Team
                  </label>
                  <select
                    required
                    value={form.team_id}
                    onChange={e => setForm({ ...form, team_id: e.target.value })}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: form.team_id ? '#fff' : '#555', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="">Select team...</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
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
                    type="date"
                    value={form.start_date || ''}
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
                    type="date"
                    value={form.deadline}
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
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '11px 24px', background: 'transparent',
                    border: '1px solid #2a2a2a', borderRadius: '8px',
                    color: '#555', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '11px 24px', background: '#a3e635',
                    border: 'none', borderRadius: '8px',
                    color: '#000', fontSize: '13px', fontWeight: '700',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}
                >
                  {creating ? 'Creating...' : 'Create Project →'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default ProjectsList;