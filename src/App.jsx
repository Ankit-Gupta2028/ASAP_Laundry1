import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Layout from './components/Layout';
import UserDashboard from './pages/UserDashboard';
import NewRequest from './pages/NewRequest';
import OrderTracker from './pages/OrderTracker';
import AdminLayout from './components/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminNewOrders from './pages/admin/AdminNewOrders';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminProcessing from './pages/admin/AdminProcessing';
import AdminCompleted from './pages/admin/AdminCompleted';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-request" element={
              <ProtectedRoute allowedRoles={['user']}>
                <NewRequest />
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <OrderTracker />
              </ProtectedRoute>
            } />
          </Route>
            
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardHome />} />
            <Route path="requests" element={<AdminNewOrders />} />
            <Route path="orders" element={<AdminOrderList />} />
            <Route path="processing" element={<AdminProcessing />} />
            <Route path="completed" element={<AdminCompleted />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
