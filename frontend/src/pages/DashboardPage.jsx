import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const icons = {
  projects: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  tasks:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>,
  check:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  clock:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  alert:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const STAT_CONFIG = [
  { key: 'totalProjects',  label: 'Total Projects', icon: icons.projects, cls: 'stat-emerald' },
  { key: 'totalTasks',     label: 'Total Tasks',     icon: icons.tasks,   cls: 'stat-teal'    },
  { key: 'completedTasks', label: 'Completed',       icon: icons.check,   cls: 'stat-green'   },
  { key: 'pendingTasks',   label: 'Pending',         icon: icons.clock,   cls: 'stat-amber'   },
  { key: 'overdueTasks',   label: 'Overdue',         icon: icons.alert,   cls: 'stat-rose'    },
];

const STATUS_COLORS   = { 'Todo': '#10b981', 'In Progress': '#059669', 'Review': '#06b6d4', 'Completed': '#8b5cf6' };
const PRIORITY_COLORS = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#ef4444' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <span style={{ fontWeight: 500 }}>{payload[0].name || payload[0].payload?.name}</span>
      <span style={{ marginLeft: 8, color: 'var(--muted-foreground)' }}>{payload[0].value}</span>
    </div>
  );
};

const Skeleton = ({ w = '100%', h = 20, r = 6 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }} />
);

export default function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const { user }              = useAuth();

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusData   = stats?.tasksByStatus?.map(s => ({ name: s.status,   value: Number(s.count), color: STATUS_COLORS[s.status]     || '#10b981' })) || [];
  const priorityData = stats?.tasksByPriority?.map(p => ({ name: p.priority, value: Number(p.count), color: PRIORITY_COLORS[p.priority] || '#10b981' })) || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-breadcrumb"><span>Dashboard</span></div>
        </div>

        <div className="page">

          {/* Welcome banner */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            borderRadius: 14, padding: '20px 28px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 180, height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -40, right: 60, width: 140, height: 140, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px' }}>
                {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
              </h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(209,250,229,0.8)', fontSize: 13 }}>
                Here's what's happening across your projects today.
              </p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(167,243,208,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{user?.role}</div>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
            {STAT_CONFIG.map(({ key, label, icon, cls }) => (
              <div key={key} className="stat-card">
                <div className={`stat-icon ${cls}`}>{icon}</div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">
                  {loading ? <Skeleton w={40} h={28} /> : (stats?.[key] ?? 0)}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.2px' }}>Tasks by status</h3>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}><Skeleton w={160} h={160} r="50%" /></div>
              ) : statusData.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13, padding: '30px 0' }}>No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {statusData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: 'var(--foreground)' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.2px' }}>Tasks by priority</h3>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
                  <Skeleton h={32} /><Skeleton h={32} /><Skeleton h={32} />
                </div>
              ) : priorityData.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13, padding: '30px 0' }}>No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={priorityData} barSize={32} margin={{ left: -16, right: 8 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent)', radius: 4 }} />
                    <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]}>
                      {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Overview row */}
          {!loading && stats && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.2px' }}>Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  {
                    label: 'Completion rate',
                    value: stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : '—',
                    sub: `${stats.completedTasks} of ${stats.totalTasks} tasks done`,
                    color: '#10b981',
                  },
                  {
                    label: 'Pending workload',
                    value: stats.pendingTasks,
                    sub: 'Tasks not yet completed',
                    color: '#f59e0b',
                  },
                  {
                    label: 'Overdue items',
                    value: stats.overdueTasks,
                    sub: stats.overdueTasks === 0 ? 'You\'re all caught up!' : 'Need immediate attention',
                    color: stats.overdueTasks > 0 ? '#ef4444' : '#10b981',
                  },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--muted)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 6 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </main>
    </div>
  );
}