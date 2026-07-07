import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_tasks: 0, done: 0, inProgress: 0, todo: 0, total_projects: 0, progress: 0 });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        total_tasks: t.length,
        done, inProgress, todo,
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

  if (loading) return (
    <Layout title="Overview">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Overview">

      {/* Welcome */}
      <div style={{
        background: '#111', border: '1px solid #1e1e1e',
        borderRadius: '12px', padding: '24px', marginBottom: '16px',
      }}>
        <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '6px' }}>
          {getGreeting()} —
        </div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px' }}>
          {user?.name?.split(' ')[0]}{' '}
          <span style={{ color: '#6366f1' }}>{user?.name?.split(' ')[1] || ''}</span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#4a4a4a' }}>Overall progress</span>
            <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600' }}>{stats.progress}%</span>
          </div>
          <div style={{ height: '4px', background: '#1e1e1e', borderRadius: '4px' }}>
            <div style={{
              height: '4px', background: '#6366f1', borderRadius: '4px',
              width: `${stats.progress}%`, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Quick numbers */}
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

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Todo', value: stats.todo, color: '#4a4a4a' },
          { label: 'In Progress', value: stats.inProgress, color: '#fff' },
          { label: 'Done', value: stats.done, color: '#6366f1' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: card.color, marginBottom: '4px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '12px', color: '#4a4a4a' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tasks + Projects */}
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
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 0', borderBottom: '1px solid #1a1a1a',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#6366f1' : '#4a4a4a',
                  }} />
                  <span style={{ fontSize: '13px', color: task.status === 'done' ? '#4a4a4a' : '#fff', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: '500',
                  padding: '2px 8px', borderRadius: '4px',
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
                  <span style={{
                    fontSize: '10px', fontWeight: '500',
                    color: project.status === 'active' ? '#6366f1' : '#4a4a4a',
                  }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px' }}>
                  <div style={{
                    height: '2px', background: '#6366f1', borderRadius: '2px',
                    width: project.status === 'completed' ? '100%' : project.status === 'active' ? '50%' : '20%',
                  }} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}