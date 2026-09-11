import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * Neo-Brutalist Register Page — SevaSangam
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

  const { register, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const regFunc = register || login;
      await regFunc({
        email,
        password,
        role,
        full_name: name,
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
      <div className="text-center mb-6">
        <Badge variant="primary" size="sm" shadow className="mb-2">
          🏛️ Join SevaSangam Guild
        </Badge>
        <h2 className="text-2xl font-extrabold text-black font-display tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs font-bold text-slate-700 mt-1">
          Cooperative-powered digital service network
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex rounded-2xl bg-yellow-100/70 p-1.5 border-2 border-black mb-6 gap-2">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl border-2 transition-all cursor-pointer ${
            role === 'customer'
              ? 'bg-yellow-300 text-black border-black shadow-neo-xs -translate-x-0.5 -translate-y-0.5'
              : 'border-transparent text-slate-800 hover:bg-white'
          }`}
        >
          👤 Need Services (Customer)
        </button>
        <button
          type="button"
          onClick={() => setRole('worker')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl border-2 transition-all cursor-pointer ${
            role === 'worker'
              ? 'bg-teal-300 text-black border-black shadow-neo-xs -translate-x-0.5 -translate-y-0.5'
              : 'border-transparent text-slate-800 hover:bg-white'
          }`}
        >
          👷 Provide Services (Worker)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-100 border-2 border-rose-600 rounded-xl text-xs font-bold text-rose-950 shadow-neo-xs">
            ⚠️ {error}
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
          label="Mobile Phone Number"
          type="tel"
          placeholder="+91 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {role === 'worker' && (
          <Input
            label="Labour Cooperative / Federation Name"
            placeholder="e.g. Maharashtra Labour Cooperative Federation"
            value={cooperative}
            onChange={(e) => setCooperative(e.target.value)}
            helperText="Registered cooperative society ensuring collective social security"
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

        <Button type="submit" variant="secondary" fullWidth size="lg" disabled={loading} className="font-extrabold">
          {loading ? 'Creating Account...' : `Register as ${role === 'customer' ? 'Customer' : 'Cooperative Worker ⚡'}`}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs font-bold text-slate-800">
        Already have an account?{' '}
        <Link to="/login" className="font-extrabold text-teal-700 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
