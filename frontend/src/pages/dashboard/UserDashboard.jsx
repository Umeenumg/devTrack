import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
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
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);

      const done = tasksRes.data.filter(t => t.status === 'done').length;
      const inProgress = tasksRes.data.filter(t => t.status === 'in_progress').length;
      const todo = tasksRes.data.filter(t => t.status === 'todo').length;
      const progress = tasksRes.data.length > 0
        ? Math.round((done / tasksRes.data.length) * 100)
        : 0;

      setStats({
        total_tasks: tasksRes.data.length,
        done, inProgress, todo,
        total_projects: projectsRes.data.length,
        progress,
      });
    } catch (err) {}
    setLoading(false);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const priorityColor = (p) => {
    if (p === 'high') return '#ef4444';
    if (p === 'medium') return '#a3e635';
    return '#555';
  };

  const statusColor = (s) => {
    if (s === 'done') return '#a3e635';
    if (s === 'in_progress') return '#fff';
    return '#555';
  };

  if (loading) {
    return (
      <Layout title="Overview">
        <div style={{ color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>
          // loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Overview">

      {/* Welcome card */}
      <div style={{
        background: '#111',
        border: '1px solid #1f1f1f',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '11px', color: '#555', fontFamily: 'monospace', marginBottom: '8px' }}>
          // {getGreeting()} —
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-1px', marginBottom: '12px', textTransform: 'uppercase' }}>
          {user?.name?.split(' ')[0]}{' '}
          <span style={{ color: '#a3e635' }}>{user?.name?.split(' ')[1] || ''}</span>
        </div>

        <div style={{ fontSize: '13px', color: '#555', marginBottom: '16px', fontFamily: 'monospace' }}>
          You have{' '}
          <span style={{ color: '#a3e635', fontWeight: '700' }}>{stats?.inProgress} tasks</span>
          {' '}in progress and{' '}
          <span style={{ color: '#fff', fontWeight: '700' }}>{stats?.todo} todo</span>.
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Overall Progress
            </span>
            <span style={{ fontSize: '10px', color: '#a3e635', fontWeight: '700' }}>
              {stats?.progress}%
            </span>
          </div>
          <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '3px' }}>
            <div style={{
              height: '3px', borderRadius: '3px',
              background: '#a3e635',
              width: `${stats?.progress}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Projects', value: stats?.total_projects },
            { label: 'Open Tasks', value: stats?.todo + stats?.inProgress },
            { label: 'Completed', value: stats?.done },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Todo', value: stats?.todo, color: '#555' },
          { label: 'In Progress', value: stats?.inProgress, color: '#fff' },
          { label: 'Done', value: stats?.done, color: '#a3e635' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111',
            border: '1px solid #1f1f1f',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: card.color, marginBottom: '4px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tasks + Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* My Tasks */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' }}>
              My Tasks
            </span>
            <span style={{ fontSize: '10px', color: '#444' }}>{tasks.length} total</span>
          </div>

          {tasks.length === 0 ? (
            <div style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>// no tasks yet</div>
          ) : (
            tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #1a1a1a',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: priorityColor(task.priority), flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '12px', color: statusColor(task.status) }}>
                    {task.title}
                  </span>
                </div>
                <span style={{
                  fontSize: '9px', color: '#000', fontWeight: '700',
                  background: task.status === 'done' ? '#a3e635' : task.status === 'in_progress' ? '#fff' : '#2a2a2a',
                  padding: '2px 8px', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '1px',
                  color: task.status === 'todo' ? '#555' : '#000',
                }}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Projects */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Projects
            </span>
            <span style={{ fontSize: '10px', color: '#444' }}>{projects.length} total</span>
          </div>

          {projects.length === 0 ? (
            <div style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>// no projects yet</div>
          ) : (
            projects.slice(0, 4).map(project => (
              <div key={project.id} style={{
                padding: '10px 0',
                borderBottom: '1px solid #1a1a1a',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>
                    {project.title}
                  </span>
                  <span style={{
                    fontSize: '9px', fontWeight: '700',
                    color: project.status === 'active' ? '#a3e635' : '#555',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px' }}>
                  <div style={{
                    height: '2px', background: '#a3e635', borderRadius: '2px',
                    width: `${project.tasks_count > 0 ? Math.round((project.tasks_count / 10) * 100) : 0}%`,
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

export default UserDashboard;