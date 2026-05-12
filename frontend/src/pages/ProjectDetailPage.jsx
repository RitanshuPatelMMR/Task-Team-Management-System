import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StatusBadge = ({ value }) => {
  const colors = {
    'Active':['#d1fae5','#065f46'], 'Planned':['#dbeafe','#1e40af'],
    'On Hold':['#fef3c7','#92400e'], 'Completed':['#ede9fe','#5b21b6'],
    'Todo':['#f3f4f6','#374151'], 'In Progress':['#dbeafe','#1e40af'],
    'Review':['#fef3c7','#92400e'],
    'Low':['#d1fae5','#065f46'], 'Medium':['#fef3c7','#92400e'], 'High':['#fee2e2','#991b1b'],
  };
  const [bg, color] = colors[value] || ['#f3f4f6','#374151'];
  return <span style={{ background:bg, color, padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:500 }}>{value}</span>;
};

function Avatar({ name, size=28 }) {
  const initials = name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#d1fae5', color:'#065f46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:600, flexShrink:0 }}>
      {initials}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [users, setUsers]     = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [memberOpen, setMemberOpen]   = useState(false);

  const fetchProject = () => api.get(`/projects/${id}`).then(({ data }) => { setProject(data); setSelectedIds(data.members.map(m=>m.id)); });
  const fetchTasks   = () => api.get(`/tasks?project_id=${id}`).then(({ data }) => setTasks(data.data));
  const fetchUsers   = () => api.get('/users').then(({ data }) => setUsers(data.data));

  useEffect(() => { fetchProject(); fetchTasks(); }, [id]);

  const assignMembers = async () => {
    await api.post(`/projects/${id}/members`, { user_ids: selectedIds });
    setMemberOpen(false); fetchProject();
  };

  const toggleId = uid => setSelectedIds(prev => prev.includes(uid) ? prev.filter(x=>x!==uid) : [...prev, uid]);

  if (!project) return <div className="app-shell"><Sidebar /><main className="app-main"><div style={{ padding:40, color:'var(--muted-foreground)' }}>Loading...</div></main></div>;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-breadcrumb">
            <span style={{ cursor:'pointer', color:'var(--muted-foreground)' }} onClick={()=>navigate('/projects')}>Projects</span>
            <span style={{ color:'var(--muted-foreground)' }}>/</span>
            <span>{project.name}</span>
          </div>
        </div>
        <div className="page">

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                <h1 className="page-title">{project.name}</h1>
                <StatusBadge value={project.status} />
              </div>
              <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:0 }}>{project.description || 'No description'}</p>
              {(project.start_date || project.end_date) && (
                <p style={{ fontSize:12, color:'var(--muted-foreground)', margin:'6px 0 0', display:'flex', alignItems:'center', gap:4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {project.start_date} {project.start_date && project.end_date && '→'} {project.end_date}
                </p>
              )}
            </div>
          </div>

          {/* Members */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 24px', marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ margin:0, fontSize:14, fontWeight:600 }}>Members ({project.members?.length})</h3>
              {['Admin','Manager'].includes(user?.role) && (
                <Dialog open={memberOpen} onOpenChange={o=>{ if(o) fetchUsers(); setMemberOpen(o); }}>
                  <DialogTrigger asChild>
                    <button style={{ padding:'6px 14px', background:'#059669', color:'#fff', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      Assign Members
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Members</DialogTitle>
                      <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:'4px 0 0' }}>Select team members for this project.</p>
                    </DialogHeader>
                    <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto', margin:'12px 0' }}>
                      {users.map(u=>(
                        <label key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:8, cursor:'pointer', background: selectedIds.includes(u.id) ? '#ecfdf5' : 'transparent', border:'1px solid', borderColor: selectedIds.includes(u.id) ? '#a7f3d0' : 'transparent' }}>
                          <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={()=>toggleId(u.id)} style={{ accentColor:'#059669' }} />
                          <Avatar name={u.name} size={28} />
                          <div>
                            <div style={{ fontSize:13, fontWeight:500 }}>{u.name}</div>
                            <div style={{ fontSize:11, color:'var(--muted-foreground)' }}>{u.role}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button onClick={assignMembers} style={{ width:'100%', padding:'10px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                      Save Members
                    </button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {project.members?.map(m=>(
                <div key={m.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', background:'var(--muted)', borderRadius:99, fontSize:13 }}>
                  <Avatar name={m.name} size={22} />
                  <span>{m.name}</span>
                  <span style={{ fontSize:11, color:'var(--muted-foreground)' }}>· {m.role}</span>
                </div>
              ))}
              {project.members?.length === 0 && <p style={{ fontSize:13, color:'var(--muted-foreground)' }}>No members assigned yet.</p>}
            </div>
          </div>

          {/* Tasks */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)' }}>
              <h3 style={{ margin:0, fontSize:14, fontWeight:600 }}>Tasks ({tasks.length})</h3>
            </div>
            {tasks.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'var(--muted-foreground)', fontSize:13 }}>No tasks yet</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>{['Title','Assignee','Status','Priority','Due Date'].map(h=><th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {tasks.map(t=>(
                    <tr key={t.id} onClick={()=>navigate(`/tasks/${t.id}`)}>
                      <td style={{ fontWeight:500 }}>{t.title}</td>
                      <td>
                        {t.assignee ? (
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <Avatar name={t.assignee.name} size={24} />
                            <span>{t.assignee.name}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td><StatusBadge value={t.status} /></td>
                      <td><StatusBadge value={t.priority} /></td>
                      <td style={{ color:'var(--muted-foreground)' }}>{t.due_date||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}