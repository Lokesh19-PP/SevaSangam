import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Login Page — SevaSangam
 * Supports role-based authentication selection for testing and demonstration.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || `/${selectedRole}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password, role: selectedRole });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleQuickLogin = async (role) => {
    setSelectedRole(role);
    await login({ email: `${role}@sevasangam.coop`, password: 'password123', role });
    navigate(`/${role}`, { replace: true });
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-900 text-center mb-1">
        Sign in to SevaSangam
      </h2>
      <p className="text-xs text-slate-500 text-center mb-6">
        Select your role or enter your credentials
      </p>

      {/* Role Quick Selector for Prototype/Dev */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
          Quick Demo Login
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('customer')}
            className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
              selectedRole === 'customer'
                ? 'border-sky-600 bg-sky-50 text-sky-700 font-semibold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('worker')}
            className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
              selectedRole === 'worker'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            👷 Worker
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            🏛️ Admin
          </button>
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
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

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
          Register now
        </Link>
      </div>
    </div>
  );
};

export default Login;
