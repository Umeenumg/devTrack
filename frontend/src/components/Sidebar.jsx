import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const menuItems = [
  { path: '/dashboard', label: 'Overview', icon: '⊞' },
  { path: '/projects', label: 'Projects', icon: '◫' },
  { path: '/tasks', label: 'My Tasks', icon: '✓' },
  { path: '/notifications', label: 'Notifications', icon: '○' },
  { path: '/profile', label: 'Profile', icon: '◇' },
];

const adminItems = [
  { path: '/admin/dashboard', label: 'Admin Panel', icon: '⚡' },
  { path: '/admin/users', label: 'Users', icon: '○' },
  { path: '/admin/teams', label: 'Teams', icon: '◫' },
];

const aiItems = [
  { path: '/ai/tasks', label: 'Task Generator', icon: '⚡' },
  { path: '/ai/sprints', label: 'Sprint Planner', icon: '📅' },
  { path: '/ai/bugs', label: 'Bug Detector', icon: '🔍' },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (err) {}
    logout();
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink to={item.path}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '7px 8px', borderRadius: '7px', marginBottom: '1px',
        textDecoration: 'none', fontSize: '13px',
        color: isActive ? '#fff' : '#4a4a4a',
        background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
        fontWeight: isActive ? '500' : '400',
        transition: 'all 0.1s',
      })}
      onMouseEnter={e => e.currentTarget.style.color = '#888'}
      onMouseLeave={e => e.currentTarget.style.color = '#4a4a4a'}
    >
      {({ isActive }) => (
        <>
          <span style={{ fontSize: '11px', color: isActive ? '#6366f1' : '#4a4a4a' }}>{item.icon}</span>
          {item.label}
          {isActive && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: '#6366f1' }} />}
        </>
      )}
    </NavLink>
  );

  const SectionLabel = ({ label, top }) => (
    <div style={{ fontSize: '10px', fontWeight: '600', color: '#2a2a2a', letterSpacing: '1.5px', textTransform: 'uppercase', padding: `${top ? '8px' : '16px'} 8px 4px` }}>
      {label}
    </div>
  );

  return (
    <div style={{
      width: '220px', height: '100vh',
      background: '#111111',
      borderRight: '1px solid #1e1e1e',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      position: 'fixed', top: 0, left: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#6366f1',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '800' }}>P</span>
          </div>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>ProjectFlow</span>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', background: '#6366f1',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10px', color: '#4a4a4a', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Nav — scrollable */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>

        <SectionLabel label="Workspace" top />
        {menuItems.map(item => <NavItem key={item.path} item={item} />)}

        {user?.role === 'admin' && (
          <>
            <SectionLabel label="Admin" />
            {adminItems.map(item => <NavItem key={item.path} item={item} />)}
          </>
        )}

        <SectionLabel label="AI Features" />
        {aiItems.map(item => <NavItem key={item.path} item={item} />)}

      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #1e1e1e', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px', background: 'transparent',
            border: '1px solid #1e1e1e', borderRadius: '7px',
            color: '#4a4a4a', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', display: 'flex',
            alignItems: 'center', gap: '8px', transition: 'all 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#4a4a4a'; }}
        >
          ← Sign out
        </button>
      </div>

    </div>
  );
}

export default Sidebar;