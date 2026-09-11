import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useBookings from '../hooks/useBookings';
import { services } from '../mock/data/services';
import { workers } from '../mock/data/workers';

/**
 * Neo-Brutalist Booking Page — SevaSangam
 * Service booking and scheduling interface with cooperative fair matching support.
 */
const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createBooking, loading } = useBookings();

  const preselectedServiceId = searchParams.get('serviceId') || services[0]?.id;
  const preselectedWorkerId = searchParams.get('workerId') || '';

  const [serviceId, setServiceId] = useState(preselectedServiceId);
  const [workerId, setWorkerId] = useState(preselectedWorkerId);
  const [scheduledDate, setScheduledDate] = useState('');
  const [address, setAddress] = useState('Flat 402, Greenfield Heights, Andheri West, Mumbai');
  const [notes, setNotes] = useState('');
  const [isEmergency, setIsEmergency] = useState(
    searchParams.get('emergency') === 'true'
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking({
        serviceId,
        workerId: workerId || 'auto_match',
        scheduledDate: isEmergency ? new Date().toISOString() : scheduledDate,
        address,
        notes,
        isEmergency,
        amount: isEmergency ? 950 : 550,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6]">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl border-3 border-black p-6 sm:p-8 shadow-neo-xl">
          <div className="mb-6">
            <Badge variant="secondary" size="sm" shadow className="mb-2">
              ⚡ Direct Cooperative Booking
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-display tracking-tight">
              Book Cooperative Service
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
              Guaranteed transparent rates and insured, verified cooperative labor.
            </p>
          </div>

          {success ? (
            <div className="text-center py-10 bg-yellow-100/60 rounded-2xl border-2 border-black p-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-300 border-2 border-black shadow-neo flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-extrabold text-black font-display">Booking Dispatched!</h3>
              <p className="text-xs font-bold text-slate-800 mt-2 max-w-md mx-auto leading-relaxed">
                Your service order has been sent to verified cooperative trade workers. Track real-time progress in your dashboard.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button variant="secondary" size="lg" onClick={() => navigate('/customer')}>
                  Go to Customer Dashboard ⚡
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Emergency Banner */}
              <div className={`p-4 rounded-2xl border-2 border-black flex items-start gap-3 transition-colors ${
                isEmergency ? 'bg-rose-100' : 'bg-yellow-100/70'
              }`}>
                <input
                  type="checkbox"
                  id="emergency"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-2 border-black text-rose-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="emergency" className="text-xs font-bold text-black cursor-pointer">
                  <span className="text-sm font-extrabold flex items-center gap-1">
                    🚨 Urgent / Emergency Service Dispatch
                  </span>
                  <p className="text-slate-800 font-semibold mt-0.5">
                    Prioritizes fastest dispatch to nearest available on-duty cooperative worker.
                  </p>
                </label>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                  Select Trade Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-black rounded-xl text-sm font-bold bg-white shadow-neo-sm focus:outline-none focus:shadow-neo cursor-pointer"
                  required
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name} ({svc.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Worker Preference */}
              <div>
                <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                  Worker Selection / Matching
                </label>
                <select
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-black rounded-xl text-sm font-bold bg-white shadow-neo-sm focus:outline-none focus:shadow-neo cursor-pointer"
                >
                  <option value="">⚡ AI Fair Match (Recommended — auto-balances workload)</option>
                  {workers.map((wrk) => (
                    <option key={wrk.id} value={wrk.id}>
                      {wrk.name} ({wrk.cooperative}) — ₹{wrk.hourlyRate}/hr ★{wrk.rating}
                    </option>
                  ))}
                </select>
              </div>

              {!isEmergency && (
                <Input
                  label="Preferred Date & Time"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required={!isEmergency}
                />
              )}

              <Input
                label="Service Location / Address"
                placeholder="Flat / House No, Landmark, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                  Problem Description & Instructions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe the issue in detail (e.g. kitchen sink leak, main circuit breaker tripping)..."
                  className="w-full px-4 py-3 border-2 border-black rounded-xl text-sm font-medium bg-white shadow-neo-sm focus:outline-none focus:shadow-neo"
                />
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant={isEmergency ? 'danger' : 'secondary'}
                  size="lg"
                  fullWidth
                  disabled={loading}
                  className="font-extrabold text-base"
                >
                  {loading ? 'Submitting Booking...' : isEmergency ? '🚨 Dispatch Emergency Worker Now' : 'Confirm Cooperative Booking ⚡'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
