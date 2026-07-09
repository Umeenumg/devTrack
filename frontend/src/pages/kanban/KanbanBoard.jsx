import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#4a4a4a' },
  { id: 'in_progress', label: 'In Progress', color: '#6366f1' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');

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
    } catch (err) {}
    setLoading(false);
  };

  const filteredTasks = selectedProject === 'all'
    ? tasks
    : tasks.filter(t => t.project_id === parseInt(selectedProject));

  const getColumnTasks = (status) =>
    filteredTasks.filter(t => t.status === status);

  const handleDragStart = (e, task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(columnId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!dragging || dragging.status === newStatus) {
      setDragging(null);
      setDragOver(null);
      return;
    }

    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === dragging.id ? { ...t, status: newStatus } : t
    ));

    try {
      await api.put(`/tasks/${dragging.id}`, { status: newStatus });
    } catch (err) {
      // Revert on error
      setTasks(prev => prev.map(t =>
        t.id === dragging.id ? { ...t, status: dragging.status } : t
      ));
    }

    setDragging(null);
    setDragOver(null);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDragOver(null);
  };

  const priorityConfig = {
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    medium: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    low: { color: '#4a4a4a', bg: '#1a1a1a' },
  };

  if (loading) return (
    <Layout title="Kanban">
      <div style={{ color: '#4a4a4a', fontSize: '13px' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Kanban">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>Board view</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Kanban <span style={{ color: '#6366f1' }}>{filteredTasks.length} tasks</span>
          </div>
        </div>

        {/* Project filter */}
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderRadius: '8px', padding: '8px 14px',
            fontSize: '13px', color: '#fff',
            fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'start' }}>
        {COLUMNS.map(col => {
          const colTasks = getColumnTasks(col.id);
          const isDragTarget = dragOver === col.id;

          return (
            <div
              key={col.id}
              onDragOver={e => handleDragOver(e, col.id)}
              onDrop={e => handleDrop(e, col.id)}
              style={{
                background: isDragTarget ? 'rgba(99,102,241,0.04)' : '#111',
                border: `1px solid ${isDragTarget ? '#6366f1' : '#1e1e1e'}`,
                borderRadius: '12px', padding: '12px',
                minHeight: '400px', transition: 'all 0.15s',
              }}
            >
              {/* Column header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '4px 4px 8px', borderBottom: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {col.label}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: '600',
                  padding: '2px 8px', borderRadius: '4px',
                  background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {colTasks.length === 0 && (
                  <div style={{
                    padding: '20px', textAlign: 'center',
                    fontSize: '12px', color: '#2a2a2a',
                    border: '1px dashed #1e1e1e', borderRadius: '8px',
                  }}>
                    Drop tasks here
                  </div>
                )}

                {colTasks.map(task => {
                  const pc = priorityConfig[task.priority] || priorityConfig.low;
                  const isDraggingThis = dragging?.id === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={e => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      style={{
                        background: isDraggingThis ? 'rgba(99,102,241,0.1)' : '#0f0f0f',
                        border: `1px solid ${isDraggingThis ? '#6366f1' : '#1e1e1e'}`,
                        borderRadius: '10px', padding: '12px',
                        cursor: 'grab', transition: 'all 0.15s',
                        opacity: isDraggingThis ? 0.5 : 1,
                        userSelect: 'none',
                      }}
                      onMouseEnter={e => { if (!isDraggingThis) e.currentTarget.style.borderColor = '#333'; }}
                      onMouseLeave={e => { if (!isDraggingThis) e.currentTarget.style.borderColor = '#1e1e1e'; }}
                    >
                      {/* Priority + project */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px', background: pc.bg, color: pc.color, textTransform: 'uppercase' }}>
                          {task.priority}
                        </span>
                        {task.project && (
                          <span style={{ fontSize: '10px', color: '#4a4a4a', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.project.title}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff', marginBottom: '10px', lineHeight: '1.4' }}>
                        {task.title}
                      </div>

                      {/* Progress bar */}
                      {task.progress > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ height: '2px', background: '#1e1e1e', borderRadius: '2px' }}>
                            <div style={{ height: '2px', background: '#6366f1', borderRadius: '2px', width: `${task.progress}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {task.assignee ? (
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '5px',
                            background: '#6366f1', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff',
                          }}>
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div />
                        )}
                        {task.due_date && (
                          <span style={{ fontSize: '10px', color: '#4a4a4a' }}>
                            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </Layout>
  );
}