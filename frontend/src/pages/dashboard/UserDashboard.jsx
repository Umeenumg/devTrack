import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#4a4a4a' },
  { id: 'in_progress', label: 'In Progress', color: '#6366f1' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total_tasks: 0, done: 0, inProgress: 0, todo: 0, total_projects: 0, progress: 0 });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
      ]);
      const t = tasksRes.data;
      const done = t.filter(x => x.status === 'done').length;
      const inProgress = t.filter(x => x.status === 'in_progress').length;
      const todo = t.filter(x => x.status === 'todo').length;
      setTasks(t);
      setProjects(projectsRes.data);
      setStats({
        total_tasks: t.length, done, inProgress, todo,
        total_projects: projectsRes.data.length,
        progress: t.length > 0 ? Math.round((done / t.length) * 100) : 0,
      });
    } catch (err) {}
    setLoading(false);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Kanban
  const filteredTasks = selectedProject === 'all' ? tasks : tasks.filter(t => t.project_id === parseInt(selectedProject));
  const getColumnTasks = (status) => filteredTasks.filter(t => t.status === status);

  const handleDragStart = (e, task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOver(columnId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!dragging || dragging.status === newStatus) {
      setDragging(null); setDragOver(null); return;
    }
    setTasks(prev => prev.map(t => t.id === dragging.id ? { ...t, status: newStatus } : t));
    try {
      await api.put(`/tasks/${dragging.id}`, { status: newStatus });
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === dragging.id ? { ...t, status: dragging.status } : t));
    }
    setDragging(null); setDragOver(null);
  };

  const priorityConfig = {
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    medium: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    low: { color: '#4a4a4a', bg: '#1a1a1a' },
  };

  if (loading) return (
    <Layout title="Overview">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Overview">

      {/* Welcome */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '6px' }}>{getGreeting()} —</div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px' }}>
          {user?.name?.split(' ')[0]}{' '}
          <span style={{ color: '#6366f1' }}>{user?.name?.split(' ')[1] || ''}</span>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#4a4a4a' }}>Overall progress</span>
            <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600' }}>{stats.progress}%</span>
          </div>
          <div style={{ height: '4px', background: '#1e1e1e', borderRadius: '4px' }}>
            <div style={{ height: '4px', background: '#6366f1', borderRadius: '4px', width: `${stats.progress}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'Projects', value: stats.total_projects },
            { label: 'Open tasks', value: stats.todo + stats.inProgress },
            { label: 'Completed', value: stats.done },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {['overview', 'kanban', 'projects'].map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              background: activeTab === tab ? '#1e1e1e' : 'transparent',
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

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Todo', value: stats.todo, color: '#4a4a4a' },
              { label: 'In Progress', value: stats.inProgress, color: '#fff' },
              { label: 'Done', value: stats.done, color: '#6366f1' },
            ].map(card => (
              <div key={card.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                <div style={{ fontSize: '12px', color: '#4a4a4a' }}>{card.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Tasks */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>My Tasks</span>
                <span style={{ fontSize: '11px', color: '#4a4a4a' }}>{tasks.length} total</span>
              </div>
              {tasks.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#4a4a4a' }}>No tasks yet</div>
              ) : (
                tasks.slice(0, 6).map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#6366f1' : '#4a4a4a' }} />
                      <span style={{ fontSize: '13px', color: task.status === 'done' ? '#4a4a4a' : '#fff', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                        {task.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '4px',
                      background: task.status === 'done' ? 'rgba(99,102,241,0.15)' : task.status === 'in_progress' ? 'rgba(255,255,255,0.06)' : '#1a1a1a',
                      color: task.status === 'done' ? '#6366f1' : task.status === 'in_progress' ? '#fff' : '#4a4a4a',
                    }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Projects */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Projects</span>
                <span style={{ fontSize: '11px', color: '#4a4a4a' }}>{projects.length} total</span>
              </div>
              {projects.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#4a4a4a' }}>No projects yet</div>
              ) : (
                projects.slice(0, 5).map(project => (
                  <div key={project.id} style={{ padding: '9px 0', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{project.title}</span>
                      <span style={{ fontSize: '10px', fontWeight: '500', color: project.status === 'active' ? '#6366f1' : '#4a4a4a' }}>
                        {project.status}
                      </span>
                    </div>
                    <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px' }}>
                      <div style={{ height: '2px', background: '#6366f1', borderRadius: '2px', width: project.status === 'completed' ? '100%' : project.status === 'active' ? '50%' : '20%' }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* KANBAN TAB */}
      {activeTab === 'kanban' && (
        <div>
          {/* Filter */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          {/* Board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'start' }}>
            {COLUMNS.map(col => {
              const colTasks = getColumnTasks(col.id);
              const isDragTarget = dragOver === col.id;
              return (
                <div
                  key={col.id}
                  onDragOver={e => handleDragOver(e, col.id)}
                  onDrop={e => handleDrop(e, col.id)}
                  style={{
                    background: isDragTarget ? 'rgba(99,102,241,0.04)' : '#111',
                    border: `1px solid ${isDragTarget ? '#6366f1' : '#1e1e1e'}`,
                    borderRadius: '12px', padding: '12px',
                    minHeight: '400px', transition: 'all 0.15s',
                  }}
                >
                  {/* Column header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #1e1e1e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {col.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {colTasks.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#2a2a2a', border: '1px dashed #1e1e1e', borderRadius: '8px' }}>
                        Drop tasks here
                      </div>
                    )}
                    {colTasks.map(task => {
                      const pc = priorityConfig[task.priority] || priorityConfig.low;
                      const isDraggingThis = dragging?.id === task.id;
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={e => handleDragStart(e, task)}
                          onDragEnd={() => { setDragging(null); setDragOver(null); }}
                          style={{
                            background: isDraggingThis ? 'rgba(99,102,241,0.1)' : '#0f0f0f',
                            border: `1px solid ${isDraggingThis ? '#6366f1' : '#1e1e1e'}`,
                            borderRadius: '10px', padding: '12px',
                            cursor: 'grab', transition: 'all 0.15s',
                            opacity: isDraggingThis ? 0.5 : 1,
                            userSelect: 'none',
                          }}
                          onMouseEnter={e => { if (!isDraggingThis) e.currentTarget.style.borderColor = '#333'; }}
                          onMouseLeave={e => { if (!isDraggingThis) e.currentTarget.style.borderColor = '#1e1e1e'; }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px', background: pc.bg, color: pc.color, textTransform: 'uppercase' }}>
                              {task.priority}
                            </span>
                            {task.project && (
                              <span style={{ fontSize: '10px', color: '#4a4a4a', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {task.project.title}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff', marginBottom: '10px', lineHeight: '1.4' }}>
                            {task.title}
                          </div>
                          {task.progress > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                              <div style={{ height: '2px', background: '#1e1e1e', borderRadius: '2px' }}>
                                <div style={{ height: '2px', background: '#6366f1', borderRadius: '2px', width: `${task.progress}%` }} />
                              </div>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {task.assignee ? (
                              <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff' }}>
                                {task.assignee.name.charAt(0).toUpperCase()}
                              </div>
                            ) : <div />}
                            {task.due_date && (
                              <span style={{ fontSize: '10px', color: '#4a4a4a' }}>
                                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {projects.length === 0 ? (
            <div style={{ color: '#4a4a4a', fontSize: '13px' }}>No projects yet</div>
          ) : (
            projects.map(project => (
              <div key={project.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{project.title}</div>
                  <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', background: project.status === 'active' ? 'rgba(99,102,241,0.15)' : '#1a1a1a', color: project.status === 'active' ? '#6366f1' : '#4a4a4a' }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '12px' }}>{project.team?.name}</div>
                <div style={{ height: '2px', background: '#1e1e1e', borderRadius: '2px' }}>
                  <div style={{ height: '2px', background: '#6366f1', borderRadius: '2px', width: project.status === 'completed' ? '100%' : project.status === 'active' ? '50%' : '20%' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '8px' }}>{project.tasks_count || 0} tasks</div>
              </div>
            ))
          )}
        </div>
      )}

    </Layout>
  );
}