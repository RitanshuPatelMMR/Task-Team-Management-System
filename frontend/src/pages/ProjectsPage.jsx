import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StatusBadge = ({ value }) => {
  const colors = {
    'Active':    ['#d1fae5','#065f46'],
    'Planned':   ['#dbeafe','#1e40af'],
    'On Hold':   ['#fef3c7','#92400e'],
    'Completed': ['#ede9fe','#5b21b6'],
  };
  const [bg, color] = colors[value] || ['#f3f4f6','#374151'];
  return <span style={{ background:bg, color, padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:500 }}>{value}</span>;
};

const Label = ({ children }) => (
  <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6, color:'var(--foreground)' }}>{children}</label>
);

function MemberAvatars({ members = [] }) {
  const show = members.slice(0, 3);
  const extra = members.length - 3;
  return (
    <div style={{ display:'flex', alignItems:'center' }}>
      {show.map((m, i) => (
        <div key={m.id} style={{
          width:24, height:24, borderRadius:'50%',
          background:'#d1fae5', color:'#065f46',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:9, fontWeight:700,
          border:'2px solid var(--card)',
          marginLeft: i === 0 ? 0 : -6,
          flexShrink: 0,
        }}>
          {m.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width:24, height:24, borderRadius:'50%',
          background:'var(--muted)', color:'var(--muted-foreground)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:9, fontWeight:700, border:'2px solid var(--card)', marginLeft:-6,
        }}>+{extra}</div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState({ name:'', description:'', status:'Planned', start_date:'', end_date:'' });

  const fetchProjects = () => {
    api.get(`/projects?search=${search}&status=${status}`).then(({ data }) => setProjects(data.data));
  };

  useEffect(() => { fetchProjects(); }, [search, status]);

  const createProject = async () => {
    try {
      await api.post('/projects', { ...form, start_date: form.start_date||null, end_date: form.end_date||null });
      setOpen(false);
      setForm({ name:'', description:'', status:'Planned', start_date:'', end_date:'' });
      fetchProjects();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const statusClass = { 'Active':'status-active', 'Planned':'status-planned', 'On Hold':'status-onhold', 'Completed':'status-completed' };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-breadcrumb"><span>Projects</span></div>
        </div>
        <div className="page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Projects</h1>
              <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:'2px 0 0' }}>{projects.length} projects total</p>
            </div>
            {['Admin','Manager'].includes(user?.role) && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button style={{ padding:'8px 18px', background:'var(--brand-600)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
                    + New Project
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:'4px 0 0' }}>Add a new project for your team.</p>
                  </DialogHeader>
                  <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:8 }}>
                    <div><Label>Project name</Label><Input placeholder="e.g. Website Redesign" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                    <div><Label>Description</Label><Input placeholder="Brief description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                    <div>
                      <Label>Status</Label>
                      <select style={{ width:'100%', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)' }} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                        <option>Planned</option><option>Active</option><option>Completed</option><option>On Hold</option>
                      </select>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div><Label>Start date</Label><Input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} /></div>
                      <div><Label>End date</Label><Input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} /></div>
                    </div>
                    <button onClick={createProject} style={{ padding:'10px', background:'var(--brand-600)', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4 }}>
                      Create Project
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{ maxWidth:280 }}
            />
            <select
              style={{ border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)' }}
              value={status}
              onChange={e=>setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option>Planned</option><option>Active</option><option>Completed</option><option>On Hold</option>
            </select>
          </div>

          {/* Empty state */}
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>
              <p style={{ fontWeight:500, marginBottom:4 }}>No projects yet</p>
              <p style={{ fontSize:13 }}>Create your first project to get started.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
              {projects.map(p => (
                <div
                  key={p.id}
                  className={`project-card ${statusClass[p.status]||''}`}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  // ── FIX: prevent card from stretching ──
                  style={{ overflow:'hidden', minWidth:0 }}
                >
                  {/* Title row — clamped to 1 line */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      letterSpacing: '-0.2px',
                      // ── FIX: truncate long name to 1 line ──
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                      flex: 1,
                    }}>
                      {p.name}
                    </h3>
                    <div style={{ flexShrink: 0 }}>
                      <StatusBadge value={p.status} />
                    </div>
                  </div>

                  {/* Description — clamped to 2 lines */}
                  <p style={{
                    fontSize: 13,
                    color: 'var(--muted-foreground)',
                    margin: '0 0 14px',
                    lineHeight: 1.5,
                    // ── FIX: clamp to 2 lines with ellipsis ──
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    minHeight: '2.8em', // keeps card height consistent even for short descriptions
                  }}>
                    {p.description || 'No description'}
                  </p>

                  {/* Members row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <MemberAvatars members={p.members||[]} />
                    <span style={{ fontSize:12, color:'var(--muted-foreground)' }}>{p.members?.length||0} members</span>
                  </div>

                  {/* Dates */}
                  {(p.start_date || p.end_date) && (
                    <div style={{ fontSize:12, color:'var(--muted-foreground)', marginTop:4, display:'flex', alignItems:'center', gap:4, overflow:'hidden' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8"  y1="2" x2="8"  y2="6"/>
                        <line x1="3"  y1="10" x2="21" y2="10"/>
                      </svg>
                      {p.start_date && <span style={{ whiteSpace:'nowrap' }}>{p.start_date}</span>}
                      {p.start_date && p.end_date && <span>→</span>}
                      {p.end_date && <span style={{ whiteSpace:'nowrap' }}>{p.end_date}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}