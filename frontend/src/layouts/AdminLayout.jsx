import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

/**
 * Admin Layout — SevaSangam
 * Wrapper layout for all cooperative administrator dashboard screens.
 */
const AdminLayout = () => {
  const adminNavLinks = [
    { label: 'Dashboard', path: '/admin', icon: '🏛️', exact: true },
    { label: 'Worker Verification', path: '/admin/verification', icon: '🛡️' },
    { label: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { label: 'Complaints', path: '/admin/complaints', icon: '⚖️' },
    { label: 'Welfare', path: '/admin/welfare', icon: '🤝' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={adminNavLinks} role="Admin" />
        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
