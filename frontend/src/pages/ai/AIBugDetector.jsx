import { useState } from 'react';
import Layout from '../../components/Layout';

export default function AIBugDetector() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a senior code reviewer. Analyze this ${language} code for bugs, security issues, and improvements.

Code:
${code}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "summary": "brief overall assessment",
  "score": 85,
  "bugs": [
    { "severity": "high|medium|low", "line": "line number or range", "issue": "description", "fix": "how to fix" }
  ],
  "security": [
    { "severity": "high|medium|low", "issue": "description", "fix": "how to fix" }
  ],
  "improvements": [
    { "issue": "description", "suggestion": "what to do" }
  ]
}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResults(parsed);
    } catch (err) {
      setError('Failed to analyze code. Please try again.');
    }
    setLoading(false);
  };

  const severityConfig = {
    high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
    medium: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', border: 'rgba(99,102,241,0.2)' },
    low: { bg: '#1a1a1a', color: '#4a4a4a', border: '#2a2a2a' },
  };

  const scoreColor = (s) => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#6366f1';
    return '#ef4444';
  };

  return (
    <Layout title="Bug Detector">

      <div style={{ maxWidth: '760px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '4px 12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>🔍 Powered by Claude AI</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            AI Bug Detector
          </div>
          <div style={{ fontSize: '13px', color: '#4a4a4a' }}>
            Paste your code and get instant AI analysis of bugs, security issues and improvements
          </div>
        </div>

        {/* Input */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

          {/* Language selector */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {['javascript', 'typescript', 'python', 'php', 'java', 'go'].map(lang => (
              <button key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '5px 12px',
                  background: language === lang ? '#6366f1' : 'transparent',
                  border: `1px solid ${language === lang ? '#6366f1' : '#1e1e1e'}`,
                  borderRadius: '6px', color: language === lang ? '#fff' : '#4a4a4a',
                  fontSize: '11px', fontWeight: '500', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={`// Paste your ${language} code here...\n\nfunction example() {\n  // Your code\n}`}
            rows={12}
            style={{
              width: '100%', background: '#0a0a0a', border: '1px solid #1e1e1e',
              borderRadius: '8px', padding: '14px', fontSize: '12px',
              color: '#e2e8f0', fontFamily: 'monospace', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.7',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#1e1e1e'}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#4a4a4a' }}>
              {code.split('\n').length} lines · {code.length} chars
            </span>
            <button
              onClick={analyzeCode}
              disabled={loading || !code.trim()}
              style={{
                padding: '10px 24px', background: '#6366f1',
                border: 'none', borderRadius: '8px', color: '#fff',
                fontSize: '13px', fontWeight: '600',
                cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                opacity: !code.trim() ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analyzing...
                </>
              ) : '🔍 Analyze Code'}
            </button>
          </div>
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
              // AI is scanning your code for issues...
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div>

            {/* Score + Summary */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '12px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '36px', fontWeight: '900', color: scoreColor(results.score) }}>
                  {results.score}
                </div>
                <div style={{ fontSize: '10px', color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Code Score
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '6px', background: '#1e1e1e', borderRadius: '6px', marginBottom: '10px' }}>
                  <div style={{ height: '6px', background: scoreColor(results.score), borderRadius: '6px', width: `${results.score}%`, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{results.summary}</div>
              </div>
            </div>

            {/* Bugs */}
            {results.bugs?.length > 0 && (
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Bugs</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{results.bugs.length}</span>
                </div>
                {results.bugs.map((bug, i) => {
                  const sc = severityConfig[bug.severity] || severityConfig.low;
                  return (
                    <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            {bug.severity}
                          </span>
                          {bug.line && <span style={{ fontSize: '11px', color: '#4a4a4a', fontFamily: 'monospace' }}>Line {bug.line}</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{bug.issue}</div>
                      <div style={{ fontSize: '12px', color: '#6366f1' }}>→ {bug.fix}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Security */}
            {results.security?.length > 0 && (
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Security Issues</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{results.security.length}</span>
                </div>
                {results.security.map((sec, i) => {
                  const sc = severityConfig[sec.severity] || severityConfig.low;
                  return (
                    <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {sec.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{sec.issue}</div>
                      <div style={{ fontSize: '12px', color: '#6366f1' }}>→ {sec.fix}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Improvements */}
            {results.improvements?.length > 0 && (
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Improvements</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>{results.improvements.length}</span>
                </div>
                {results.improvements.map((imp, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{imp.issue}</div>
                    <div style={{ fontSize: '12px', color: '#6366f1' }}>→ {imp.suggestion}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}