import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { services } from '../../mock/data/services';
import { workers } from '../../mock/data/workers';
import { Button, Card, Badge, Input, Avatar } from '../../components/ui';

/**
 * BookingFlow Component — SevaSangam
 * Multi-step booking flow with integrated Emergency Service Mode support:
 * Step 1: Select Service
 * Step 2: Select Worker (from cooperative matched list with emergency priority)
 * Step 3: Choose Date, Slot, Address, Location, Payment Method
 * Step 4: Confirm & Summary (100% of fare to worker — zero commission)
 * Step 5: Booking Confirmation / Receipt (with Emergency SLA details if enabled)
 */

// Available standard time slots
const TIME_SLOTS = [
  { id: 'sl_1', label: '8:00 AM – 10:00 AM', period: 'Morning' },
  { id: 'sl_2', label: '10:00 AM – 12:00 PM', period: 'Morning' },
  { id: 'sl_3', label: '12:00 PM – 2:00 PM', period: 'Afternoon' },
  { id: 'sl_4', label: '2:00 PM – 4:00 PM', period: 'Afternoon' },
  { id: 'sl_5', label: '4:00 PM – 6:00 PM', period: 'Evening' },
  { id: 'sl_6', label: '6:00 PM – 8:00 PM', period: 'Evening' },
];

// Tip amounts (100% to worker)
const TIPS = [
  { label: '₹50', value: 50 },
  { label: '₹75', value: 75, popular: true },
  { label: '₹100', value: 100 },
  { label: 'Custom', value: 'custom' },
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / BHIM / GPay', icon: '📱' },
  { id: 'cash', label: 'Cash on Service', icon: '💵' },
  { id: 'card', label: 'Debit / Credit Card', icon: '💳' },
];

// Step indicator
const STEPS = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Worker' },
  { id: 3, label: 'Schedule' },
  { id: 4, label: 'Confirm' },
];

const BookingFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emergencyParam = searchParams.get('emergency') === 'true';
  const preselectedServiceId = searchParams.get('service') || searchParams.get('svc') || (emergencyParam ? 'svc_001' : null);
  const preselectedWorkerId = searchParams.get('worker');

  // Emergency Service toggle state
  const [isEmergency, setIsEmergency] = useState(emergencyParam);

  // Tools & Materials Required toggle state
  const [isToolsRequired, setIsToolsRequired] = useState(false);

  const [step, setStep] = useState(preselectedServiceId ? (preselectedWorkerId ? 3 : 2) : 1);
  const [selectedService, setSelectedService] = useState(
    services.find((s) => s.id === preselectedServiceId) || (emergencyParam ? services[0] : null)
  );
  const [selectedWorker, setSelectedWorker] = useState(
    workers.find((w) => w.id === preselectedWorkerId) || null
  );

  // Read saved profile for initial address & location
  const savedProfile = (() => {
    try {
      const p = localStorage.getItem('sevasangam_customer_profile');
      if (p) return JSON.parse(p);
    } catch {
      // ignore
    }
    return null;
  })();

  // Today's date for date picker
  const today = new Date().toISOString().split('T')[0];

  // Step 3 — Schedule & Address
  const [selectedDate, setSelectedDate] = useState(emergencyParam ? today : '');
  const [selectedSlot, setSelectedSlot] = useState(
    emergencyParam
      ? { id: 'emg_immediate', label: 'Immediate Dispatch (15–20 Mins)', period: '⚡ Priority Dispatch' }
      : null
  );
  const [locationArea, setLocationArea] = useState(savedProfile?.location || 'Pune, Kothrud (Current Location)');
  const [address, setAddress] = useState(
    savedProfile?.address || 'Flat 402, Green Meadows, Kothrud, Pune, Maharashtra 411038'
  );
  const [phone, setPhone] = useState(savedProfile?.phone || '+91 98230 12345');
  const [avoidCall, setAvoidCall] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [tip, setTip] = useState(75);
  const [customTip, setCustomTip] = useState('');

  // Step 4 completion
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef] = useState(
    (emergencyParam ? 'SS-EMG-2025-' : 'SS-BKG-2025-') + Math.floor(1000 + Math.random() * 9000)
  );

  // When emergency mode is toggled, auto configure immediate dispatch slot and date
  const handleToggleEmergency = () => {
    const nextVal = !isEmergency;
    setIsEmergency(nextVal);

    if (nextVal) {
      setSelectedDate(today);
      setSelectedSlot({
        id: 'emg_immediate',
        label: 'Immediate Dispatch (15–20 Mins)',
        period: '⚡ Priority Dispatch',
      });
      // If no service selected, preselect primary emergency plumbing
      if (!selectedService) {
        setSelectedService(services[0]);
      }
    }
  };

  // Sync state if URL query param changes
  useEffect(() => {
    if (searchParams.get('emergency') === 'true' && !isEmergency) {
      setIsEmergency(true);
      setSelectedDate(today);
      setSelectedSlot({
        id: 'emg_immediate',
        label: 'Immediate Dispatch (15–20 Mins)',
        period: '⚡ Priority Dispatch',
      });
    }
  }, [searchParams]);

  // Workers matching logic — prioritizes on-call emergency workers & nearest distance when emergency is ON
  const availableWorkers = useMemo(() => {
    if (!selectedService) return [];
    let list = workers.filter((w) => w.availability === 'available');

    if (isEmergency) {
      list = [...list].sort((a, b) => {
        // First prioritize emergency availability
        if (a.emergencyAvailable && !b.emergencyAvailable) return -1;
        if (!a.emergencyAvailable && b.emergencyAvailable) return 1;
        // Next sort by physical proximity
        return (a.distanceKm || 99) - (b.distanceKm || 99);
      });
    }
    return list;
  }, [selectedService, isEmergency]);

  const effectiveTip = tip === 'custom' ? (parseInt(customTip) || 0) : (tip || 0);
  const serviceTotal = selectedService?.basePrice || 0;
  // Tools & Materials 15% surcharge (if toggle is ON)
  const toolsCharge = isToolsRequired ? Math.round(serviceTotal * 0.15) : 0;
  // 100% of payment to worker — no platform fee, no admin commission
  const totalAmount = serviceTotal + effectiveTip + toolsCharge;

  // Build next 7 days for quick date selection
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const formatDate = (d) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const canProceedStep3 =
    (isEmergency ? true : selectedDate && selectedSlot) &&
    address.trim().length > 5 &&
    phone.trim().length > 8;

  const handleConfirmBooking = () => {
    setIsBooked(true);
    setStep(5);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Emergency Service Toggle & Banner */}
      {!isBooked && (
        <Card
          className={`p-4 sm:p-5 border transition-all ${
            isEmergency
              ? 'bg-rose-50/80 border-rose-300 shadow-sm'
              : 'bg-white border-slate-200/80 shadow-2xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-colors ${
                  isEmergency
                    ? 'bg-rose-600 text-white shadow-sm animate-pulse'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Emergency Service</h2>
                  <Badge
                    variant={isEmergency ? 'danger' : 'default'}
                    size="sm"
                    dot={isEmergency}
                    className="font-bold"
                  >
                    {isEmergency ? 'ON' : 'OFF'}
                  </Badge>
                  {isEmergency && (
                    <span className="hidden sm:inline-flex text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      Priority booking enabled
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isEmergency
                    ? '⚡ Priority booking enabled • Nearest available cooperative workers prioritized • Instant dispatch'
                    : 'Turn ON for urgent water leaks, electrical sparking, emergency lockouts, or immediate assistance'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {isEmergency ? 'Emergency Mode' : 'Standard Mode'}
              </span>
              <button
                type="button"
                onClick={handleToggleEmergency}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEmergency ? 'bg-rose-600 ring-2 ring-rose-300' : 'bg-slate-300'
                }`}
                aria-label="Toggle Emergency Service"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isEmergency ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Emergency Priority Alert Sub-bar */}
          {isEmergency && (
            <div className="mt-3.5 pt-3 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-rose-950 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span>AI Fast Match Active • Matching nearest on-call verified worker</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/90 border border-rose-200 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
                  📍 {locationArea}
                </span>
                <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                  ⏱️ Estimated Arrival: 15–20 mins
                </span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Step Breadcrumb Header */}
      {!isBooked && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{isEmergency ? '⚡ Emergency Service Dispatch' : 'Book a Cooperative Service'}</span>
                {isEmergency && <Badge variant="danger" size="sm">Urgent Priority</Badge>}
              </h1>
              <p className="text-xs text-slate-500">
                {isEmergency
                  ? 'Follow the steps below to confirm your emergency worker dispatch.'
                  : 'Select service, worker, and preferred visit slot.'}
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">Step {step} of 4</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-0 mt-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => step > s.id && setStep(s.id)}
                    disabled={step <= s.id}
                    className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center border-2 transition-all duration-150 ${
                      step > s.id
                        ? isEmergency
                          ? 'bg-rose-700 border-rose-700 text-white cursor-pointer hover:bg-rose-800'
                          : 'bg-primary-700 border-primary-700 text-white cursor-pointer hover:bg-primary-800'
                        : step === s.id
                        ? isEmergency
                          ? 'bg-white border-rose-600 text-rose-700'
                          : 'bg-white border-primary-700 text-primary-800'
                        : 'bg-white border-slate-200 text-slate-400 cursor-default'
                    }`}
                  >
                    {step > s.id ? (
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </button>
                  <span
                    className={`text-[10px] font-semibold mt-1 ${
                      step >= s.id
                        ? isEmergency
                          ? 'text-rose-700'
                          : 'text-primary-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 mb-3 transition-colors duration-300 ${
                      step > s.id
                        ? isEmergency
                          ? 'bg-rose-600'
                          : 'bg-primary-700'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 — Select Service */}
      {step === 1 && (
        <div className="space-y-4">
          <Card className="p-5 border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isEmergency ? 'Select Emergency Service Category' : 'Select a Service Category'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEmergency
                    ? 'All emergency categories include priority matching with verified nearby cooperative workers.'
                    : 'Standard cooperative services backed by 30-day work warranty.'}
                </p>
              </div>
              {isEmergency && (
                <Badge variant="danger" size="sm">
                  ⚡ 24×7 Active On-Call
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(service);
                    setSelectedWorker(null);
                    setStep(2);
                  }}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all cursor-pointer hover:shadow-sm ${
                    selectedService?.id === service.id
                      ? isEmergency
                        ? 'border-rose-600 bg-rose-50'
                        : 'border-primary-700 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isEmergency
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    <span className="text-lg">
                      {service.icon === 'wrench'
                        ? '🔧'
                        : service.icon === 'bolt'
                        ? '⚡'
                        : service.icon === 'hammer'
                        ? '🔨'
                        : service.icon === 'sparkles'
                        ? '✨'
                        : service.icon === 'heart'
                        ? '❤️'
                        : '🛠️'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{service.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      From ₹{service.basePrice} • {isEmergency ? '⚡ ~15 min arrival' : service.estimatedTime}
                    </p>
                  </div>
                  {service.emergencySupported && (
                    <Badge variant="danger" size="sm" className="shrink-0">
                      24x7
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* STEP 2 — Select Worker */}
      {step === 2 && selectedService && (
        <div className="space-y-4">
          <Card className="p-5 border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Choose a Cooperative Worker</span>
                  {isEmergency && <Badge variant="danger" size="sm">⚡ Emergency Prioritized</Badge>}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEmergency
                    ? 'Workers with active 24×7 on-call availability and closest physical proximity are ranked first.'
                    : 'Workers are matched fairly by proximity and workload balance — not just ratings.'}
                </p>
              </div>
              <Badge variant={isEmergency ? 'danger' : 'primary'} size="sm">
                {isEmergency ? '⚡ Emergency Queue' : 'AI Fair Match'}
              </Badge>
            </div>

            <div className="space-y-3">
              {availableWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className={`flex items-start justify-between gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                    selectedWorker?.id === worker.id
                      ? isEmergency
                        ? 'border-rose-600 bg-rose-50'
                        : 'border-primary-700 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      name={worker.name}
                      src={worker.avatar}
                      size="md"
                      status="online"
                      verified={worker.isVerified}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{worker.name}</h3>
                        {isEmergency && worker.emergencyAvailable && (
                          <Badge variant="danger" size="sm">
                            ⚡ On-Call
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-primary-700 font-medium">{worker.primarySkill}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>★ {worker.rating} ({worker.reviewCount})</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">📍 {worker.distance}</span>
                        <span>•</span>
                        <span>{worker.experienceYears} yrs exp</span>
                        {isEmergency && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              ⏱️ ~15 min ETA
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {worker.skills.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-base font-extrabold text-slate-900">₹{worker.hourlyRate}/hr</p>
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">100% to worker</p>
                    {selectedWorker?.id === worker.id && (
                      <div className="mt-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            isEmergency
                              ? 'text-rose-700 bg-rose-50 border-rose-300'
                              : 'text-primary-700 bg-primary-50 border-primary-200'
                          }`}
                        >
                          Selected ✓
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="md" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button
              variant={isEmergency ? 'danger' : 'primary'}
              size="md"
              disabled={!selectedWorker}
              onClick={() => setStep(3)}
            >
              Continue with {selectedWorker?.name?.split(' ')[0] || 'Worker'} →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 — Date, Slot, Address, Location, Payment */}
      {step === 3 && selectedWorker && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* LEFT: Booking details form */}
          <div className="md:col-span-7 space-y-4">
            <Card className="divide-y divide-slate-100 border border-slate-200/80">
              {/* Emergency Banner if Active */}
              {isEmergency && (
                <div className="p-4 bg-rose-50/90 border-b border-rose-100 flex items-start gap-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                      Immediate Priority Dispatch Enabled
                    </h4>
                    <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                      Worker will be dispatched immediately upon confirmation. Average travel time to {locationArea} is 15–20 minutes.
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              <div className="flex items-center gap-3.5 p-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700">Send booking updates to</p>
                  <p className="text-sm font-bold text-slate-900">{phone}</p>
                </div>
              </div>

              {/* Location & Address */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Location Area</span>
                  </div>
                  <Badge variant="primary" size="sm">📍 Current Location</Badge>
                </div>

                <Input
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  placeholder="e.g. Pune, Kothrud"
                  helperText="Used for rapid proximity matching"
                />

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Address <span className="text-rose-600">*</span>
                  </label>
                  <Input
                    placeholder="Enter your complete service address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    helperText="Cooperative worker will navigate directly to this address"
                  />
                </div>
              </div>

              {/* Slot / Timing Selection */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {isEmergency ? 'Emergency Timing' : 'Choose Slot'}
                    </span>
                  </div>
                  {isEmergency && (
                    <Badge variant="danger" size="sm">
                      ⚡ Immediate
                    </Badge>
                  )}
                </div>

                {isEmergency ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <strong className="block font-bold">Immediate Worker Dispatch</strong>
                      <span>Assigned worker departs immediately upon confirmation.</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      ~15-20 Min ETA
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Quick Date Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {nextDays.map((d, i) => {
                        const val = d.toISOString().split('T')[0];
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedDate(val)}
                            className={`px-3 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                              selectedDate === val
                                ? 'bg-primary-700 border-primary-700 text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-primary-400'
                            }`}
                          >
                            {formatDate(d)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`flex flex-col p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer transition-all ${
                              selectedSlot?.id === slot.id
                                ? 'bg-primary-700 border-primary-700 text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-primary-400'
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold mb-0.5 ${
                                selectedSlot?.id === slot.id ? 'text-primary-200' : 'text-slate-400'
                              }`}
                            >
                              {slot.period}
                            </span>
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Payment Method */}
              <div className="p-4 space-y-3">
                <span className="text-sm font-semibold text-slate-700">Payment Method</span>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.id}
                      className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="text-primary-700 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-lg">{pm.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            {/* Avoid calling preference */}
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={avoidCall}
                onChange={(e) => setAvoidCall(e.target.checked)}
                className="mt-0.5 text-primary-700 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-slate-700">Avoid calling before reaching the location</span>
            </label>
          </div>

          {/* RIGHT: Service summary + payment summary */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">{selectedService?.name}</h3>
                {isEmergency && <Badge variant="danger" size="sm">⚡ Emergency Booking</Badge>}
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-700">Standard Visit & Consultation</span>
                <span className="text-sm font-bold text-slate-900">₹{selectedService?.basePrice}</span>
              </div>
              {isEmergency && (
                <div className="flex items-center justify-between py-2 text-xs text-rose-700 font-semibold">
                  <span>⚡ Priority Dispatch Surcharge</span>
                  <span className="text-emerald-700 font-bold">₹0 (Zero Surcharge)</span>
                </div>
              )}

              {/* Tools & Materials Toggle */}
              <div className={`mt-3 p-3.5 rounded-xl border transition-all ${
                isToolsRequired
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className={`text-lg shrink-0 ${ isToolsRequired ? '' : 'opacity-60' }`}>🛠️</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Tools & Materials Required</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {isToolsRequired
                          ? '⚠️ Worker will bring required tools/materials (+15% surcharge)'
                          : 'Customer will provide the required tools/materials.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsToolsRequired((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isToolsRequired ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-slate-300'
                    }`}
                    aria-label="Toggle Tools & Materials"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isToolsRequired ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>

            {/* Payment Summary */}
            <Card className="p-5 border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4">Payment summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Base Service</span>
                  <span className="font-semibold">₹{selectedService?.basePrice}</span>
                </div>
                {isToolsRequired && (
                  <div className="flex items-center justify-between text-amber-700 font-semibold">
                    <span>🛠️ Tools & Materials (15%)</span>
                    <span>+₹{toolsCharge}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-700 pb-3 border-b border-dashed border-slate-200">
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Platform Commission
                  </span>
                  <span className="font-bold text-emerald-700">₹0</span>
                </div>
                <div className="flex items-center justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total amount</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className={`flex items-center justify-between font-extrabold text-base ${
                  isEmergency ? 'text-rose-700' : 'text-primary-800'
                }`}>
                  <span>Amount to pay</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Tip Section */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Add a tip to thank the Professional</h4>
                <p className="text-[11px] text-primary-700 font-semibold mb-3">
                  100% of the tip goes directly to the professional.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {TIPS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => {
                        if (t.value !== 'custom') setTip(t.value);
                        else setTip('custom');
                      }}
                      className={`relative px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        tip === t.value
                          ? isEmergency
                            ? 'bg-rose-700 border-rose-700 text-white'
                            : 'bg-primary-700 border-primary-700 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-primary-400'
                      }`}
                    >
                      {t.label}
                      {t.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary-700 bg-primary-50 border border-primary-200 px-1 rounded-full whitespace-nowrap">
                          POPULAR
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {tip === 'custom' && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter custom tip amount ₹"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value.replace(/[^0-9]/g, ''))}
                      type="number"
                      helperText="100% goes to the worker"
                    />
                  </div>
                )}
              </div>

              {/* Zero commission declaration */}
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                ✓ 100% of ₹{totalAmount.toLocaleString('en-IN')} goes directly to{' '}
                <strong>{selectedWorker?.name}</strong>. Zero platform cut. Cooperative Promise.
              </div>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                ← Back
              </Button>
              <Button
                variant={isEmergency ? 'danger' : 'primary'}
                size="lg"
                fullWidth
                disabled={!canProceedStep3}
                onClick={() => setStep(4)}
              >
                {isEmergency ? 'Review Emergency Request →' : 'Review & Confirm Booking →'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 — Confirmation Review */}
      {step === 4 && !isBooked && (
        <div className="space-y-4 max-w-xl mx-auto">
          <Card className="p-6 border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Review Your Booking</h2>
              {isEmergency && <Badge variant="danger" size="sm">⚡ Emergency Dispatch</Badge>}
            </div>

            <dl className="space-y-4">
              {[
                { label: 'Booking Mode', value: isEmergency ? '⚡ Priority Emergency Dispatch' : 'Standard Scheduled Service' },
                { label: 'Service', value: selectedService?.name },
                { label: 'Worker', value: `${selectedWorker?.name} — ${selectedWorker?.primarySkill}` },
                { label: 'Location', value: locationArea },
                {
                  label: 'Date & Slot',
                  value: isEmergency
                    ? '⚡ Immediate Dispatch (~15-20 Min Arrival)'
                    : `${new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} (${selectedSlot?.label})`,
                },
                { label: 'Address', value: address },
                { label: 'Tools & Materials', value: isToolsRequired ? `🛠️ Worker brings tools (+₹${toolsCharge})` : '✓ Customer provides tools/materials' },
                { label: 'Payment', value: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
                  <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider w-28 shrink-0">
                    {label}
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Final Amount */}
            <div className="mt-5 pt-4 border-t-2 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">Total Amount</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    100% goes directly to {selectedWorker?.name}
                  </p>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              {effectiveTip > 0 && (
                <p className="text-[11px] text-slate-500 mt-1">Includes ₹{effectiveTip} tip (100% to worker)</p>
              )}
            </div>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="md" onClick={() => setStep(3)}>
              ← Edit Details
            </Button>
            <Button
              variant={isEmergency ? 'danger' : 'primary'}
              size="lg"
              fullWidth
              onClick={handleConfirmBooking}
            >
              {isEmergency ? '⚡ Confirm & Dispatch Worker Now' : 'Confirm & Book Now ✓'}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5 — Booking Confirmed Receipt */}
      {isBooked && (
        <div className="max-w-xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="text-center py-8">
            <div
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto shadow-lg ${
                isEmergency
                  ? 'bg-rose-100 border-rose-500 text-rose-700'
                  : 'bg-emerald-100 border-emerald-500 text-emerald-700'
              }`}
            >
              {isEmergency ? (
                <span className="text-3xl animate-pulse">⚡</span>
              ) : (
                <svg className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-4">
              {isEmergency ? '⚡ Emergency Request Dispatched!' : 'Booking Confirmed!'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEmergency
                ? 'Cooperative technician has been notified and is heading to your location.'
                : 'Your cooperative service request has been placed.'}
            </p>
          </div>

          <Card className="p-6 border border-slate-200/80 shadow-md">
            <div className="flex items-start justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Booking Reference
                </p>
                <p className="text-lg font-mono font-bold text-primary-700">{bookingRef}</p>
              </div>
              <Badge variant={isEmergency ? 'danger' : 'success'} size="md">
                {isEmergency ? '⚡ Dispatched' : 'Confirmed'}
              </Badge>
            </div>

            <dl className="space-y-3 text-sm">
              {[
                { label: 'Booking Mode', value: isEmergency ? '⚡ Emergency Priority Dispatch' : 'Standard Service' },
                { label: 'Service', value: selectedService?.name },
                { label: 'Worker Assigned', value: `${selectedWorker?.name} (${selectedWorker?.distance} away)` },
                { label: 'Estimated Arrival', value: isEmergency ? '⏱️ 15–20 Minutes' : selectedSlot?.label },
                { label: 'Cooperative', value: selectedWorker?.cooperative },
                { label: 'Destination', value: address },
                { label: 'Tools & Materials', value: isToolsRequired ? `🛠️ Worker brings (+₹${toolsCharge})` : '✓ Customer provides' },
                { label: 'Payment Mode', value: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="text-xs font-bold text-slate-400 w-32 shrink-0">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 pt-4 border-t-2 border-primary-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600">Amount to Pay</p>
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  100% goes to {selectedWorker?.name}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium leading-relaxed">
              <strong className="block mb-1">Cooperative Transparency Declaration</strong>
              ₹{serviceTotal.toLocaleString('en-IN')} (your total service fee) goes{' '}
              <strong>100% directly into {selectedWorker?.name}’s hands</strong> with zero platform deduction.
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <Button
              variant="outline-primary"
              size="md"
              fullWidth
              onClick={() => navigate('/customer/bookings')}
            >
              View My Bookings
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/customer')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
