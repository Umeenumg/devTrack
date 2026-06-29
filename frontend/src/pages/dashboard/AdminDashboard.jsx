import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, projectsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/projects'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {}
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout title="Admin Panel">
        <div style={{ color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>
          // loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Panel">

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace', marginBottom: '4px' }}>
          // admin control panel
        </div>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Admin <span style={{ color: '#a3e635' }}>Dashboard</span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total Users', value: stats?.total_users, accent: false },
          { label: 'Total Teams', value: stats?.total_teams, accent: false },
          { label: 'Total Projects', value: stats?.total_projects, accent: false },
          { label: 'Total Tasks', value: stats?.total_tasks, accent: true },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111',
            border: '1px solid #1f1f1f',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: card.accent ? '#a3e635' : '#fff', marginBottom: '4px' }}>
              {card.value || 0}
            </div>
            <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Task stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Todo', value: stats?.tasks_todo, color: '#555' },
          { label: 'In Progress', value: stats?.tasks_progress, color: '#fff' },
          { label: 'Done', value: stats?.tasks_done, color: '#a3e635' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111',
            border: '1px solid #1f1f1f',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {card.label}
            </span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: card.color }}>
              {card.value || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        background: '#111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '20px', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Overall Completion
          </span>
          <span style={{ fontSize: '10px', color: '#a3e635', fontWeight: '700' }}>
            {stats?.total_tasks > 0
              ? Math.round((stats?.tasks_done / stats?.total_tasks) * 100)
              : 0}%
          </span>
        </div>
        <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '3px' }}>
          <div style={{
            height: '3px', background: '#a3e635', borderRadius: '3px',
            width: `${stats?.total_tasks > 0 ? Math.round((stats?.tasks_done / stats?.total_tasks) * 100) : 0}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Users + Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Users table */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Users
            </span>
            <span style={{ fontSize: '10px', color: '#444' }}>{users.length} total</span>
          </div>

          {users.length === 0 ? (
            <div style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>// no users yet</div>
          ) : (
            users.slice(0, 6).map(user => (
              <div key={user.id} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #1a1a1a',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px', height: '28px',
                    background: user.role === 'admin' ? '#a3e635' : '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700',
                    color: user.role === 'admin' ? '#000' : '#555',
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>{user.name}</div>
                    <div style={{ fontSize: '10px', color: '#444' }}>{user.email}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: '9px', fontWeight: '700',
                  color: user.role === 'admin' ? '#000' : '#555',
                  background: user.role === 'admin' ? '#a3e635' : '#1a1a1a',
                  padding: '2px 8px', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {user.role}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Projects table */}
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
            projects.slice(0, 6).map(project => (
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
                    color: project.status === 'active' ? '#a3e635' : project.status === 'completed' ? '#fff' : '#555',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#444' }}>
                    {project.tasks_count} tasks
                  </span>
                  <span style={{ fontSize: '10px', color: '#444' }}>
                    {project.team?.name || 'No team'}
                  </span>
                </div>
                <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{
                    height: '2px', background: '#a3e635', borderRadius: '2px',
                    width: `${project.status === 'completed' ? 100 : project.status === 'active' ? 60 : 30}%`,
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

export default AdminDashboard;