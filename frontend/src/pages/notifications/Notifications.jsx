import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {}
    setLoading(false);
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {}
  };

  const markAll = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {}
  };

  const unread = notifications.filter(n => !n.is_read).length;

  if (loading) return (
    <Layout title="Notifications">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Notifications">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Activity</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Notifications{' '}
            {unread > 0 && <span style={{ color: '#6366f1' }}>{unread} new</span>}
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#6366f1', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔔</div>
            <div style={{ fontSize: '14px', color: '#4a4a4a' }}>No notifications yet</div>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '16px 20px', borderBottom: '1px solid #1a1a1a',
                background: n.is_read ? 'transparent' : 'rgba(99,102,241,0.04)',
                cursor: n.is_read ? 'default' : 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!n.is_read) e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { if (!n.is_read) e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
            >
              {/* Icon */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                background: n.is_read ? '#1a1a1a' : 'rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
              }}>
                {n.type === 'task_assigned' ? '✓' : n.type === 'comment_added' ? '💬' : '🔔'}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: n.is_read ? '#888' : '#fff', marginBottom: '4px', lineHeight: '1.5' }}>
                  {n.message}
                </div>
                <div style={{ fontSize: '11px', color: '#4a4a4a' }}>
                  {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Unread dot */}
              {!n.is_read && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '4px' }} />
              )}
            </div>
          ))
        )}
      </div>

    </Layout>
  );
}