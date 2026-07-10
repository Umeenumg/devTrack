import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#4a4a4a', '#22c55e'];

export default function Analytics({ tasks, projects }) {
  const [standupLoading, setStandupLoading] = useState(false);
  const [standup, setStandup] = useState(null);

  // Tasks by status data
  const statusData = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#4a4a4a' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#6366f1' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#22c55e' },
  ];

  // Tasks by priority
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
  ];

  // Projects progress
  const projectsData = projects.slice(0, 6).map(p => ({
    name: p.title.length > 15 ? p.title.slice(0, 15) + '...' : p.title,
    tasks: p.tasks_count || 0,
    progress: p.status === 'completed' ? 100 : p.status === 'active' ? 55 : 20,
  }));

  // Velocity — simulate weekly data
  const velocityData = [
    { week: 'W1', done: 3, created: 5 },
    { week: 'W2', done: 5, created: 4 },
    { week: 'W3', done: 4, created: 6 },
    { week: 'W4', done: 7, created: 3 },
    { week: 'W5', done: tasks.filter(t => t.status === 'done').length, created: tasks.length },
  ];

  const generateStandup = async () => {
    setStandupLoading(true);
    setStandup(null);

    const doneTasks = tasks.filter(t => t.status === 'done').map(t => t.title);
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').map(t => t.title);
    const todoTasks = tasks.filter(t => t.status === 'todo').map(t => t.title);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Generate a professional daily standup report based on this data:

Completed tasks: ${doneTasks.join(', ') || 'none'}
In progress tasks: ${inProgressTasks.join(', ') || 'none'}
Todo tasks: ${todoTasks.join(', ') || 'none'}
Total projects: ${projects.length}

Respond ONLY with a valid JSON object, no markdown:
{
  "yesterday": "what was accomplished",
  "today": "what will be worked on today",
  "blockers": "any blockers or impediments",
  "health": "overall team health: good/warning/critical",
  "tip": "one actionable tip to improve velocity"
}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      setStandup(JSON.parse(clean));
    } catch (err) {}
    setStandupLoading(false);
  };

  const healthConfig = {
    good: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: '✓ Good' },
    warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '⚠ Warning' },
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '✕ Critical' },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '4px' }}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ fontSize: '13px', color: p.color || '#fff', fontWeight: '600' }}>
              {p.name}: {p.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total Tasks', value: tasks.length, color: '#fff' },
          { label: 'Completion Rate', value: `${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%`, color: '#6366f1' },
          { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, color: '#fff' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#fff' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px 20px' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#4a4a4a' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

        {/* Velocity chart */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Team Velocity</div>
          <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '16px' }}>Tasks done vs created per week</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="week" tick={{ fill: '#4a4a4a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a4a4a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="done" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Done" />
              <Line type="monotone" dataKey="created" stroke="#2a2a2a" strokeWidth={2} dot={{ fill: '#2a2a2a', r: 4 }} name="Created" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by status pie */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Tasks by Status</div>
          <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '16px' }}>Distribution overview</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {statusData.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
                    <span style={{ fontSize: '12px', color: '#888' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

        {/* Projects progress */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Projects Progress</div>
          <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '16px' }}>Progress by project</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={projectsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#4a4a4a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#4a4a4a', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="progress" fill="#6366f1" radius={[0, 4, 4, 0]} name="Progress %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority breakdown */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Tasks by Priority</div>
          <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '16px' }}>Priority distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="name" tick={{ fill: '#4a4a4a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a4a4a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Tasks">
                <Cell fill="#ef4444" />
                <Cell fill="#6366f1" />
                <Cell fill="#4a4a4a" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Standup */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>AI Standup Report</div>
            <div style={{ fontSize: '11px', color: '#4a4a4a' }}>Generate your daily standup automatically</div>
          </div>
          <button
            onClick={generateStandup}
            disabled={standupLoading}
            style={{
              padding: '9px 20px', background: '#6366f1',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontSize: '12px', fontWeight: '600', cursor: standupLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {standupLoading ? (
              <>
                <div style={{ width: '10px', height: '10px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Generating...
              </>
            ) : '⚡ Generate Standup'}
          </button>
        </div>

        {standup && (
          <div>
            {/* Health badge */}
            {standup.health && (() => {
              const hc = healthConfig[standup.health] || healthConfig.good;
              return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: hc.bg, border: `1px solid ${hc.color}30`, borderRadius: '6px', padding: '4px 12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: hc.color, fontWeight: '600' }}>{hc.label}</span>
                </div>
              );
            })()}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              {[
                { label: '✅ Yesterday', content: standup.yesterday, color: '#22c55e' },
                { label: '🎯 Today', content: standup.today, color: '#6366f1' },
              ].map(item => (
                <div key={item.label} style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: item.color, marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{item.content}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: '🚧 Blockers', content: standup.blockers, color: '#ef4444' },
                { label: '💡 AI Tip', content: standup.tip, color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: item.color, marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}