import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ProjectsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getProgress = (project) => {
    if (!project.tasks || project.tasks_count === 0) return 0;
    return project.status === 'completed' ? 100 : project.status === 'active' ? 55 : 20;
  };

  const statusConfig = {
    active: { label: 'ACTIVE', bg: 'rgba(99,102,241,0.15)', color: '#6366f1' },
    on_hold: { label: 'HOLD', bg: 'rgba(255,255,255,0.06)', color: '#888' },
    completed: { label: 'DONE', bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  };

  if (loading) return (
    <Layout title="Projects">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Projects">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Workspace</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Projects{' '}
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#4a4a4a', background: '#1a1a1a', padding: '2px 10px', borderRadius: '20px', marginLeft: '4px' }}>
              {projects.length} total
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div style={{ color: '#4a4a4a', fontSize: '13px' }}>No projects yet</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {projects.map(project => {
            const progress = getProgress(project);
            const status = statusConfig[project.status] || statusConfig.active;
            const totalSegments = 20;
            const filledSegments = Math.round((progress / 100) * totalSegments);

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{
                  background: '#111', border: '1px solid #1e1e1e',
                  borderRadius: '12px', padding: '20px',
                  cursor: 'pointer', transition: 'border-color 0.15s',
                  display: 'flex', flexDirection: 'column', gap: '0',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.15)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                    }}>
                      📁
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>
                        {project.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4a4a4a' }}>
                        {project.team?.name || 'No team'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    padding: '3px 8px', borderRadius: '4px',
                    background: status.bg, color: status.color,
                    letterSpacing: '0.5px',
                  }}>
                    {status.label}
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <div style={{ fontSize: '12px', color: '#4a4a4a', lineHeight: '1.5', marginBottom: '16px', flex: 1 }}>
                    {project.description.length > 90
                      ? project.description.slice(0, 90) + '...'
                      : project.description}
                  </div>
                )}

                {/* Segmented progress bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                    {Array.from({ length: totalSegments }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: '4px', borderRadius: '2px',
                        background: i < filledSegments ? '#6366f1' : '#1e1e1e',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
                      {project.tasks_count || 0} tasks
                    </span>
                    <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600' }}>
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '12px', borderTop: '1px solid #1a1a1a', marginTop: '4px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Team avatar */}
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '6px',
                      background: '#6366f1', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff',
                    }}>
                      {project.creator?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
                      {project.tasks_count || 0} open
                    </span>
                  </div>
                  {project.deadline && (
                    <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
                      {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}