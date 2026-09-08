import { NavLink } from 'react-router-dom';

/**
 * Sidebar Component — SevaSangam
 * Role-aware dashboard sidebar navigation.
 */
const Sidebar = ({ links = [], role = 'customer' }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role} panel
        </div>
        <nav className="mt-2 space-y-1">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.icon && <span>{link.icon}</span>}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 px-3">
        SevaSangam v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
