import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

/**
 * Admin Layout — SevaSangam
 * Wrapper layout for all cooperative administrator dashboard screens.
 */
const AdminLayout = () => {
  const adminNavLinks = [
    { label: 'Admin Overview', path: '/admin', icon: '🏛️', exact: true },
    { label: 'Worker Verification', path: '/admin', icon: '✅' },
    { label: 'Analytics & Demand', path: '/admin', icon: '📈' },
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
