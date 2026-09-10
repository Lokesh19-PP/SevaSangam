import { Routes, Route } from 'react-router-dom';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import WorkerLayout from '../layouts/WorkerLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Services from '../pages/Services';
import Workers from '../pages/Workers';
import WorkerProfile from '../pages/WorkerProfile';
import Booking from '../pages/Booking';
import NotFound from '../pages/NotFound';

// Customer Dashboard Pages
import CustomerHome from '../dashboards/customer/Home';
import CustomerServices from '../dashboards/customer/Services';
import CustomerWorkerProfile from '../dashboards/customer/WorkerProfile';
import BookingHistory from '../dashboards/customer/BookingHistory';
import BookingFlow from '../dashboards/customer/BookingFlow';

import WorkerDashboard from '../dashboards/worker/index';
import AdminDashboard from '../dashboards/admin/index';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

/**
 * AppRoutes Component — SevaSangam
 * Central route configuration handling Public, Auth, and Role-Protected routes.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/workers" element={<Workers />} />
      <Route path="/workers/:id" element={<WorkerProfile />} />
      <Route path="/booking" element={<Booking />} />

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Customer Dashboard (Protected + Role-restricted) */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerHome />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="workers/:id" element={<CustomerWorkerProfile />} />
        <Route path="bookings" element={<BookingHistory />} />
        <Route path="book" element={<BookingFlow />} />
        <Route path="book/:serviceId" element={<BookingFlow />} />
      </Route>

      {/* Worker Dashboard (Protected + Role-restricted) */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['worker']}>
              <WorkerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerDashboard />} />
      </Route>

      {/* Admin Dashboard (Protected + Role-restricted) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
