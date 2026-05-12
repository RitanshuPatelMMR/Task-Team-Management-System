import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button }  from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between">
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/dashboard">Dashboard</Link>
        {user?.role === 'Admin' && <Link to="/users">Users</Link>}
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user?.name} ({user?.role})</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}