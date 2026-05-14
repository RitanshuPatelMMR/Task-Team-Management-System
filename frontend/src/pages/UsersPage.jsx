import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function Avatar({ name }) {
  const initials = name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || '?';
  return (
    <div style={{
      width: 30, height: 30, borderRadius: '50%',
      background: '#d1fae5', color: '#065f46',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

const RoleBadge = ({ role }) => {
  const colors = { Admin: ['#fee2e2','#991b1b'], Manager: ['#dbeafe','#1e40af'], Developer: ['#d1fae5','#065f46'] };
  const [bg, color] = colors[role] || ['#f3f4f6','#374151'];
  return <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }}>{role}</span>;
};

const StatusBadge = ({ active }) => (
  <span style={{
    background: active ? '#d1fae5' : '#fee2e2',
    color: active ? '#065f46' : '#991b1b',
    padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500,
  }}>{active ? 'Active' : 'Inactive'}</span>
);

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>{children}</label>
);

export default function UsersPage() {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState({ name:'', email:'', password:'', role:'Developer' });

  const fetchUsers = () => {
    setLoading(true);
    api.get(`/users?search=${search}`).then(({ data }) => { setUsers(data.data); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const createUser = async () => {
    try {
      await api.post('/users', form);
      setOpen(false);
      setForm({ name:'', email:'', password:'', role:'Developer' });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const updateRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    fetchUsers();
  };

  const toggleStatus = async (id, is_active) => {
    await api.put(`/users/${id}/status`, { is_active: !is_active });
    fetchUsers();
  };
const deleteUser = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message); }
  };
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-breadcrumb"><span>Users</span></div>
        </div>
        <div className="page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Users</h1>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '2px 0 0' }}>Manage team members and roles</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button style={{ padding: '8px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  + Create User
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                  <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '4px 0 0' }}>Add a new team member to the system.</p>
                </DialogHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                  <div><Label>Full name</Label><Input placeholder="John Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div><Label>Email address</Label><Input placeholder="john@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                  <div><Label>Password</Label><Input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
                  <div>
                    <Label>Role</Label>
                    <select className="w-full border rounded px-3 py-2 text-sm" style={{ width:'100%', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'var(--background)', color:'var(--foreground)' }} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                      <option>Admin</option><option>Manager</option><option>Developer</option>
                    </select>
                  </div>
                  <button onClick={createUser} style={{ padding:'10px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4 }}>
                    Create User
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Input placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth: 320 }} />
          </div>

          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            {loading ? <div style={{ padding:40, textAlign:'center', color:'var(--muted-foreground)' }}>Loading...</div> : (
              <table className="data-table">
                <thead>
                  <tr>
                    {['Member','Email','Role','Status','Actions'].map(h=><th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id} style={{ cursor: 'default' }}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <Avatar name={u.name} />
                          <span style={{ fontWeight:500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color:'var(--muted-foreground)' }}>{u.email}</td>
                      <td><RoleBadge role={u.role} /></td>
                      <td><StatusBadge active={u.is_active} /></td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <select
                            value={u.role}
                            onChange={e=>updateRole(u.id,e.target.value)}
                            style={{ border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', fontSize:12, background:'var(--background)', color:'var(--foreground)', cursor:'pointer' }}
                          >
                            <option>Admin</option><option>Manager</option><option>Developer</option>
                          </select>
                          <button
                            onClick={()=>toggleStatus(u.id,u.is_active)}
                            style={{
                              padding:'4px 12px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid',
                              background: u.is_active ? '#fff1f2' : '#f0fdf4',
                              color: u.is_active ? '#e11d48' : '#059669',
                              borderColor: u.is_active ? '#fecdd3' : '#a7f3d0',
                            }}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
  onClick={()=>deleteUser(u.id, u.name)}
  style={{
    padding:'4px 12px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid',
    background:'#fff1f2', color:'#e11d48', borderColor:'#fecdd3',
  }}
>
  Delete
</button>
                        </div>
                      </td>
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