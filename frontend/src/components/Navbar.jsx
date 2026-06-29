import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import CreateProjectModal from './CreateProjectModal';
import CreateTaskModal from './CreateTaskModal';

function Navbar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.filter(n => !n.is_read));
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications([]);
      setShowNotif(false);
    } catch (err) {}
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour12: false });

  return (
    <>
      <div style={{
        height: '52px', background: '#111111',
        borderBottom: '1px solid #1f1f1f',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px', fontFamily: 'Inter, sans-serif',
        position: 'sticky', top: 0, zIndex: 10,
      }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#444' }}>Workspace</span>
            <span style={{ fontSize: '12px', color: '#333' }}>/</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{title || 'Overview'}</span>
          </div>
          <div style={{
            padding: '4px 10px', background: '#0f0f0f',
            border: '1px solid #1a1a1a', borderRadius: '6px',
            fontSize: '12px', color: '#555',
            fontFamily: 'monospace', letterSpacing: '1px',
          }}>
            {formatTime(time)}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* + Task — admin only */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowTaskModal(true)}
              style={{
                padding: '6px 14px', background: 'transparent',
                border: '1px solid #2a2a2a', borderRadius: '6px',
                color: '#888', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#a3e635'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              + Task
            </button>
          )}

          {/* + Project — admin only */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowProjectModal(true)}
              style={{
                padding: '6px 14px', background: '#a3e635',
                border: 'none', borderRadius: '6px',
                color: '#000', fontSize: '12px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              + Project
            </button>
          )}

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{
                width: '32px', height: '32px', background: '#0f0f0f',
                border: '1px solid #1a1a1a', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', fontSize: '13px',
              }}
            >
              🔔
              {notifications.length > 0 && (
                <div style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  width: '15px', height: '15px', background: '#a3e635',
                  borderRadius: '50%', fontSize: '8px', fontWeight: '800',
                  color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {notifications.length}
                </div>
              )}
            </button>

            {showNotif && (
              <div style={{
                position: 'absolute', top: '40px', right: '0',
                width: '280px', background: '#111',
                border: '1px solid #1f1f1f', borderRadius: '10px',
                overflow: 'hidden', zIndex: 100,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} style={{ fontSize: '10px', color: '#a3e635', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>
                    // no new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: '12px', color: '#ccc' }}>{n.message}</div>
                      <div style={{ fontSize: '10px', color: '#444', marginTop: '3px', fontFamily: 'monospace' }}>
                        {new Date(n.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: '32px', height: '32px', background: '#a3e635',
              borderRadius: '6px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '12px', fontWeight: '800',
              color: '#000', cursor: 'pointer',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

        </div>
      </div>

      {/* Modals */}
      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreated={() => {}}
        />
      )}
      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreated={() => {}}
        />
      )}
    </>
  );
}

export default Navbar;