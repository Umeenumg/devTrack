import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SmartSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ tasks: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults({ tasks: [], projects: [] });
      setSelected(0);
    }
  }, [open]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ tasks: [], projects: [] });
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects'),
        ]);
        const q = query.toLowerCase();
        setResults({
          tasks: tasksRes.data.filter(t =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
          ).slice(0, 5),
          projects: projectsRes.data.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          ).slice(0, 3),
        });
      } catch (err) {}
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const allResults = [
    ...results.projects.map(p => ({ ...p, type: 'project' })),
    ...results.tasks.map(t => ({ ...t, type: 'task' })),
  ];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, allResults.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && allResults[selected]) {
        handleSelect(allResults[selected]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, selected, allResults]);

  const handleSelect = (item) => {
    if (item.type === 'project') navigate(`/projects/${item.id}`);
    if (item.type === 'task') navigate(`/tasks/${item.id}`);
    setOpen(false);
  };

  const priorityColor = (p) => {
    if (p === 'high') return '#ef4444';
    if (p === 'medium') return '#6366f1';
    return '#4a4a4a';
  };

  const highlight = (text, q) => {
    if (!q || !text) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: '#6366f1', fontWeight: '700' }}>{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '6px 12px', background: '#0f0f0f',
        border: '1px solid #1e1e1e', borderRadius: '8px',
        color: '#4a4a4a', fontSize: '12px', cursor: 'pointer',
        fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
    >
      🔍 Search...
      <span style={{ fontSize: '10px', padding: '2px 6px', background: '#1a1a1a', borderRadius: '4px', color: '#4a4a4a' }}>
        Ctrl K
      </span>
    </button>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '120px', zIndex: 2000,
    }} onClick={() => setOpen(false)}>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px',
          background: '#111', border: '1px solid #1e1e1e',
          borderRadius: '14px', overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #1e1e1e' }}>
          <span style={{ fontSize: '16px', color: '#4a4a4a' }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search tasks, projects..."
            style={{
              flex: 1, background: 'transparent', border: 'none',
              fontSize: '15px', color: '#fff', outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {loading && (
            <div style={{ width: '14px', height: '14px', border: '2px solid #2a2a2a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          )}
          <span style={{ fontSize: '11px', color: '#4a4a4a', padding: '3px 8px', background: '#1a1a1a', borderRadius: '4px' }}>
            ESC
          </span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>

          {/* Empty state */}
          {!query && (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⌨️</div>
              <div style={{ fontSize: '13px', color: '#4a4a4a' }}>Type to search tasks and projects</div>
            </div>
          )}

          {/* No results */}
          {query && !loading && allResults.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
              <div style={{ fontSize: '13px', color: '#4a4a4a' }}>No results for "{query}"</div>
            </div>
          )}

          {/* Projects */}
          {results.projects.length > 0 && (
            <div>
              <div style={{ padding: '8px 20px 4px', fontSize: '10px', fontWeight: '700', color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Projects
              </div>
              {results.projects.map((project, i) => {
                const idx = i;
                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelect({ ...project, type: 'project' })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 20px', cursor: 'pointer',
                      background: selected === idx ? 'rgba(99,102,241,0.1)' : 'transparent',
                      borderLeft: `2px solid ${selected === idx ? '#6366f1' : 'transparent'}`,
                    }}
                    onMouseEnter={() => setSelected(idx)}
                  >
                    <div style={{ width: '28px', height: '28px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>
                      📁
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>
                        {highlight(project.title, query)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '2px' }}>
                        {project.team?.name} · {project.status}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#4a4a4a' }}>Project →</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <div style={{ padding: '8px 20px 4px', fontSize: '10px', fontWeight: '700', color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Tasks
              </div>
              {results.tasks.map((task, i) => {
                const idx = results.projects.length + i;
                return (
                  <div
                    key={task.id}
                    onClick={() => handleSelect({ ...task, type: 'task' })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 20px', cursor: 'pointer',
                      background: selected === idx ? 'rgba(99,102,241,0.1)' : 'transparent',
                      borderLeft: `2px solid ${selected === idx ? '#6366f1' : 'transparent'}`,
                    }}
                    onMouseEnter={() => setSelected(idx)}
                  >
                    <div style={{ width: '28px', height: '28px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: priorityColor(task.priority) }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: task.status === 'done' ? '#4a4a4a' : '#fff', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                        {highlight(task.title, query)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '2px' }}>
                        {task.project?.title} · {task.status.replace('_', ' ')}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#4a4a4a' }}>Task →</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '8px 20px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: '16px' }}>
          {[
            { key: '↑↓', label: 'Navigate' },
            { key: '↵', label: 'Open' },
            { key: 'ESC', label: 'Close' },
          ].map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '10px', padding: '2px 6px', background: '#1a1a1a', borderRadius: '4px', color: '#4a4a4a', fontFamily: 'monospace' }}>{s.key}</span>
              <span style={{ fontSize: '10px', color: '#2a2a2a' }}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}