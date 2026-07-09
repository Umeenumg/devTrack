import { useState } from 'react';
import Layout from '../../components/Layout';

export default function AITaskGenerator() {
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTasks = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError('');
    setTasks([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a project management expert. Based on this project description, generate a list of 6-8 specific tasks needed to complete the project.

Project: ${description}

Respond ONLY with a valid JSON array, no markdown, no explanation:
[
  {
    "title": "task title",
    "description": "brief description",
    "priority": "high|medium|low",
    "estimated_days": number
  }
]`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setTasks(parsed);
    } catch (err) {
      setError('Failed to generate tasks. Please try again.');
    }
    setLoading(false);
  };

  const priorityColor = (p) => {
    if (p === 'high') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };
    if (p === 'medium') return { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' };
    return { bg: '#1a1a1a', color: '#4a4a4a' };
  };

  return (
    <Layout title="AI Task Generator">

      <div style={{ maxWidth: '760px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '4px 12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>⚡ Powered by Claude AI</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            AI Task Generator
          </div>
          <div style={{ fontSize: '13px', color: '#4a4a4a' }}>
            Describe your project and let AI generate all the tasks automatically
          </div>
        </div>

        {/* Input */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#4a4a4a', fontWeight: '500', marginBottom: '8px' }}>
            Project Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Build a mobile banking app with biometric login, real-time transactions, and spending analytics..."
            rows={4}
            style={{
              width: '100%', background: '#0f0f0f', border: '1px solid #1e1e1e',
              borderRadius: '8px', padding: '12px 14px', fontSize: '13px',
              color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#1e1e1e'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
              {description.length} characters
            </span>
            <button
              onClick={generateTasks}
              disabled={loading || !description.trim()}
              style={{
                padding: '10px 24px', background: loading || !description.trim() ? '#3730a3' : '#6366f1',
                border: 'none', borderRadius: '8px', color: '#fff',
                fontSize: '13px', fontWeight: '600', cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif', opacity: !description.trim() ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating...
                </>
              ) : '⚡ Generate Tasks'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '16px', fontFamily: 'monospace' }}>
              // AI is analyzing your project...
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #1a1a1a' }}>
                <div style={{ height: '14px', background: '#1a1a1a', borderRadius: '4px', width: `${60 + i * 10}%`, marginBottom: '8px' }} />
                <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', width: '40%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {tasks.length > 0 && (
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>

            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                Generated Tasks <span style={{ color: '#6366f1' }}>{tasks.length}</span>
              </span>
              <button
                onClick={() => { setTasks([]); setDescription(''); }}
                style={{ fontSize: '11px', color: '#4a4a4a', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>

            {tasks.map((task, i) => {
              const pc = priorityColor(task.priority);
              return (
                <div key={i} style={{
                  padding: '14px 20px', borderBottom: '1px solid #1a1a1a',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700', color: '#6366f1', flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{task.title}</div>
                      <div style={{ display: 'flex', gap: '6px', marginLeft: '12px', flexShrink: 0 }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', background: pc.bg, color: pc.color }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '10px', color: '#4a4a4a', padding: '2px 8px', borderRadius: '4px', background: '#1a1a1a' }}>
                          ~{task.estimated_days}d
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#4a4a4a', lineHeight: '1.5' }}>{task.description}</div>
                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}