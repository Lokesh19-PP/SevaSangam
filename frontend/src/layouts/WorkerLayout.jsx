import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

/**
 * Worker Layout — SevaSangam
 * Wrapper layout for all worker dashboard screens.
 */
const WorkerLayout = () => {
  const workerNavLinks = [
    { label: 'Work Dashboard', path: '/worker', icon: '🛠️', exact: true },
    { label: 'Active Jobs', path: '/worker', icon: '📋' },
    { label: 'Skills & Profile', path: '/worker', icon: '🎖️' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={workerNavLinks} role="Worker" />
        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;
