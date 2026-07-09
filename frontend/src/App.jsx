import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProjectsList from './pages/projects/ProjectsList';
import ProjectDetail from './pages/projects/ProjectDetail';
import TasksList from './pages/tasks/TasksList';
import TaskDetail from './pages/tasks/TaskDetail';
import Profile from './pages/profile/Profile';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTeams from './pages/admin/AdminTeams';
import Notifications from './pages/notifications/Notifications';
import AITaskGenerator from './pages/ai/AITaskGenerator';
import AISprintPlanner from './pages/ai/AISprintPlanner';
import AIBugDetector from './pages/ai/AIBugDetector';
import KanbanBoard from './pages/kanban/KanbanBoard';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User protected */}
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><ProjectsList /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TasksList /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

          <Route path="/ai/tasks" element={<PrivateRoute><AITaskGenerator /></PrivateRoute>} />
          <Route path="/ai/sprints" element={<PrivateRoute><AISprintPlanner /></PrivateRoute>} />
          <Route path="/ai/bugs" element={<PrivateRoute><AIBugDetector /></PrivateRoute>} />
          <Route path="/kanban" element={<PrivateRoute><KanbanBoard /></PrivateRoute>} />
          {/* Admin only */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/teams" element={<AdminRoute><AdminTeams /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;