import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

/**
 * Customer Layout — SevaSangam
 * Wrapper layout for all customer dashboard screens.
 */
const CustomerLayout = () => {
  const customerNavLinks = [
    { label: 'Overview', path: '/customer', icon: '📊', exact: true },
    { label: 'Browse Services', path: '/services', icon: '🔍' },
    { label: 'Find Workers', path: '/workers', icon: '👷' },
    { label: 'Bookings', path: '/booking', icon: '📅' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={customerNavLinks} role="Customer" />
        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
