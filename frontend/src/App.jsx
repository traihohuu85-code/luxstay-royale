import { Navigate, Route, Routes } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/client/HomePage';
import BranchesPage from './pages/client/BranchesPage';
import RoomListPage from './pages/client/RoomListPage';
import RoomDetailPage from './pages/client/RoomDetailPage';
import BookingHistoryPage from './pages/client/BookingHistoryPage';
import PaymentPage from './pages/client/PaymentPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBranchesPage from './pages/admin/AdminBranchesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/bookings" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
        <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="branches" element={<AdminBranchesPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="rooms" element={<AdminRoomsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
