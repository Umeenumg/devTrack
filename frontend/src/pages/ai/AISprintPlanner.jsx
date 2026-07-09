import { useState } from 'react';
import Layout from '../../components/Layout';

export default function AISprintPlanner() {
  const [form, setForm] = useState({
    projectName: '',
    teamSize: '3',
    sprintDuration: '2',
    tasks: '',
  });
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSprints = async () => {
    if (!form.projectName.trim() || !form.tasks.trim()) return;
    setLoading(true);
    setError('');
    setSprints([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an agile project manager. Plan sprints for this project.

Project: ${form.projectName}
Team size: ${form.teamSize} developers
Sprint duration: ${form.sprintDuration} weeks
Tasks to plan:
${form.tasks}

Respond ONLY with a valid JSON array, no markdown, no explanation:
[
  {
    "sprint": 1,
    "goal": "sprint goal",
    "duration": "${form.sprintDuration} weeks",
    "tasks": ["task 1", "task 2", "task 3"],
    "capacity": "estimated story points or days"
  }
]`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setSprints(parsed);
    } catch (err) {
      setError('Failed to generate sprint plan. Please try again.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', background: '#0f0f0f', border: '1px solid #1e1e1e',
    borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
    color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', color: '#4a4a4a',
    fontWeight: '500', marginBottom: '6px',
  };

  const sprintColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

  return (
    <Layout title="Sprint Planner">

      <div style={{ maxWidth: '760px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '4px 12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>📅 Powered by Claude AI</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            AI Sprint Planner
          </div>
          <div style={{ fontSize: '13px', color: '#4a4a4a' }}>
            Let AI organize your backlog into optimal sprints based on team capacity
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Project Name</label>
            <input type="text" placeholder="e.g. E-Commerce Platform"
              value={form.projectName}
              onChange={e => setForm({ ...form, projectName: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Team Size</label>
              <select value={form.teamSize} onChange={e => setForm({ ...form, teamSize: e.target.value })} style={inputStyle}>
                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                  <option key={n} value={n}>{n} developer{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sprint Duration</label>
              <select value={form.sprintDuration} onChange={e => setForm({ ...form, sprintDuration: e.target.value })} style={inputStyle}>
                <option value="1">1 week</option>
                <option value="2">2 weeks</option>
                <option value="3">3 weeks</option>
                <option value="4">4 weeks</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Tasks / Backlog (one per line)</label>
            <textarea
              value={form.tasks}
              onChange={e => setForm({ ...form, tasks: e.target.value })}
              placeholder={`Setup authentication\nBuild dashboard UI\nCreate REST API\nDesign database schema\nWrite unit tests\nDeploy to production`}
              rows={6}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <button
            onClick={generateSprints}
            disabled={loading || !form.projectName.trim() || !form.tasks.trim()}
            style={{
              padding: '10px 24px', background: '#6366f1',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontSize: '13px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              opacity: !form.projectName.trim() || !form.tasks.trim() ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Planning sprints...
              </>
            ) : '📅 Plan Sprints'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#4a4a4a', fontFamily: 'monospace' }}>
              // AI is planning your sprints...
            </div>
          </div>
        )}

        {/* Results */}
        {sprints.length > 0 && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
              Sprint Plan <span style={{ color: '#6366f1' }}>{sprints.length} sprints</span>
            </div>

            {sprints.map((sprint, i) => (
              <div key={i} style={{
                background: '#111', border: '1px solid #1e1e1e',
                borderRadius: '12px', padding: '20px', marginBottom: '10px',
                borderLeft: `3px solid ${sprintColors[i % sprintColors.length]}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      Sprint {sprint.sprint}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4a4a4a' }}>{sprint.goal}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: '500' }}>
                      {sprint.duration}
                    </span>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '4px', background: '#1a1a1a', color: '#4a4a4a' }}>
                      {sprint.capacity}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sprint.tasks.map((task, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#888' }}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}