import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useBookings from '../../hooks/useBookings';
import BookingCard from '../../components/cards/BookingCard';
import Button from '../../components/ui/Button';

/**
 * Customer Dashboard — SevaSangam
 * Strictly isolated customer-only operations.
 */
const CustomerDashboard = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Customer'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access verified cooperative services and track active requests.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/booking">
            <Button variant="primary" size="sm">
              + Book Service
            </Button>
          </Link>
          <Link to="/booking?emergency=true">
            <Button variant="danger" size="sm">
              🚨 Emergency Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Bookings</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Completed Services</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">4</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Cooperative Society</span>
          <p className="text-sm font-semibold text-sky-600 mt-2 truncate">Pune Labour Federation</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Recent Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
