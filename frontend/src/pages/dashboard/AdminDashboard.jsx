import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminDashboard() {
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

  if (loading) return (
    <Layout title="Admin Panel">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  const completion = stats?.total_tasks > 0
    ? Math.round((stats.tasks_done / stats.total_tasks) * 100)
    : 0;

  return (
    <Layout title="Admin Panel">

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>
          Admin control panel
        </div>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
          Overview
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
        {[
          { label: 'Users', value: stats?.total_users },
          { label: 'Teams', value: stats?.total_teams },
          { label: 'Projects', value: stats?.total_projects },
          { label: 'Tasks', value: stats?.total_tasks, accent: true },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ fontSize: '30px', fontWeight: '800', color: card.accent ? '#6366f1' : '#fff', marginBottom: '4px' }}>
              {card.value || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#4a4a4a' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Task status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
        {[
          { label: 'Todo', value: stats?.tasks_todo, color: '#4a4a4a' },
          { label: 'In Progress', value: stats?.tasks_progress, color: '#fff' },
          { label: 'Done', value: stats?.tasks_done, color: '#6366f1' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderRadius: '12px', padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{card.label}</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: card.color }}>{card.value || 0}</span>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div style={{
        background: '#111', border: '1px solid #1e1e1e',
        borderRadius: '12px', padding: '16px 20px', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>Overall completion</span>
          <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600' }}>{completion}%</span>
        </div>
        <div style={{ height: '4px', background: '#1e1e1e', borderRadius: '4px' }}>
          <div style={{
            height: '4px', background: '#6366f1', borderRadius: '4px',
            width: `${completion}%`, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Users + Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Users */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Users</span>
            <span style={{ fontSize: '11px', color: '#4a4a4a' }}>{users.length} total</span>
          </div>
          {users.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#4a4a4a' }}>No users yet</div>
          ) : (
            users.slice(0, 6).map(u => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 0', borderBottom: '1px solid #1a1a1a',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px',
                    background: u.role === 'admin' ? '#6366f1' : '#1e1e1e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700',
                    color: u.role === 'admin' ? '#fff' : '#4a4a4a',
                  }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#4a4a4a' }}>{u.email}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: '600',
                  padding: '2px 8px', borderRadius: '4px',
                  background: u.role === 'admin' ? 'rgba(99,102,241,0.15)' : '#1a1a1a',
                  color: u.role === 'admin' ? '#6366f1' : '#4a4a4a',
                }}>
                  {u.role}
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
            projects.slice(0, 6).map(p => (
              <div key={p.id} style={{ padding: '9px 0', borderBottom: '1px solid #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{p.title}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: '600',
                    color: p.status === 'active' ? '#6366f1' : p.status === 'completed' ? '#fff' : '#4a4a4a',
                  }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#4a4a4a' }}>{p.tasks_count} tasks · {p.team?.name}</span>
                </div>
                <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{
                    height: '2px', background: '#6366f1', borderRadius: '2px',
                    width: p.status === 'completed' ? '100%' : p.status === 'active' ? '55%' : '20%',
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