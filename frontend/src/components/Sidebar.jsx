import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ done_today: 0, team: 0, tasks: 0, projects: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {}
  };

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (err) {}
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      background: '#111111',
      borderRight: '1px solid #1f1f1f',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      position: 'fixed',
      top: 0, left: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: '20px', fontWeight: '900', color: '#a3e635', letterSpacing: '-1px', textTransform: 'uppercase' }}>
          Project Mgr
        </div>
        <div style={{ fontSize: '10px', color: '#333', fontFamily: 'monospace', marginTop: '2px' }}>
          // project operating system
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ flex: 1, padding: '10px 16px', borderRight: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Done</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#a3e635', marginTop: '2px' }}>
            {stats.tasks_done || 0}
          </div>
        </div>
        <div style={{ flex: 1, padding: '10px 16px' }}>
          <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
            {stats.total_projects || 0}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>

        {/* Workspace */}
        <div style={{ fontSize: '9px', fontWeight: '600', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 12px 6px' }}>
          Workspace
        </div>

        {[
          { path: '/dashboard', label: 'Overview', icon: '◆' },
          { path: '/projects', label: 'Projects', icon: '○' },
          { path: '/tasks', label: 'My Tasks', icon: '▤' },
        ].map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '6px', marginBottom: '1px',
              textDecoration: 'none', fontSize: '13px',
              color: isActive ? '#a3e635' : '#555',
              background: isActive ? 'rgba(163,230,53,0.06)' : 'transparent',
              borderLeft: isActive ? '2px solid #a3e635' : '2px solid transparent',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </NavLink>
        ))}

        {/* Admin section */}
        {user?.role === 'admin' && (
          <>
            <div style={{ fontSize: '9px', fontWeight: '600', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 12px 6px' }}>
              Admin
            </div>
            {[
              { path: '/admin/dashboard', label: 'Admin Panel', icon: '⚡' },
              { path: '/admin/users', label: 'Users', icon: '○' },
              { path: '/admin/teams', label: 'Teams', icon: '▤' },
            ].map(item => (
              <NavLink key={item.path} to={item.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center',
                  padding: '8px 12px', borderRadius: '6px', marginBottom: '1px',
                  textDecoration: 'none', fontSize: '13px',
                  color: isActive ? '#a3e635' : '#555',
                  background: isActive ? 'rgba(163,230,53,0.06)' : 'transparent',
                  borderLeft: isActive ? '2px solid #a3e635' : '2px solid transparent',
                })}
              >
                <span style={{ fontSize: '10px', marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}

        {/* Insights */}
        <div style={{ fontSize: '9px', fontWeight: '600', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 12px 6px' }}>
          Insights
        </div>
        {[
          { path: '/notifications', label: 'Notifications', icon: '○' },
          { path: '/profile', label: 'Profile', icon: '◇' },
        ].map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              padding: '8px 12px', borderRadius: '6px', marginBottom: '1px',
              textDecoration: 'none', fontSize: '13px',
              color: isActive ? '#a3e635' : '#555',
              background: isActive ? 'rgba(163,230,53,0.06)' : 'transparent',
              borderLeft: isActive ? '2px solid #a3e635' : '2px solid transparent',
            })}
          >
            <span style={{ fontSize: '10px', marginRight: '10px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Workspace load */}
        <div style={{ margin: '20px 12px 8px', padding: '12px', background: '#0f0f0f', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '9px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            // Workspace Load
          </div>
          {[
            { label: 'TASKS', value: stats.tasks_done || 0, max: stats.total_tasks || 1 },
            { label: 'PROJECTS', value: stats.total_projects || 0, max: 10 },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '9px', color: '#444', letterSpacing: '1px' }}>{item.label}</span>
                <span style={{ fontSize: '9px', color: '#555' }}>{Math.round((item.value / item.max) * 100)}%</span>
              </div>
              <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px' }}>
                <div style={{
                  height: '2px', borderRadius: '2px',
                  background: '#a3e635',
                  width: `${Math.min(Math.round((item.value / item.max) * 100), 100)}%`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User */}
      <div style={{ padding: '12px', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#a3e635', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#000', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {user?.role} · Pro
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
            onMouseEnter={e => e.target.style.color = '#a3e635'}
            onMouseLeave={e => e.target.style.color = '#333'}
          >
            ⏻
          </button>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;