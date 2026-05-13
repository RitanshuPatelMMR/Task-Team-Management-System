import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../context/AuthContext';
import { useEffect }   from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
    title: 'Project management',
    desc: 'Create and manage projects with status tracking, team assignment, and timeline visibility.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: 'Task tracking',
    desc: 'Assign tasks with priority levels, due dates, and real-time status updates across your team.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Role-based access',
    desc: 'Admin, Manager, and Developer roles with fine-grained permissions and access control.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Analytics dashboard',
    desc: 'Visual charts for task completion rates, priority distribution, and project health overview.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Team comments',
    desc: 'Collaborate directly on tasks with threaded comments and real-time team communication.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Secure JWT auth',
    desc: 'Industry-standard authentication with bcrypt password hashing and token-based sessions.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)' }}>

      {/* Navbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid var(--border)',
        background: 'var(--card)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#059669', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.3px' }}>TaskFlow</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '8px 20px', background: '#059669', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = '#047857'}
          onMouseLeave={e => e.target.style.background = '#059669'}
        >
          Sign in
        </button>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: '90px 32px 70px',
        background: 'linear-gradient(180deg, var(--card) 0%, var(--background) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 99,
          background: '#ecfdf5', color: '#059669',
          fontSize: 12, fontWeight: 500, marginBottom: 24,
          border: '1px solid #a7f3d0',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
          Full-stack task management system
        </div>

        <h1 style={{
          fontSize: 52, fontWeight: 800, letterSpacing: '-1.5px',
          lineHeight: 1.1, color: 'var(--foreground)', margin: '0 0 20px',
          maxWidth: 720, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Manage projects.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Ship faster.
          </span>
        </h1>

        <p style={{
          fontSize: 17, color: 'var(--muted-foreground)', lineHeight: 1.7,
          maxWidth: 540, margin: '0 auto 40px',
        }}>
          A complete task and team management platform with role-based access, real-time tracking, and powerful analytics.
        </p>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 28px', background: '#059669', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.15s, transform 0.1s',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'none'; }}
        >
          Get started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Stats row */}
        {/* <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
          {[
            { val: '3',    label: 'User roles' },
            { val: 'JWT',  label: 'Auth method' },
            { val: 'REST', label: 'API design' },
            { val: 'PSQL', label: 'Database' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.4px' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div> */}
      </section>

      {/* Features grid */}
      <section style={{ padding: '64px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.6px', margin: '0 0 12px', color: 'var(--foreground)' }}>
            Everything your team needs
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: 0 }}>
            Built with Node.js, React, and PostgreSQL for a complete full-stack experience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '22px',
              transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(16,185,129,0.1)'; e.currentTarget.style.borderColor = '#a7f3d0'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#ecfdf5', color: '#059669',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                {icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', color: 'var(--foreground)', letterSpacing: '-0.2px' }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 48px 64px', padding: '48px',
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        borderRadius: 16, textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(16,185,129,0.2)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 220, height: 220, background: 'rgba(5,150,105,0.15)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 10px' }}>
            Ready to get organized?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', margin: '0 0 28px' }}>
            Sign in to access your dashboard and start managing projects.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '11px 28px', background: '#fff', color: '#047857',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', transition: 'transform 0.1s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = '#f0fdf4'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#fff'; }}
          >
            Sign in to TaskFlow →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '20px',
        borderTop: '1px solid var(--border)',
        fontSize: 12, color: 'var(--muted-foreground)',
      }}>
        TaskFlow — Full Stack Developer Assignment · Node.js + React + PostgreSQL
      </footer>

      <style>{`
        @media (max-width: 768px) {
          section:nth-child(3) > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}