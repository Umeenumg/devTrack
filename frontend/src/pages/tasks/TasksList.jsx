import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function TasksList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const priorityColor = (p) => {
    if (p === 'high') return '#ef4444';
    if (p === 'medium') return '#6366f1';
    return '#4a4a4a';
  };

  const statusStyle = (s) => {
    if (s === 'done') return { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' };
    if (s === 'in_progress') return { bg: 'rgba(255,255,255,0.06)', color: '#fff' };
    return { bg: '#1a1a1a', color: '#4a4a4a' };
  };

  if (loading) return (
    <Layout title="My Tasks">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="My Tasks">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>All tasks</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Tasks <span style={{ color: '#6366f1' }}>{tasks.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'todo', 'in_progress', 'done'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                background: filter === f ? '#6366f1' : 'transparent',
                border: `1px solid ${filter === f ? '#6366f1' : '#1e1e1e'}`,
                borderRadius: '6px',
                color: filter === f ? '#fff' : '#4a4a4a',
                fontSize: '12px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks list */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 140px 100px 100px 100px',
          padding: '10px 16px', borderBottom: '1px solid #1e1e1e',
          fontSize: '11px', color: '#4a4a4a', fontWeight: '500',
        }}>
          <span>Task</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Due date</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#4a4a4a' }}>
            No tasks found
          </div>
        ) : (
          filtered.map(task => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 140px 100px 100px 100px',
                padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
                cursor: 'pointer', transition: 'background 0.1s',
                alignItems: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#161616'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                  background: priorityColor(task.priority),
                }} />
                <div>
                  <div style={{
                    fontSize: '13px', fontWeight: '500',
                    color: task.status === 'done' ? '#4a4a4a' : '#fff',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </div>
                  {task.assignee && (
                    <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '2px' }}>
                      {task.assignee.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Project */}
              <div style={{ fontSize: '12px', color: '#4a4a4a' }}>
                {task.project?.title || '—'}
              </div>

              {/* Priority */}
              <div>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  padding: '2px 8px', borderRadius: '4px',
                  background: task.priority === 'high' ? 'rgba(239,68,68,0.1)' : task.priority === 'medium' ? 'rgba(99,102,241,0.1)' : '#1a1a1a',
                  color: priorityColor(task.priority),
                }}>
                  {task.priority}
                </span>
              </div>

              {/* Status */}
              <div>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  padding: '2px 8px', borderRadius: '4px',
                  background: statusStyle(task.status).bg,
                  color: statusStyle(task.status).color,
                }}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>

              {/* Due date */}
              <div style={{ fontSize: '12px', color: '#4a4a4a' }}>
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '—'}
              </div>

            </div>
          ))
        )}
      </div>

    </Layout>
  );
}