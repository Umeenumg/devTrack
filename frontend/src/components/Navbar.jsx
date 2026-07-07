import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Navbar({ title, onNewProject, onNewTask }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifications(res.data.filter(n => !n.is_read)))
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications([]);
      setShowNotif(false);
    } catch (err) {}
  };

  return (
    <div style={{
      height: '52px', background: '#111111',
      borderBottom: '1px solid #1e1e1e',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px', fontFamily: 'Inter, sans-serif',
      position: 'sticky', top: 0, zIndex: 10,
    }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: '#2a2a2a' }}>Workspace</span>
        <span style={{ fontSize: '12px', color: '#2a2a2a' }}>/</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{title || 'Overview'}</span>
        <div style={{
          padding: '3px 8px', background: '#0f0f0f',
          border: '1px solid #1e1e1e', borderRadius: '5px',
          fontSize: '11px', color: '#4a4a4a', fontFamily: 'monospace',
        }}>
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {user?.role === 'admin' && (
          <>
            <button onClick={onNewTask}
              style={{
                padding: '6px 12px', background: 'transparent',
                border: '1px solid #1e1e1e', borderRadius: '6px',
                color: '#888', fontSize: '12px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
            >
              + Task
            </button>
            <button onClick={onNewProject}
              style={{
                padding: '6px 12px', background: '#6366f1',
                border: 'none', borderRadius: '6px',
                color: '#fff', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              + Project
            </button>
          </>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotif(!showNotif)}
            style={{
              width: '32px', height: '32px', background: '#0f0f0f',
              border: '1px solid #1e1e1e', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', fontSize: '14px',
            }}
          >
            🔔
            {notifications.length > 0 && (
              <div style={{
                position: 'absolute', top: '-3px', right: '-3px',
                width: '14px', height: '14px', background: '#6366f1',
                borderRadius: '50%', fontSize: '8px', fontWeight: '700',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {notifications.length}
              </div>
            )}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute', top: '40px', right: '0',
              width: '280px', background: '#111',
              border: '1px solid #1e1e1e', borderRadius: '10px',
              overflow: 'hidden', zIndex: 100,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: '11px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#4a4a4a' }}>
                  No new notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ padding: '10px 14px', borderBottom: '1px solid #1e1e1e' }}>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>{n.message}</div>
                    <div style={{ fontSize: '10px', color: '#4a4a4a', marginTop: '3px' }}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div onClick={() => navigate('/profile')} style={{
          width: '32px', height: '32px', background: '#6366f1',
          borderRadius: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '12px', fontWeight: '700',
          color: '#fff', cursor: 'pointer',
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

      </div>
    </div>
  );
}

export default Navbar;