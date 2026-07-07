import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      navigate('/tasks');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      setTask({ ...task, status: res.data.status });
    } catch (err) {}
    setUpdating(false);
  };

  const handleProgressUpdate = async (progress) => {
    try {
      await api.put(`/tasks/${id}`, { progress });
      setTask({ ...task, progress });
    } catch (err) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/tasks/${id}/comments`, { content: comment });
      setTask({ ...task, comments: [...(task.comments || []), res.data] });
      setComment('');
    } catch (err) {}
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setTask({ ...task, comments: task.comments.filter(c => c.id !== commentId) });
    } catch (err) {}
  };

  const priorityColor = (p) => {
    if (p === 'high') return '#ef4444';
    if (p === 'medium') return '#6366f1';
    return '#4a4a4a';
  };

  if (loading) return (
    <Layout title="Task">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  if (!task) return null;

  return (
    <Layout title={task.title}>

      {/* Back */}
      <button onClick={() => navigate('/tasks')}
        style={{ background: 'none', border: 'none', color: '#4a4a4a', fontSize: '12px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Back to tasks
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>

        {/* Left — main content */}
        <div>

          {/* Title + status */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                {task.title}
              </h1>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['todo', 'in_progress', 'done'].map(s => (
                  <button key={s}
                    onClick={() => handleStatusUpdate(s)}
                    disabled={updating}
                    style={{
                      padding: '5px 12px',
                      background: task.status === s ? (s === 'done' ? 'rgba(99,102,241,0.15)' : s === 'in_progress' ? 'rgba(255,255,255,0.08)' : '#1a1a1a') : 'transparent',
                      border: `1px solid ${task.status === s ? (s === 'done' ? '#6366f1' : '#333') : '#1e1e1e'}`,
                      borderRadius: '6px',
                      color: task.status === s ? (s === 'done' ? '#6366f1' : '#fff') : '#4a4a4a',
                      fontSize: '11px', fontWeight: '500',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {task.description && (
              <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', margin: 0 }}>
                {task.description}
              </p>
            )}
          </div>

          {/* Progress */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Progress</span>
              <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600' }}>{task.progress}%</span>
            </div>
            <input
              type="range" min="0" max="100"
              value={task.progress}
              onChange={e => handleProgressUpdate(e.target.value)}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <div style={{ height: '4px', background: '#1e1e1e', borderRadius: '4px', marginTop: '8px' }}>
              <div style={{
                height: '4px', background: '#6366f1', borderRadius: '4px',
                width: `${task.progress}%`, transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          {/* Comments */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
              Comments {task.comments?.length > 0 && <span style={{ color: '#6366f1' }}>{task.comments.length}</span>}
            </div>

            {/* Comment input */}
            <form onSubmit={handleComment} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', background: '#6366f1',
                  borderRadius: '6px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: '700',
                  color: '#fff', flexShrink: 0,
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{
                      width: '100%', background: '#0f0f0f',
                      border: '1px solid #1e1e1e', borderRadius: '8px',
                      padding: '10px 14px', fontSize: '13px', color: '#fff',
                      fontFamily: 'Inter, sans-serif', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                  />
                </div>
                <button type="submit" disabled={submitting || !comment.trim()}
                  style={{
                    padding: '10px 16px', background: '#6366f1',
                    border: 'none', borderRadius: '8px',
                    color: '#fff', fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    opacity: !comment.trim() ? 0.5 : 1,
                  }}>
                  {submitting ? '...' : 'Send'}
                </button>
              </div>
            </form>

            {/* Comments list */}
            {!task.comments || task.comments.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#4a4a4a' }}>No comments yet</div>
            ) : (
              task.comments.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: '10px',
                  padding: '12px 0', borderBottom: '1px solid #1a1a1a',
                }}>
                  <div style={{
                    width: '28px', height: '28px', background: '#1e1e1e',
                    borderRadius: '6px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '11px', fontWeight: '700',
                    color: '#4a4a4a', flexShrink: 0,
                  }}>
                    {c.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{c.user?.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                        {c.user_id === user?.id && (
                          <button onClick={() => handleDeleteComment(c.id)}
                            style={{ background: 'none', border: 'none', color: '#4a4a4a', fontSize: '11px', cursor: 'pointer' }}
                            onMouseEnter={e => e.target.style.color = '#ef4444'}
                            onMouseLeave={e => e.target.style.color = '#4a4a4a'}
                          >
                            delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0, lineHeight: '1.5' }}>{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right — details */}
        <div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Details
            </div>

            {[
              { label: 'Project', value: task.project?.title, link: () => navigate(`/projects/${task.project?.id}`) },
              { label: 'Assigned to', value: task.assignee?.name || 'Unassigned' },
              { label: 'Created by', value: task.creator?.name },
              { label: 'Priority', value: task.priority, color: priorityColor(task.priority) },
              { label: 'Due date', value: task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '4px' }}>{item.label}</div>
                <div
                  onClick={item.link}
                  style={{
                    fontSize: '13px',
                    color: item.color || (item.link ? '#6366f1' : '#fff'),
                    cursor: item.link ? 'pointer' : 'default',
                    fontWeight: '500',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '14px', marginTop: '4px' }}>
              <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '4px' }}>Created</div>
              <div style={{ fontSize: '13px', color: '#fff' }}>
                {new Date(task.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}