import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * Neo-Brutalist Login Page — SevaSangam
 * Role-based authentication and demo instant access.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loggedUser = await login({ email, password, role: selectedRole });
      const targetRole = loggedUser?.role || selectedRole;
      const redirectPath =
        location.state?.from?.pathname && location.state.from.pathname.startsWith(`/${targetRole}`)
          ? location.state.from.pathname
          : `/${targetRole}`;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleQuickLogin = async (role) => {
    setSelectedRole(role);
    try {
      const demoEmail = role === 'admin' ? 'admin@sevasangam.org' : `${role}@sevasangam.org`;
      const demoPassword = role === 'admin' ? 'admin123' : 'password123';
      const loggedUser = await login({ email: demoEmail, password: demoPassword, role });
      const targetRole = loggedUser?.role || role;
      navigate(`/${targetRole}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <Badge variant="secondary" size="sm" shadow className="mb-2">
          ⚡ Secure Cooperative Access
        </Badge>
        <h2 className="text-2xl font-extrabold text-black font-display tracking-tight">
          Sign In to SevaSangam
        </h2>
        <p className="text-xs font-bold text-slate-700 mt-1">
          Access your member dashboard or test instant demo roles
        </p>
      </div>

      {/* Role Quick Selector for Demo */}
      <div className="mb-6 p-3.5 bg-yellow-100/70 rounded-2xl border-2 border-black">
        <label className="block text-[11px] font-extrabold text-black uppercase tracking-wider mb-2 text-center">
          ⚡ 1-Click Instant Demo Login
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('customer')}
            className={`px-3 py-2.5 text-xs font-extrabold rounded-xl border-2 border-black text-center transition-all cursor-pointer ${
              selectedRole === 'customer'
                ? 'bg-yellow-300 text-black shadow-neo-xs -translate-x-0.5 -translate-y-0.5'
                : 'bg-white hover:bg-yellow-200 text-black'
            }`}
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('worker')}
            className={`px-3 py-2.5 text-xs font-extrabold rounded-xl border-2 border-black text-center transition-all cursor-pointer ${
              selectedRole === 'worker'
                ? 'bg-teal-300 text-black shadow-neo-xs -translate-x-0.5 -translate-y-0.5'
                : 'bg-white hover:bg-teal-100 text-black'
            }`}
          >
            👷 Worker
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className={`px-3 py-2.5 text-xs font-extrabold rounded-xl border-2 border-black text-center transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-purple-300 text-black shadow-neo-xs -translate-x-0.5 -translate-y-0.5'
                : 'bg-white hover:bg-purple-100 text-black'
            }`}
          >
            🏛️ Admin
          </button>
        </div>
      </div>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-black" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-extrabold uppercase text-black border border-black rounded-md">
          Or Enter Credentials
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-100 border-2 border-rose-600 rounded-xl text-xs font-bold text-rose-950 shadow-neo-xs">
            ⚠️ {error}
          </div>
        )}

        <Input
          label="Email or Phone Number"
          type="text"
          placeholder="customer@sevasangam.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="secondary" fullWidth size="lg" disabled={loading} className="font-extrabold">
          {loading ? 'Authenticating...' : 'Sign In ⚡'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs font-bold text-slate-800">
        New to SevaSangam?{' '}
        <Link to="/register" className="font-extrabold text-teal-700 hover:underline">
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
