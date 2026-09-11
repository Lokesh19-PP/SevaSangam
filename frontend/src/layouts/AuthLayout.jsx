import { Outlet, Link } from 'react-router-dom';

/**
 * Neo-Brutalist Auth Layout — SevaSangam
 * Centered high contrast layout with dot grid background for Login and Registration.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF6] bg-neo-dots flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 border-2.5 border-black shadow-neo-xs flex items-center justify-center text-black font-extrabold text-2xl group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-neo transition-all">
            ⚡
          </div>
          <div className="text-left">
            <span className="text-2xl font-extrabold text-black tracking-tight font-display">
              Seva<span className="bg-teal-400 px-1 py-0.5 rounded border border-black ml-0.5">Sangam</span>
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Cooperative Labor Platform
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-neo-xl sm:rounded-3xl sm:px-10 border-3 border-black">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
