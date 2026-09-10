import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Button, Avatar, Badge } from '../components/ui';

/**
 * WorkerLayout Component — SevaSangam
 *
 * Full-featured worker layout with:
 *  - Responsive sidebar: Dashboard, My Profile, Bookings, Earnings, Ratings, Availability
 *  - Sticky header with availability toggle (Online / Offline / Busy)
 *  - Profile dropdown with logout
 *  - Mobile hamburger + overlay
 *
 * Reuses Janhvi's Button, Avatar, Badge from components/ui.
 */

// ── Sidebar nav items ──────────────────────────────────────────────
const NAV_LINKS = [
  {
    label: 'Dashboard',
    path: '/worker',
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'My Profile',
    path: '/worker/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    path: '/worker/bookings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Earnings',
    path: '/worker/earnings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Ratings',
    path: '/worker/ratings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    label: 'Availability',
    path: '/worker/availability',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// ── Availability states ───────────────────────────────────────────
const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'busy',      label: 'Busy',      color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
  { value: 'offline',   label: 'Offline',   color: 'bg-slate-400',   text: 'text-slate-600',   bg: 'bg-slate-100',  border: 'border-slate-200'   },
];

// ── Component ─────────────────────────────────────────────────────
const WorkerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen]     = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAvailMenuOpen, setIsAvailMenuOpen]  = useState(false);
  const [availability, setAvailability]        = useState('available');

  const profileMenuRef = useRef(null);
  const availMenuRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target))
        setIsProfileMenuOpen(false);
      if (availMenuRef.current && !availMenuRef.current.contains(e.target))
        setIsAvailMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const workerName  = user?.name  || 'Ramesh Mhatre';
  const workerEmail = user?.email || 'ramesh.mhatre@sevacoop.in';

  const currentAvail = AVAILABILITY_OPTIONS.find((o) => o.value === availability);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="worker-sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link to="/worker" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-primary-800 transition-colors">
                सेवा
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-primary-700 transition-colors">
                  SevaSangam
                </span>
                <span className="text-[10px] font-semibold text-primary-700 tracking-wide uppercase mt-0.5">
                  Worker Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center — cooperative badge */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pune Labour Cooperative Society • Member in Good Standing</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* ── Availability Toggle ── */}
            <div className="relative" ref={availMenuRef}>
              <button
                id="worker-availability-toggle"
                type="button"
                onClick={() => setIsAvailMenuOpen(!isAvailMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${currentAvail.bg} ${currentAvail.border} ${currentAvail.text}`}
                aria-label="Change availability status"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${currentAvail.color} ${availability === 'available' ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{currentAvail.label}</span>
                <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isAvailMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Set Availability
                  </div>
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      id={`availability-option-${opt.value}`}
                      type="button"
                      onClick={() => { setAvailability(opt.value); setIsAvailMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer hover:bg-slate-50 ${availability === opt.value ? `font-semibold ${opt.text}` : 'text-slate-700'}`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${opt.color}`} />
                      {opt.label}
                      {availability === opt.value && (
                        <svg className="ml-auto w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications bell */}
            <button
              type="button"
              id="worker-notifications-btn"
              onClick={() => navigate('/worker/bookings')}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                id="worker-profile-menu-btn"
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <Avatar name={workerName} size="sm" status={availability === 'available' ? 'online' : availability === 'busy' ? 'busy' : 'offline'} />
                <span className="hidden sm:block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {workerName}
                </span>
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <Avatar name={workerName} size="md" status={availability === 'available' ? 'online' : 'offline'} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{workerName}</p>
                      <p className="text-xs text-slate-500 truncate">{workerEmail}</p>
                      <Badge variant="primary" size="sm" className="mt-1">
                        Cooperative Worker
                      </Badge>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {[
                      { to: '/worker/profile',      label: 'My Profile & Skills' },
                      { to: '/worker/bookings',     label: 'My Bookings' },
                      { to: '/worker/earnings',     label: 'Earnings & Payouts' },
                      { to: '/worker/availability', label: 'Manage Availability' },
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="pt-2 border-t border-slate-100 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={handleLogout}
                      id="worker-logout-btn"
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 justify-start px-2"
                      leftIcon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      }
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed lg:sticky top-16 z-30
            w-64 h-[calc(100vh-4rem)]
            bg-white border-r border-slate-200
            flex flex-col justify-between
            transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Section label */}
            <div>
              <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Worker Portal
              </div>

              {/* Availability quick-status strip */}
              <div className={`flex items-center gap-2 px-3 py-2 mb-3 rounded-xl border text-xs font-medium ${currentAvail.bg} ${currentAvail.border} ${currentAvail.text}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${currentAvail.color} ${availability === 'available' ? 'animate-pulse' : ''}`} />
                Status: <span className="font-semibold ml-0.5">{currentAvail.label}</span>
              </div>

              <nav className="space-y-1">
                {NAV_LINKS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    id={`worker-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                      ${isActive
                        ? 'bg-primary-50 text-primary-800 font-semibold shadow-2xs border border-primary-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
                    `}
                  >
                    <span className="transition-transform group-hover:scale-110 shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Earnings quick-stat card */}
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-emerald-900">This Month</span>
              </div>
              <p className="text-xl font-bold text-emerald-800">₹12,400</p>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">18 jobs • Avg ₹688/job</p>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>SevaSangam v1.0</span>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Coop Active
              </span>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;
