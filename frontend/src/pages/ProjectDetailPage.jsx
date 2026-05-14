import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const StatusBadge = ({ value }) => {
  const colors = {
    'Active':    ['#d1fae5','#065f46'],
    'Planned':   ['#dbeafe','#1e40af'],
    'On Hold':   ['#fef3c7','#92400e'],
    'Completed': ['#ede9fe','#5b21b6'],
    'Todo':      ['#f3f4f6','#374151'],
    'In Progress':['#dbeafe','#1e40af'],
    'Review':    ['#fef3c7','#92400e'],
    'Low':       ['#d1fae5','#065f46'],
    'Medium':    ['#fef3c7','#92400e'],
    'High':      ['#fee2e2','#991b1b'],
  };
  const [bg, color] = colors[value] || ['#f3f4f6','#374151'];
  return (
    <span style={{ background:bg, color, padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:500, whiteSpace:'nowrap', flexShrink:0 }}>
      {value}
    </span>
  );
};

function Avatar({ name, size = 28 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || '?';
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:'#d1fae5', color:'#065f46',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size * 0.38, fontWeight:600, flexShrink:0,
    }}>
      {initials}
    </div>
  );
}

const inputStyle = {
  border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px',
  fontSize:13, background:'var(--background)', color:'var(--foreground)',
  width:'100%', boxSizing:'border-box',
};
const selectStyle = {
  border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px',
  fontSize:13, background:'var(--background)', color:'var(--foreground)', width:'100%',
};

export default function ProjectDetailPage() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [project, setProject]     = useState(null);
  const [tasks, setTasks]         = useState([]);
  const [editOpen, setEditOpen]   = useState(false);
  const [editForm, setEditForm]   = useState({ name:'', description:'', status:'', start_date:'', end_date:'' });
  const [editSaving, setEditSaving] = useState(false);

  const canEdit = ['Admin','Manager'].includes(user?.role);

  const fetchProject = () =>
    api.get(`/projects/${id}`).then(({ data }) => {
      setProject(data);
      setEditForm({
        name:        data.name        || '',
        description: data.description || '',
        status:      data.status      || 'Planned',
        start_date:  data.start_date  || '',
        end_date:    data.end_date    || '',
      });
    });

  const fetchTasks = () =>
    api.get(`/tasks?project_id=${id}`).then(({ data }) => setTasks(data.data));

  useEffect(() => { fetchProject(); fetchTasks(); }, [id]);

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      await api.put(`/projects/${id}`, {
        name:        editForm.name,
        description: editForm.description,
        status:      editForm.status,
        start_date:  editForm.start_date  || null,
        end_date:    editForm.end_date    || null,
      });
      await fetchProject();
      setEditOpen(false);
    } catch (err) { alert(err.response?.data?.message); }
    setEditSaving(false);
  };

  if (!project) return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div style={{ padding:40, color:'var(--muted-foreground)' }}>Loading...</div>
      </main>
    </div>
  );

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">

        {/* Topbar breadcrumb — truncate long project name */}
        <div className="topbar">
          <div className="topbar-breadcrumb" style={{ overflow:'hidden', minWidth:0 }}>
            <span
              style={{ cursor:'pointer', color:'var(--muted-foreground)', flexShrink:0 }}
              onClick={() => navigate('/projects')}
            >
              Projects
            </span>
            <span style={{ color:'var(--muted-foreground)', flexShrink:0 }}>/</span>
            {/* ── FIX: truncate long project name in breadcrumb ── */}
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 320,
              display: 'inline-block',
              verticalAlign: 'bottom',
            }}>
              {project.name}
            </span>
          </div>
        </div>

        <div className="page">

          {/* Page header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, gap:16 }}>
            <div style={{ minWidth:0, flex:1 }}>

              {/* Title + status badge — FIX: name wraps, doesn't overflow */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                <h1 style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  letterSpacing: '-0.4px',
                  // ── FIX: wrap long words, don't overflow ──
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: 1.3,
                  minWidth: 0,
                }}>
                  {project.name}
                </h1>
                <StatusBadge value={project.status} />
              </div>

              {/* Description — FIX: wraps + scrolls if very long */}
              {project.description && (
                <p style={{
                  fontSize: 13,
                  color: 'var(--muted-foreground)',
                  margin: '0 0 6px',
                  lineHeight: 1.6,
                  // ── FIX: wrap long words, scroll if extremely long ──
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxHeight: 100,
                  overflowY: 'auto',
                }}>
                  {project.description}
                </p>
              )}

              {/* Dates */}
              {(project.start_date || project.end_date) && (
                <p style={{ fontSize:12, color:'var(--muted-foreground)', margin:0, display:'flex', alignItems:'center', gap:4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8"  y1="2" x2="8"  y2="6"/>
                    <line x1="3"  y1="10" x2="21" y2="10"/>
                  </svg>
                  {project.start_date}
                  {project.start_date && project.end_date && ' → '}
                  {project.end_date}
                </p>
              )}
            </div>

            {/* Edit button — never shrinks */}
            {canEdit && (
              <button
                onClick={() => setEditOpen(o => !o)}
                style={{
                  padding:'7px 18px',
                  background: editOpen ? 'var(--brand-600)' : 'var(--muted)',
                  color: editOpen ? '#fff' : 'var(--foreground)',
                  border:'1px solid var(--border)', borderRadius:8,
                  fontSize:13, fontWeight:500, cursor:'pointer', flexShrink:0,
                }}
              >
                {editOpen ? 'Close' : 'Edit Project'}
              </button>
            )}
          </div>

          {/* Edit panel */}
          {editOpen && canEdit && (
            <div style={{ background:'var(--card)', border:'1px solid var(--brand-500)', borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
              <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:600 }}>Edit Project</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Project name</label>
                  <input style={inputStyle} value={editForm.name} onChange={e => setEditForm(f => ({...f, name:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight:80, resize:'vertical' }} value={editForm.description} onChange={e => setEditForm(f => ({...f, description:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Status</label>
                  <select style={selectStyle} value={editForm.status} onChange={e => setEditForm(f => ({...f, status:e.target.value}))}>
                    <option>Planned</option><option>Active</option><option>Completed</option><option>On Hold</option>
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Start date</label>
                    <input type="date" style={inputStyle} value={editForm.start_date} onChange={e => setEditForm(f => ({...f, start_date:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>End date</label>
                    <input type="date" style={inputStyle} value={editForm.end_date} onChange={e => setEditForm(f => ({...f, end_date:e.target.value}))} />
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <button onClick={() => setEditOpen(false)} style={{ padding:'8px 18px', background:'var(--muted)', color:'var(--foreground)', border:'1px solid var(--border)', borderRadius:8, fontSize:13, cursor:'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={saveEdit} disabled={editSaving} style={{ padding:'8px 18px', background:'var(--brand-600)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Members */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 24px', marginBottom:16 }}>
            <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:600 }}>
              Members ({project.members?.length || 0})
            </h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {project.members?.length === 0 && (
                <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:0 }}>No members assigned yet.</p>
              )}
              {project.members?.map(m => (
                <div key={m.id} style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'5px 12px', background:'var(--muted)',
                  borderRadius:99, fontSize:13,
                }}>
                  <Avatar name={m.name} size={22} />
                  <span>{m.name}</span>
                  <span style={{ fontSize:11, color:'var(--muted-foreground)' }}>· {m.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)' }}>
              <h3 style={{ margin:0, fontSize:14, fontWeight:600 }}>Tasks ({tasks.length})</h3>
            </div>
            {tasks.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'var(--muted-foreground)', fontSize:13 }}>
                No tasks yet
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    {['Title','Assignee','Status','Priority','Due Date'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}>
                      <td style={{ fontWeight:500, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {t.title}
                      </td>
                      <td>
                        {t.assignee ? (
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <Avatar name={t.assignee.name} size={24} />
                            <span>{t.assignee.name}</span>
                          </div>
                        ) : (
                          <span style={{ color:'var(--muted-foreground)' }}>Unassigned</span>
                        )}
                      </td>
                      <td><StatusBadge value={t.status} /></td>
                      <td><StatusBadge value={t.priority} /></td>
                      <td style={{ color:'var(--muted-foreground)', whiteSpace:'nowrap' }}>{t.due_date || '—'}</td>
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