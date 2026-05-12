import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StatusBadge = ({ value }) => {
  const colors = {
    'Todo':['#f3f4f6','#374151'], 'In Progress':['#dbeafe','#1e40af'],
    'Review':['#fef3c7','#92400e'], 'Completed':['#d1fae5','#065f46'],
    'Low':['#d1fae5','#065f46'], 'Medium':['#fef3c7','#92400e'], 'High':['#fee2e2','#991b1b'],
  };
  const [bg, color] = colors[value] || ['#f3f4f6','#374151'];
  return <span style={{ background:bg, color, padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:500 }}>{value}</span>;
};

function Avatar({ name, size=26 }) {
  const initials = name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#d1fae5', color:'#065f46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:600, flexShrink:0 }}>
      {initials}
    </div>
  );
}

const Label = ({ children }) => (
  <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6, color:'var(--foreground)' }}>{children}</label>
);

const selectStyle = { width:'100%', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)' };
const filterStyle = { border:'1px solid var(--border)', borderRadius:8, padding:'7px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)', cursor:'pointer' };

export default function TasksPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filters, setFilters]   = useState({ status:'', priority:'', project_id:'' });

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title:'', description:'', project_id:'', assigned_to:'', priority:'Medium', due_date:'' });

  // Edit modal
  const [editOpen, setEditOpen]   = useState(false);
  const [editTask, setEditTask]   = useState(null);
  const [editForm, setEditForm]   = useState({ title:'', description:'', assigned_to:'', priority:'Medium', due_date:'', status:'Todo' });

  const fetchTasks = () => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v))).toString();
    api.get(`/tasks?${q}`).then(({ data }) => setTasks(data.data));
  };

  useEffect(() => { fetchTasks(); }, [filters]);
  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data.data));
    if (['Admin','Manager'].includes(user?.role))
      api.get('/users').then(({ data }) => setAllUsers(data.data));
  }, []);

  const createTask = async () => {
    try {
      await api.post('/tasks', {
        ...createForm,
        project_id:  parseInt(createForm.project_id),
        assigned_to: createForm.assigned_to ? parseInt(createForm.assigned_to) : null,
        due_date:    createForm.due_date || null,
      });
      setCreateOpen(false);
      setCreateForm({ title:'', description:'', project_id:'', assigned_to:'', priority:'Medium', due_date:'' });
      fetchTasks();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const openEdit = (t, e) => {
    e.stopPropagation();
    setEditTask(t);
    setEditForm({
      title:       t.title        || '',
      description: t.description  || '',
      assigned_to: t.assignee?.id || '',
      priority:    t.priority     || 'Medium',
      due_date:    t.due_date     || '',
      status:      t.status       || 'Todo',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/tasks/${editTask.id}`, {
        title:       editForm.title,
        description: editForm.description,
        assigned_to: editForm.assigned_to ? parseInt(editForm.assigned_to) : null,
        priority:    editForm.priority,
        due_date:    editForm.due_date || null,
        status:      editForm.status,
      });
      setEditOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const deleteTask = async (tid, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${tid}`);
      fetchTasks();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const setFilter = (k,v) => setFilters(f=>({...f,[k]:v}));

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-breadcrumb"><span>Tasks</span></div>
        </div>
        <div className="page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Tasks</h1>
              <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:'2px 0 0' }}>{tasks.length} tasks</p>
            </div>
            {['Admin','Manager'].includes(user?.role) && (
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <button style={{ padding:'8px 18px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    + New Task
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <p style={{ fontSize:13, color:'var(--muted-foreground)', margin:'4px 0 0' }}>Add a new task to a project.</p>
                  </DialogHeader>
                  <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:8 }}>
                    <div><Label>Task title</Label><Input placeholder="e.g. Fix login bug" value={createForm.title} onChange={e=>setCreateForm({...createForm,title:e.target.value})} /></div>
                    <div><Label>Description</Label><Input placeholder="Optional details..." value={createForm.description} onChange={e=>setCreateForm({...createForm,description:e.target.value})} /></div>
                    <div>
                      <Label>Project</Label>
                      <select style={selectStyle} value={createForm.project_id} onChange={e=>setCreateForm({...createForm,project_id:e.target.value})}>
                        <option value="">Select project</option>
                        {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Assign to</Label>
                      <select style={selectStyle} value={createForm.assigned_to} onChange={e=>setCreateForm({...createForm,assigned_to:e.target.value})}>
                        <option value="">Unassigned</option>
                        {allUsers.map(u=><option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                      </select>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div>
                        <Label>Priority</Label>
                        <select style={selectStyle} value={createForm.priority} onChange={e=>setCreateForm({...createForm,priority:e.target.value})}>
                          <option>Low</option><option>Medium</option><option>High</option>
                        </select>
                      </div>
                      <div><Label>Due date</Label><Input type="date" value={createForm.due_date} onChange={e=>setCreateForm({...createForm,due_date:e.target.value})} /></div>
                    </div>
                    <button onClick={createTask} style={{ padding:'10px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4 }}>
                      Create Task
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
            <select style={filterStyle} value={filters.status} onChange={e=>setFilter('status',e.target.value)}>
              <option value="">All Status</option>
              <option>Todo</option><option>In Progress</option><option>Review</option><option>Completed</option>
            </select>
            <select style={filterStyle} value={filters.priority} onChange={e=>setFilter('priority',e.target.value)}>
              <option value="">All Priority</option>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <select style={filterStyle} value={filters.project_id} onChange={e=>setFilter('project_id',e.target.value)}>
              <option value="">All Projects</option>
              {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            {tasks.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'var(--muted-foreground)', fontSize:13 }}>No tasks found</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>{['Title','Project','Assignee','Status','Priority','Due Date', ['Admin','Manager'].includes(user?.role) ? 'Actions' : null].filter(Boolean).map(h=><th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {tasks.map(t=>(
                    <tr key={t.id} onClick={()=>navigate(`/tasks/${t.id}`)} style={{ cursor:'pointer' }}>
                      <td style={{ fontWeight:500 }}>{t.title}</td>
                      <td style={{ color:'var(--muted-foreground)' }}>{t.Project?.name||'—'}</td>
                      <td>
                        {t.assignee ? (
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <Avatar name={t.assignee.name} />
                            <span>{t.assignee.name}</span>
                          </div>
                        ) : <span style={{ color:'var(--muted-foreground)' }}>Unassigned</span>}
                      </td>
                      <td><StatusBadge value={t.status} /></td>
                      <td><StatusBadge value={t.priority} /></td>
                      <td style={{ color:'var(--muted-foreground)' }}>{t.due_date||'—'}</td>
                      {['Admin','Manager'].includes(user?.role) && (
                        <td onClick={e=>e.stopPropagation()}>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={e=>openEdit(t,e)} style={{ padding:'4px 10px', background:'var(--muted)', border:'1px solid var(--border)', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', color:'var(--foreground)' }}>Edit</button>
                            <button onClick={e=>deleteTask(t.id,e)} style={{ padding:'4px 10px', background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', color:'#991b1b' }}>Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Edit Task Modal */}
        {editOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
            <div style={{ background:'var(--card)', borderRadius:12, padding:'28px 32px', width:'100%', maxWidth:480, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
              <h2 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700 }}>Edit Task</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div><Label>Title</Label><Input value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} /></div>
                <div><Label>Description</Label><Input value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} /></div>
                <div>
                  <Label>Assign to</Label>
                  <select style={selectStyle} value={editForm.assigned_to} onChange={e=>setEditForm(f=>({...f,assigned_to:e.target.value}))}>
                    <option value="">Unassigned</option>
                    {allUsers.map(u=><option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <Label>Priority</Label>
                    <select style={selectStyle} value={editForm.priority} onChange={e=>setEditForm(f=>({...f,priority:e.target.value}))}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select style={selectStyle} value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))}>
                      <option>Todo</option><option>In Progress</option><option>Review</option><option>Completed</option>
                    </select>
                  </div>
                </div>
                <div><Label>Due date</Label><Input type="date" value={editForm.due_date} onChange={e=>setEditForm(f=>({...f,due_date:e.target.value}))} /></div>
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:4 }}>
                  <button onClick={()=>{ setEditOpen(false); setEditTask(null); }} style={{ padding:'8px 18px', background:'var(--muted)', color:'var(--foreground)', border:'1px solid var(--border)', borderRadius:8, fontSize:13, cursor:'pointer' }}>Cancel</button>
                  <button onClick={saveEdit} style={{ padding:'8px 18px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}