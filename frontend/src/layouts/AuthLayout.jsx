import { Outlet, Link } from 'react-router-dom';

/**
 * Auth Layout — SevaSangam
 * Minimalist, centered layout for Login and Registration pages.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
            S
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">SevaSangam</span>
        </Link>
        <p className="mt-2 text-xs text-slate-500">
          "Trusted Services. Fair Opportunities. Stronger Communities."
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200/80">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
