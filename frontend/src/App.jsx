import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import ProtectedRoute       from './components/ProtectedRoute';
import LoginPage            from './pages/LoginPage';
import LandingPage          from './pages/LandingPage';
import DashboardPage        from './pages/DashboardPage';
import UsersPage            from './pages/UsersPage';
import ProjectsPage         from './pages/ProjectsPage';
import ProjectDetailPage    from './pages/ProjectDetailPage';
import TasksPage            from './pages/TasksPage';
import TaskDetailPage       from './pages/TaskDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/users"        element={<ProtectedRoute roles={['Admin']}><UsersPage /></ProtectedRoute>} />
          <Route path="/projects"     element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
          <Route path="/tasks"        element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/tasks/:id"    element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}