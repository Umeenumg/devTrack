import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 80px', borderBottom: '1px solid #1e1e1e',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(10px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: '#6366f1', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '800' }}>P</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700' }}>ProjectFlow</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Features', 'Pricing', 'Docs'].map(item => (
            <span key={item} style={{ fontSize: '14px', color: '#4a4a4a', cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#4a4a4a'}
            >{item}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate('/login')}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
          >
            Sign in
          </button>
          <button onClick={() => navigate('/register')}
            style={{ padding: '8px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Get started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 80px 80px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px', padding: '6px 14px', marginBottom: '32px',
        }}>
          <div style={{ width: '6px', height: '6px', background: '#6366f1', borderRadius: '50%' }} />
          <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>Now with AI features →</span>
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-2px', marginBottom: '20px' }}>
          Ship faster.<br />
          <span style={{ color: '#6366f1' }}>Stay aligned.</span>
        </h1>

        <p style={{ fontSize: '18px', color: '#4a4a4a', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          AI-powered project management for modern teams. Track tasks, manage sprints, ship on time.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '60px' }}>
          <button onClick={() => navigate('/register')}
            style={{ padding: '13px 28px', background: '#6366f1', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Get started free
          </button>
          <button
            style={{ padding: '13px 28px', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '10px', color: '#fff', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
          >
            View demo →
          </button>
        </div>

        {/* Dashboard mockup */}
        <div style={{
          background: '#111', border: '1px solid #1e1e1e',
          borderRadius: '16px', padding: '24px',
          maxWidth: '900px', margin: '0 auto',
          boxShadow: '0 40px 80px rgba(99,102,241,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', height: '300px' }}>
            <div style={{ background: '#0f0f0f', borderRadius: '8px', padding: '16px' }}>
              {['Overview', 'Projects', 'My Tasks', 'Notifications'].map(item => (
                <div key={item} style={{ padding: '8px 10px', borderRadius: '6px', fontSize: '12px', color: item === 'Overview' ? '#fff' : '#4a4a4a', background: item === 'Overview' ? 'rgba(99,102,241,0.15)' : 'transparent', marginBottom: '2px' }}>
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', alignContent: 'start' }}>
              {[
                { label: 'Projects', value: '12' },
                { label: 'Open Tasks', value: '48' },
                { label: 'Done', value: '89' },
              ].map(s => (
                <div key={s.label} style={{ background: '#0f0f0f', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
              <div style={{ background: '#0f0f0f', borderRadius: '8px', padding: '16px', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '11px', color: '#4a4a4a', marginBottom: '8px' }}>Overall progress</div>
                <div style={{ height: '4px', background: '#1e1e1e', borderRadius: '4px' }}>
                  <div style={{ height: '4px', background: '#6366f1', borderRadius: '4px', width: '74%' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '6px', textAlign: 'right' }}>74%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', padding: '32px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px' }}>
          {[
            { value: '10,000+', label: 'Teams' },
            { value: '500k+', label: 'Tasks shipped' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#4a4a4a', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Built for focus
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' }}>
            Everything your team needs
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '⚡', title: 'AI Task Generator', desc: 'Describe your project and let AI generate all tasks, subtasks and priorities automatically.' },
            { icon: '📅', title: 'Sprint Planner', desc: 'AI analyzes your backlog and plans optimal sprints based on team capacity and deadlines.' },
            { icon: '🔍', title: 'Bug Detector', desc: 'Paste your code and get instant AI analysis of potential bugs, security issues and improvements.' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#111', border: '1px solid #1e1e1e',
              borderRadius: '12px', padding: '24px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
            >
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.6' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '0 80px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px' }}>
            Scalable pricing
          </h2>
          <p style={{ fontSize: '14px', color: '#4a4a4a' }}>Start free, scale as your team grows</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { plan: 'Free', price: '$0', period: 'forever', features: ['Up to 3 projects', '5 team members', 'Basic AI features', 'Community support'], cta: 'Get started', accent: false },
            { plan: 'Pro', price: '$12', period: 'per month', features: ['Unlimited projects', 'Unlimited members', 'Full AI suite', 'Priority support', 'Advanced analytics'], cta: 'Start free trial', accent: true },
            { plan: 'Enterprise', price: 'Custom', period: 'contact us', features: ['Everything in Pro', 'SSO / SAML', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], cta: 'Contact us', accent: false },
          ].map(p => (
            <div key={p.plan} style={{
              background: p.accent ? 'rgba(99,102,241,0.08)' : '#111',
              border: `1px solid ${p.accent ? '#6366f1' : '#1e1e1e'}`,
              borderRadius: '12px', padding: '28px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: p.accent ? '#6366f1' : '#4a4a4a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {p.plan}
              </div>
              <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '4px' }}>{p.price}</div>
              <div style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '24px' }}>{p.period}</div>
              <div style={{ marginBottom: '24px' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#6366f1', fontSize: '12px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#888' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/register')}
                style={{
                  width: '100%', padding: '11px',
                  background: p.accent ? '#6366f1' : 'transparent',
                  border: `1px solid ${p.accent ? '#6366f1' : '#1e1e1e'}`,
                  borderRadius: '8px', color: '#fff',
                  fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e1e1e', padding: '32px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '24px', background: '#6366f1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}>P</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>ProjectFlow</span>
        </div>
        <span style={{ fontSize: '12px', color: '#4a4a4a' }}>© 2026 ProjectFlow. All rights reserved.</span>
      </footer>

    </div>
  );
}