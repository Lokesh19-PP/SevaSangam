import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLanguage from '../../hooks/useLanguage';
import Button from '../ui/Button';

/**
 * Neo-Brutalist Navbar Component — SevaSangam
 * Bold black borders, vibrant badges, and tactile interactive controls.
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF6] border-b-[2.5px] border-black shadow-neo-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 border-2 border-black shadow-neo-xs flex items-center justify-center text-black font-extrabold text-xl group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-neo transition-all">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-black tracking-tight font-display">
                Seva<span className="bg-teal-400 px-1.5 py-0.5 rounded-md border border-black text-black ml-0.5">Sangam</span>
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-slate-700 font-bold uppercase tracking-wider">
              Cooperative Labor Network
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-black border-2 border-transparent hover:border-black hover:bg-yellow-200 hover:shadow-neo-xs transition-all"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-black border-2 border-transparent hover:border-black hover:bg-cyan-200 hover:shadow-neo-xs transition-all"
          >
            Services
          </Link>
          <Link
            to="/workers"
            className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-black border-2 border-transparent hover:border-black hover:bg-orange-200 hover:shadow-neo-xs transition-all"
          >
            Workers
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="text-xs font-bold bg-white border-2 border-black rounded-xl px-2.5 py-2 text-black shadow-neo-xs focus:outline-none focus:shadow-neo cursor-pointer transition-all"
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
                className="text-xs font-extrabold bg-teal-300 text-teal-950 border-2 border-black rounded-xl px-3 py-2 shadow-neo-xs hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo transition-all"
              >
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/register')}>
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
