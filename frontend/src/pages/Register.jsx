import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Register Page — SevaSangam
 * Registration interface for Customers and Cooperative Workers.
 */
const Register = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cooperative, setCooperative] = useState('');
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login({
        email,
        password,
        role,
        name,
        phone,
        cooperative: role === 'worker' ? cooperative : null,
      });
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-900 text-center mb-1">
        Create Your Account
      </h2>
      <p className="text-xs text-slate-500 text-center mb-6">
        Join the SevaSangam cooperative platform
      </p>

      {/* Role Selection Tabs */}
      <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            role === 'customer'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👤 I need services (Customer)
        </button>
        <button
          type="button"
          onClick={() => setRole('worker')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            role === 'worker'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👷 I provide services (Worker)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Mobile Number"
          type="tel"
          placeholder="+91 98765-43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {role === 'worker' && (
          <Input
            label="Labour Cooperative / Federation Name"
            placeholder="e.g. Pune Labour Cooperative Society"
            value={cooperative}
            onChange={(e) => setCooperative(e.target.value)}
            helperText="Must be a registered cooperative society"
            required
          />
        )}

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : `Register as ${role === 'customer' ? 'Customer' : 'Worker'}`}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
