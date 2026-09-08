import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLanguage from '../../hooks/useLanguage';
import Button from '../ui/Button';

/**
 * Navbar Component — SevaSangam
 * Responsive top navigation bar with brand, language switcher, and auth actions.
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">SevaSangam</span>
            <span className="hidden sm:block text-[10px] text-slate-500 font-medium -mt-1">
              Cooperative Services
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-sky-600 transition-colors">
            Home
          </Link>
          <Link to="/services" className="hover:text-sky-600 transition-colors">
            Services
          </Link>
          <Link to="/workers" className="hover:text-sky-600 transition-colors">
            Workers
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>

          {/* Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={`/${user?.role || 'customer'}`}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 px-2 py-1"
              >
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
