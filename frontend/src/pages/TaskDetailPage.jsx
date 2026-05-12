import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const StatusBadge = ({ value }) => {
  const colors = {
    'Todo':['#f3f4f6','#374151'], 'In Progress':['#dbeafe','#1e40af'],
    'Review':['#fef3c7','#92400e'], 'Completed':['#d1fae5','#065f46'],
    'Low':['#d1fae5','#065f46'], 'Medium':['#fef3c7','#92400e'], 'High':['#fee2e2','#991b1b'],
  };
  const [bg, color] = colors[value] || ['#f3f4f6','#374151'];
  return <span style={{ background:bg, color, padding:'3px 12px', borderRadius:99, fontSize:12, fontWeight:500 }}>{value}</span>;
};

function Avatar({ name, size=32 }) {
  const initials = name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#d1fae5', color:'#065f46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:600, flexShrink:0 }}>
      {initials}
    </div>
  );
}

const inputStyle = { border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)', width:'100%', boxSizing:'border-box' };
const selectStyle = { border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)', width:'100%' };

export default function TaskDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask]         = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment]   = useState('');
  const [status, setStatus]     = useState('');
  const [updating, setUpdating] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // Edit task state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title:'', description:'', assigned_to:'', priority:'', due_date:'' });
  const [editSaving, setEditSaving] = useState(false);

  // Edit comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const fetchTask = () => api.get(`/tasks/${id}`).then(({ data }) => {
    setTask(data);
    setStatus(data.status);
    setEditForm({
      title:       data.title        || '',
      description: data.description  || '',
      assigned_to: data.assignee?.id || '',
      priority:    data.priority     || 'Medium',
      due_date:    data.due_date     || '',
    });
  });

  const fetchComments = () => api.get(`/tasks/${id}/comments`).then(({ data }) => setComments(data));

  useEffect(() => {
    fetchTask();
    fetchComments();
    if (['Admin','Manager'].includes(user?.role))
      api.get('/users').then(({ data }) => setAllUsers(data.data));
  }, [id]);

  const updateStatus = async () => {
    setUpdating(true);
    try {
      await api.put(`/tasks/${id}`, { status });
      await fetchTask();
    } catch (err) { alert(err.response?.data?.message); }
    setUpdating(false);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      await api.put(`/tasks/${id}`, {
        title:       editForm.title,
        description: editForm.description,
        assigned_to: editForm.assigned_to ? parseInt(editForm.assigned_to) : null,
        priority:    editForm.priority,
        due_date:    editForm.due_date || null,
      });
      await fetchTask();
      setEditOpen(false);
    } catch (err) { alert(err.response?.data?.message); }
    setEditSaving(false);
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/tasks/${id}/comments`, { comment });
      setComment('');
      fetchComments();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const startEditComment = (c) => {
    setEditingCommentId(c.id);
    setEditingCommentText(c.comment);
  };

  const saveEditComment = async (cid) => {
    try {
      await api.put(`/tasks/${id}/comments/${cid}`, { comment: editingCommentText });
      setEditingCommentId(null);
      fetchComments();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const deleteComment = async (cid) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/tasks/${id}/comments/${cid}`);
      fetchComments();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const canEditStatus = ['Admin','Manager'].includes(user?.role) || task?.assigned_to === user?.id;
  const canEditTask   = ['Admin','Manager'].includes(user?.role);

  if (!task) return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main"><div style={{ padding:40, color:'var(--muted-foreground)' }}>Loading...</div></main>
    </div>
  );

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-breadcrumb">
            <span style={{ cursor:'pointer', color:'var(--muted-foreground)' }} onClick={()=>navigate('/tasks')}>Tasks</span>
            <span style={{ color:'var(--muted-foreground)' }}>/</span>
            <span>{task.title}</span>
          </div>
        </div>

        <div className="page" style={{ maxWidth:800 }}>

          {/* Header */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8, gap:12 }}>
              <h1 style={{ margin:0, fontSize:22, fontWeight:700, letterSpacing:'-0.4px', color:'var(--foreground)' }}>{task.title}</h1>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                <StatusBadge value={task.status} />
                {canEditTask && (
                  <button
                    onClick={()=>setEditOpen(o=>!o)}
                    style={{ padding:'4px 14px', background: editOpen ? '#059669' : 'var(--muted)', color: editOpen ? '#fff' : 'var(--foreground)', border:'1px solid var(--border)', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}
                  >
                    {editOpen ? 'Close' : 'Edit'}
                  </button>
                )}
              </div>
            </div>
            {task.description && <p style={{ fontSize:14, color:'var(--muted-foreground)', margin:0, lineHeight:1.6 }}>{task.description}</p>}
          </div>

          {/* Edit panel — Admin/Manager only */}
          {editOpen && canEditTask && (
            <div style={{ background:'var(--card)', border:'1px solid #10b981', borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
              <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:600, color:'var(--foreground)' }}>Edit Task</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Title</label>
                  <input style={inputStyle} value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight:72, resize:'vertical' }} value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Assign to</label>
                    <select style={selectStyle} value={editForm.assigned_to} onChange={e=>setEditForm(f=>({...f,assigned_to:e.target.value}))}>
                      <option value="">Unassigned</option>
                      {allUsers.map(u=><option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Priority</label>
                    <select style={selectStyle} value={editForm.priority} onChange={e=>setEditForm(f=>({...f,priority:e.target.value}))}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:'var(--muted-foreground)', display:'block', marginBottom:4 }}>Due date</label>
                  <input type="date" style={inputStyle} value={editForm.due_date} onChange={e=>setEditForm(f=>({...f,due_date:e.target.value}))} />
                </div>
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <button onClick={()=>setEditOpen(false)} style={{ padding:'8px 18px', background:'var(--muted)', color:'var(--foreground)', border:'1px solid var(--border)', borderRadius:8, fontSize:13, cursor:'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={saveEdit} disabled={editSaving} style={{ padding:'8px 18px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Meta grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
            {[
              { label:'Project',    value: task.Project?.name || '—' },
              { label:'Priority',   value: <StatusBadge value={task.priority} /> },
              { label:'Due Date',   value: task.due_date || '—' },
              { label:'Created by', value: task.creator?.name || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:'var(--muted)', borderRadius:8, padding:'12px 16px' }}>
                <div style={{ fontSize:11, color:'var(--muted-foreground)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:500 }}>{value}</div>
              </div>
            ))}
            <div style={{ background:'var(--muted)', borderRadius:8, padding:'12px 16px' }}>
              <div style={{ fontSize:11, color:'var(--muted-foreground)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Assignee</div>
              {task.assignee ? (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Avatar name={task.assignee.name} size={24} />
                  <span style={{ fontSize:14, fontWeight:500 }}>{task.assignee.name}</span>
                </div>
              ) : <span style={{ fontSize:14, color:'var(--muted-foreground)' }}>Unassigned</span>}
            </div>
          </div>

          {/* Status update */}
          {canEditStatus && (
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:13, fontWeight:500 }}>Update status:</span>
              <select value={status} onChange={e=>setStatus(e.target.value)} style={{ border:'1px solid var(--border)', borderRadius:8, padding:'7px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)' }}>
                <option>Todo</option><option>In Progress</option><option>Review</option><option>Completed</option>
              </select>
              <button onClick={updateStatus} disabled={updating} style={{ padding:'7px 18px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                {updating ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}

          {/* Comments */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)' }}>
              <h3 style={{ margin:0, fontSize:14, fontWeight:600 }}>Comments ({comments.length})</h3>
            </div>
            <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:16 }}>
              {comments.length === 0 && (
                <p style={{ fontSize:13, color:'var(--muted-foreground)', textAlign:'center', padding:'16px 0' }}>No comments yet.</p>
              )}
              {comments.map(c=>(
                <div key={c.id} style={{ display:'flex', gap:12 }}>
                  <Avatar name={c.author?.name} size={32} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center' }}>
                      <span style={{ fontSize:13, fontWeight:600 }}>{c.author?.name}</span>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <span style={{ fontSize:11, color:'var(--muted-foreground)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                        {/* Edit — own comment only */}
                        {c.author?.id === user?.id && (
                          <button onClick={()=>startEditComment(c)} style={{ fontSize:11, color:'#059669', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>
                            Edit
                          </button>
                        )}
                        {/* Delete — own comment OR Admin/Manager */}
                        {(c.author?.id === user?.id || ['Admin','Manager'].includes(user?.role)) && (
                          <button onClick={()=>deleteComment(c.id)} style={{ fontSize:11, color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    {editingCommentId === c.id ? (
                      <div style={{ display:'flex', gap:8 }}>
                        <input
                          style={{ flex:1, border:'1px solid #10b981', borderRadius:8, padding:'7px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)', outline:'none' }}
                          value={editingCommentText}
                          onChange={e=>setEditingCommentText(e.target.value)}
                          onKeyDown={e=>e.key==='Enter' && saveEditComment(c.id)}
                          autoFocus
                        />
                        <button onClick={()=>saveEditComment(c.id)} style={{ padding:'7px 14px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>Save</button>
                        <button onClick={()=>setEditingCommentId(null)} style={{ padding:'7px 14px', background:'var(--muted)', color:'var(--foreground)', border:'1px solid var(--border)', borderRadius:8, fontSize:12, cursor:'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ fontSize:13, color:'var(--foreground)', lineHeight:1.6, background:'var(--muted)', borderRadius:8, padding:'10px 14px' }}>
                        {c.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add comment */}
              <div style={{ display:'flex', gap:10, paddingTop:8, borderTop:'1px solid var(--border)' }}>
                <Avatar name={user?.name} size={32} />
                <div style={{ flex:1, display:'flex', gap:8 }}>
                  <input
                    style={{ flex:1, border:'1px solid var(--border)', borderRadius:8, padding:'8px 14px', fontSize:13, background:'var(--background)', color:'var(--foreground)', outline:'none' }}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e=>setComment(e.target.value)}
                    onKeyDown={e=>e.key==='Enter' && addComment()}
                    onFocus={e=>{ e.target.style.borderColor='#10b981'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,0.12)'; }}
                    onBlur={e=>{ e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
                  />
                  <button onClick={addComment} style={{ padding:'8px 18px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}