import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Layout title="Project">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  if (!project) return null;

  const tasks = project.tasks || [];
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const totalSegments = 20;
  const filledSegments = Math.round((progress / 100) * totalSegments);

  const priorityColor = (p) => {
    if (p === 'high') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };
    if (p === 'medium') return { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' };
    return { bg: '#1a1a1a', color: '#4a4a4a' };
  };

  const statusConfig = {
    active: { label: 'ACTIVE', bg: 'rgba(99,102,241,0.15)', color: '#6366f1' },
    on_hold: { label: 'HOLD', bg: 'rgba(255,255,255,0.06)', color: '#888' },
    completed: { label: 'DONE', bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  };

  const status = statusConfig[project.status] || statusConfig.active;

  const groupedTasks = {
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    todo: tasks.filter(t => t.status === 'todo'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <Layout title={project.title}>

      {/* Back */}
      <button onClick={() => navigate('/projects')}
        style={{ background: 'none', border: 'none', color: '#4a4a4a', fontSize: '12px', cursor: 'pointer', marginBottom: '16px', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
        ← Projects
      </button>

      {/* Header */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          // Project Details
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
            }}>
              🚀
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
                {project.title}
              </div>
              <span style={{
                fontSize: '10px', fontWeight: '700',
                padding: '3px 10px', borderRadius: '20px',
                background: status.bg, color: status.color,
              }}>
                • {status.label}
              </span>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '7px 14px', background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)', borderRadius: '7px',
                color: '#6366f1', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                ✎ Edit
              </button>
            </div>
          )}
        </div>

        {project.description && (
          <div style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.6', marginTop: '12px' }}>
            {project.description}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'SPRINT PROGRESS', value: `${progress}%`, color: '#6366f1' },
          { label: 'OPEN TASKS', value: todo + inProgress, color: '#fff' },
          { label: 'COMPLETED', value: done, color: '#22c55e' },
          { label: 'IN PROGRESS', value: inProgress, color: '#fff' },
          { label: 'TEAM', value: project.team?.name || '—', color: '#fff', small: true },
        ].map(s => (
          <div key={s.label} style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderRadius: '10px', padding: '16px',
          }}>
            <div style={{ fontSize: s.small ? '13px' : '24px', fontWeight: '800', color: s.color, marginBottom: '4px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '10px', color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '12px' }}>

        {/* Left */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '12px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '4px' }}>
            {['tasks', 'overview'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '8px', background: activeTab === tab ? '#1e1e1e' : 'transparent',
                  border: 'none', borderRadius: '7px',
                  color: activeTab === tab ? '#fff' : '#4a4a4a',
                  fontSize: '12px', fontWeight: activeTab === tab ? '600' : '400',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tasks tab */}
          {activeTab === 'tasks' && (
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>

              {/* Tasks header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #1e1e1e' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>
                  TASKS <span style={{ color: '#4a4a4a', fontWeight: '400' }}>{total}</span>
                </span>
                {user?.role === 'admin' && (
                  <button style={{
                    padding: '5px 12px', background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px',
                    color: '#6366f1', fontSize: '11px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                    + Add Task
                  </button>
                )}
              </div>

              {total === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#4a4a4a' }}>
                  No tasks yet
                </div>
              ) : (
                Object.entries(groupedTasks).map(([status, statusTasks]) => {
                  if (statusTasks.length === 0) return null;
                  const statusLabels = { in_progress: 'IN PROGRESS', todo: 'TODO', done: 'DONE' };
                  const statusColors = { in_progress: '#fff', todo: '#4a4a4a', done: '#6366f1' };

                  return (
                    <div key={status}>
                      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: statusColors[status], letterSpacing: '1px' }}>
                          ⚡ {statusLabels[status]}
                        </span>
                        <span style={{ fontSize: '10px', color: '#4a4a4a' }}>{statusTasks.length}</span>
                      </div>
                      {statusTasks.map(task => {
                        const pc = priorityColor(task.priority);
                        return (
                          <div
                            key={task.id}
                            onClick={() => navigate(`/tasks/${task.id}`)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '10px 16px', borderBottom: '1px solid #1a1a1a',
                              cursor: 'pointer', transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '18px', height: '18px', borderRadius: '4px',
                                border: `1px solid ${task.status === 'done' ? '#6366f1' : '#2a2a2a'}`,
                                background: task.status === 'done' ? 'rgba(99,102,241,0.15)' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '10px', color: '#6366f1', flexShrink: 0,
                              }}>
                                {task.status === 'done' ? '✓' : ''}
                              </div>
                              <div>
                                <div style={{
                                  fontSize: '13px', fontWeight: '500',
                                  color: task.status === 'done' ? '#4a4a4a' : '#fff',
                                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                                }}>
                                  {task.title}
                                </div>
                                {task.assignee && (
                                  <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '1px' }}>
                                    {task.assignee.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontSize: '10px', fontWeight: '600',
                                padding: '2px 8px', borderRadius: '4px',
                                background: pc.bg, color: pc.color,
                                textTransform: 'uppercase',
                              }}>
                                {task.priority}
                              </span>
                              {task.due_date && (
                                <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
                                  {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.7' }}>
                {project.description || 'No description provided.'}
              </div>
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Team', value: project.team?.name },
                  { label: 'Created by', value: project.creator?.name },
                  { label: 'Status', value: project.status },
                  { label: 'Deadline', value: project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Sprint progress */}
        <div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              // Sprint Progress
            </div>

            {/* Circle progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e1e1e" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{progress}%</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {[
              { label: 'Open', value: todo + inProgress, color: '#fff' },
              { label: 'Done', value: done, color: '#6366f1' },
              { label: 'Total', value: total, color: '#4a4a4a' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#4a4a4a' }}>{s.label}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: s.color }}>{s.value}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '16px', marginTop: '6px' }}>
              <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '8px' }}>Tasks</div>
              {/* Segmented bar */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: totalSegments }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: '4px', borderRadius: '2px',
                    background: i < filledSegments ? '#6366f1' : '#1e1e1e',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', marginTop: '6px', textAlign: 'right' }}>
                {progress}%
              </div>
            </div>

            {project.deadline && (
              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '14px', marginTop: '6px' }}>
                <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Deadline
                </div>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>
                  {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}