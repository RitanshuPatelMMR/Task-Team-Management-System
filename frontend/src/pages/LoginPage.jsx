import { useState }    from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../context/AuthContext';
import api             from '../api/axios';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const EyeIcon = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const FEATURES = [
  'Role-based access for Admin, Manager & Developer',
  'Real-time project & task tracking',
  'Team collaboration with comments',
  'Analytics dashboard with insights',
];

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-shell">

      {/* Left brand panel */}
      <div className="login-panel-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 44, height: 44, background: 'rgba(255,255,255,0.15)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>TaskFlow</div>
              <div style={{ fontSize: 11, color: 'rgba(167,243,208,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Team Manager</div>
            </div>
          </div>

          <h1 style={{
            fontSize: 32, fontWeight: 700, color: '#fff',
            letterSpacing: '-0.8px', lineHeight: 1.2, margin: '0 0 16px',
          }}>
            Manage your team.<br />
            <span style={{ color: '#6ee7b7' }}>Ship faster.</span>
          </h1>

          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.75)', lineHeight: 1.7, marginBottom: 40 }}>
            A complete task and project management platform for modern engineering teams.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6ee7b7', flexShrink: 0, marginTop: 1,
                }}>
                  <CheckIcon />
                </div>
                <span style={{ fontSize: 13.5, color: 'rgba(209,250,229,0.85)', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <p style={{ fontSize: 12, color: 'rgba(167,243,208,0.5)', textAlign: 'center' }}>
            Built for clarity. Designed for speed.
          </p>
        </div> */}
      </div>

      {/* Right form panel */}
      <div className="login-panel-right">
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6, color: 'var(--foreground)' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
              Sign in to your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: '#fff1f2', border: '1px solid #fecdd3',
                color: '#e11d48', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
                Email address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" required
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid var(--border)', borderRadius: 8,
                  fontSize: 14, background: 'var(--background)',
                  color: 'var(--foreground)', outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '10px 42px 10px 14px',
                    border: '1px solid var(--border)', borderRadius: 8,
                    fontSize: 14, background: 'var(--background)',
                    color: 'var(--foreground)', outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted-foreground)', padding: 0, display: 'flex',
                  }}
                  tabIndex={-1}
                >
                  <EyeIcon off={showPass} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px',
                background: loading ? '#6ee7b7' : '#059669',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s', marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#047857'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#059669'; }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', textAlign: 'center', marginTop: 24 }}>
            Contact your administrator to create an account.
          </p>
        </div>
      </div>
    </div>
  );
}