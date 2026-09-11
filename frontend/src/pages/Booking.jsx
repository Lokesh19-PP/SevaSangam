import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useBookings from '../hooks/useBookings';
import { services } from '../mock/data/services';
import { workers } from '../mock/data/workers';

/**
 * Booking Page — SevaSangam
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
  const [address, setAddress] = useState('');
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
        amount: isEmergency ? 950 : 500,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Book Cooperative Service</h1>
            <p className="text-xs text-slate-500 mt-1">
              Guaranteed transparent rates and insured, verified cooperative labor.
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-900">Booking Request Created!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your request has been dispatched to verified cooperative workers. You can track its
                progress in your customer dashboard.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="primary" onClick={() => navigate('/customer')}>
                  Go to Customer Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Emergency Banner */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="emergency" className="text-xs text-amber-900 cursor-pointer">
                  <span className="font-bold">Urgent / Emergency Service Request</span>
                  <p className="text-amber-700 mt-0.5">
                    Fastest dispatch to nearest available cooperative worker.
                  </p>
                </label>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Worker Selection
                </label>
                <select
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">AI Fair Match (Recommended — automatically selects nearest worker)</option>
                  {workers.map((wrk) => (
                    <option key={wrk.id} value={wrk.id}>
                      {wrk.name} ({wrk.cooperative}) — ₹{wrk.hourlyRate}/hr
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
                label="Service Address"
                placeholder="Flat / House No, Landmark, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Description / Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe the issue or requirements in detail..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Submitting Booking...' : isEmergency ? '🚨 Request Emergency Worker' : 'Confirm Booking'}
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
