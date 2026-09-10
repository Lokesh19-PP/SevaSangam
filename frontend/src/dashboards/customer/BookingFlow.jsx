import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { services } from '../../mock/data/services';
import { workers } from '../../mock/data/workers';
import { Button, Card, Badge, Input, Avatar } from '../../components/ui';

/**
 * BookingFlow Component — SevaSangam
 * Multi-step booking flow matching the reference image:
 * Step 1: Select Service
 * Step 2: Select Worker (from cooperative matched list)
 * Step 3: Choose Date, Slot, Address, Payment Method (as in Image 1)
 * Step 4: Confirm & Summary (100% of fare to worker — zero commission)
 * Step 5: Booking Confirmation / Receipt
 */

// Available time slots
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

  const preselectedServiceId = searchParams.get('service') || searchParams.get('svc');
  const preselectedWorkerId = searchParams.get('worker');

  const [step, setStep] = useState(preselectedServiceId ? (preselectedWorkerId ? 3 : 2) : 1);
  const [selectedService, setSelectedService] = useState(
    services.find((s) => s.id === preselectedServiceId) || null
  );
  const [selectedWorker, setSelectedWorker] = useState(
    workers.find((w) => w.id === preselectedWorkerId) || null
  );

  // Step 3 — Schedule & Address
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+91 98230 12345');
  const [avoidCall, setAvoidCall] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [tip, setTip] = useState(75);
  const [customTip, setCustomTip] = useState('');

  // Step 4 completion
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef] = useState('SS-BKG-2025-' + Math.floor(1000 + Math.random() * 9000));

  const availableWorkers = useMemo(
    () => (selectedService ? workers.filter((w) => w.availability === 'available') : []),
    [selectedService]
  );

  const effectiveTip = tip === 'custom' ? (parseInt(customTip) || 0) : (tip || 0);
  const serviceTotal = selectedService?.basePrice || 0;
  // 100% of payment to worker — no platform fee, no admin commission
  const totalAmount = serviceTotal + effectiveTip;

  // Today's date for min date picker
  const today = new Date().toISOString().split('T')[0];

  // Build next 7 days for quick date selection
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const formatDate = (d) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const canProceedStep3 = selectedDate && selectedSlot && address.trim().length > 10 && phone.trim().length > 8;

  const handleConfirmBooking = () => {
    setIsBooked(true);
    setStep(5);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Step Breadcrumb */}
      {!isBooked && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Book a Cooperative Service</h1>
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
                        ? 'bg-primary-700 border-primary-700 text-white cursor-pointer hover:bg-primary-800'
                        : step === s.id
                        ? 'bg-white border-primary-700 text-primary-800'
                        : 'bg-white border-slate-200 text-slate-400 cursor-default'
                    }`}
                  >
                    {step > s.id ? (
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : s.id}
                  </button>
                  <span className={`text-[10px] font-semibold mt-1 ${step >= s.id ? 'text-primary-700' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 mb-3 transition-colors duration-300 ${step > s.id ? 'bg-primary-700' : 'bg-slate-200'}`} />
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
            <h2 className="text-base font-bold text-slate-900 mb-4">Select a Service Category</h2>
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
                      ? 'border-primary-700 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <span className="text-lg">{service.icon === 'wrench' ? '🔧' : service.icon === 'bolt' ? '⚡' : service.icon === 'hammer' ? '🔨' : service.icon === 'sparkles' ? '✨' : service.icon === 'heart' ? '❤️' : '🛠️'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{service.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">From ₹{service.basePrice} • {service.estimatedTime}</p>
                  </div>
                  {service.emergencySupported && (
                    <Badge variant="danger" size="sm" className="shrink-0">24x7</Badge>
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Choose a Cooperative Worker</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Workers are matched fairly by proximity and workload balance — not just ratings.
                </p>
              </div>
              <Badge variant="primary" size="sm">AI Fair Match</Badge>
            </div>

            <div className="space-y-3">
              {availableWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className={`flex items-start justify-between gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                    selectedWorker?.id === worker.id
                      ? 'border-primary-700 bg-primary-50'
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
                      <h3 className="text-sm font-bold text-slate-900">{worker.name}</h3>
                      <p className="text-xs text-primary-700 font-medium">{worker.primarySkill}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>★ {worker.rating} ({worker.reviewCount})</span>
                        <span>•</span>
                        <span>📍 {worker.distance}</span>
                        <span>•</span>
                        <span>{worker.experienceYears} yrs</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {worker.skills.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-base font-extrabold text-slate-900">₹{worker.hourlyRate}/hr</p>
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">100% to worker</p>
                    {selectedWorker?.id === worker.id && (
                      <div className="mt-2">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">Selected ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="md" onClick={() => setStep(1)}>← Back</Button>
            <Button
              variant="primary"
              size="md"
              disabled={!selectedWorker}
              onClick={() => setStep(3)}
            >
              Continue with {selectedWorker?.name?.split(' ')[0] || 'Worker'} →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 — Date, Slot, Address, Payment (as per Image 1) */}
      {step === 3 && selectedWorker && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* LEFT: Booking details form */}
          <div className="md:col-span-7 space-y-4">
            {/* Phone */}
            <Card className="divide-y divide-slate-100 border border-slate-200/80">
              <div className="flex items-center gap-3.5 p-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700">Send booking details to</p>
                  <p className="text-sm font-bold text-slate-900">{phone}</p>
                </div>
              </div>

              {/* Address */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Address</span>
                </div>
                <Input
                  placeholder="Enter your complete service address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  helperText="Cooperative worker will navigate to this address"
                />
                <Button variant="primary" fullWidth size="md" className="mt-1">
                  Select address from map
                </Button>
              </div>

              {/* Slot Selection */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Choose Slot</span>
                </div>

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
                        <span className={`text-[10px] font-bold mb-0.5 ${selectedSlot?.id === slot.id ? 'text-primary-200' : 'text-slate-400'}`}>
                          {slot.period}
                        </span>
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Payment Method</span>
                </div>

                <div className="space-y-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <label key={pm.id} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
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

            {/* Cancellation policy */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-sm font-bold text-slate-900">Cancellation policy</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Free cancellations if done more than 12 hrs before the service. A visitation fee will be charged otherwise to fairly compensate the cooperative worker for travel.
              </p>
              <button className="text-xs font-semibold text-primary-700 hover:underline mt-1">Read full policy</button>
            </div>
          </div>

          {/* RIGHT: Service summary + payment summary (Image 1) */}
          <div className="md:col-span-5 space-y-4">
            {/* Service Detail Card */}
            <Card className="p-5 border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-3">{selectedService?.name}</h3>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-700">{selectedService?.name} consultation</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">₹{selectedService?.basePrice}</span>
                </div>
              </div>
            </Card>

            {/* Payment Summary (matching Image 1) */}
            <Card className="p-5 border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4">Payment summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Item total</span>
                  <span className="font-semibold">₹{selectedService?.basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 pb-3 border-b border-dashed border-slate-200">
                  <span>Visitation Fee</span>
                  <span className="font-semibold">₹{selectedService?.basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
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
                <div className="flex items-center justify-between font-extrabold text-base text-primary-800">
                  <span>Amount to pay</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Tip Section (Image 1 style) */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Add a tip to thank the Professional</h4>
                <p className="text-[11px] text-primary-700 font-semibold mb-3">100% of the tip goes to the professional.</p>
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
                          ? 'bg-primary-700 border-primary-700 text-white'
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
                ✓ 100% of ₹{totalAmount.toLocaleString('en-IN')} goes directly to <strong>{selectedWorker?.name}</strong>. Zero platform commission. Cooperative Promise.
              </div>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>← Back</Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!canProceedStep3}
                onClick={() => setStep(4)}
              >
                Review & Confirm Booking →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 — Confirmation Review */}
      {step === 4 && !isBooked && (
        <div className="space-y-4 max-w-xl mx-auto">
          <Card className="p-6 border border-slate-200/80">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Review Your Booking</h2>

            <dl className="space-y-4">
              {[
                { label: 'Service', value: selectedService?.name },
                { label: 'Worker', value: `${selectedWorker?.name} — ${selectedWorker?.primarySkill}` },
                { label: 'Date', value: new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Slot', value: selectedSlot?.label },
                { label: 'Address', value: address },
                { label: 'Payment', value: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
                  <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24 shrink-0">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Final Amount */}
            <div className="mt-5 pt-4 border-t-2 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">Total Amount</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">100% goes to {selectedWorker?.name}</p>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              {effectiveTip > 0 && (
                <p className="text-[11px] text-slate-500 mt-1">Includes ₹{effectiveTip} tip (100% to worker)</p>
              )}
            </div>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="md" onClick={() => setStep(3)}>← Edit Details</Button>
            <Button variant="primary" size="lg" fullWidth onClick={handleConfirmBooking}>
              Confirm & Book Now ✓
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5 — Booking Confirmed Receipt */}
      {isBooked && (
        <div className="max-w-xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Success Animation Circle */}
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-4">Booking Confirmed!</h2>
            <p className="text-sm text-slate-500 mt-1">Your cooperative service request has been placed.</p>
          </div>

          {/* Booking Receipt Card */}
          <Card className="p-6 border border-slate-200/80 shadow-md">
            {/* Receipt Header */}
            <div className="flex items-start justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Reference</p>
                <p className="text-lg font-mono font-bold text-primary-700">{bookingRef}</p>
              </div>
              <Badge variant="success" size="md">Confirmed</Badge>
            </div>

            {/* Receipt Body */}
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Service', value: selectedService?.name },
                { label: 'Worker', value: selectedWorker?.name },
                { label: 'Cooperative', value: selectedWorker?.cooperative },
                { label: 'Date & Slot', value: `${new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · ${selectedSlot?.label}` },
                { label: 'Address', value: address },
                { label: 'Payment', value: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="text-xs font-bold text-slate-400 w-28 shrink-0">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Amount */}
            <div className="mt-5 pt-4 border-t-2 border-primary-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600">Amount to Pay</p>
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5">100% goes to {selectedWorker?.name}</p>
                {effectiveTip > 0 && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Includes ₹{effectiveTip} tip</p>
                )}
              </div>
              <p className="text-2xl font-extrabold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>

            {/* Cooperative Zero Commission Declaration */}
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium leading-relaxed">
              <strong className="block mb-1">Cooperative Transparency Declaration</strong>
              ₹{serviceTotal.toLocaleString('en-IN')} (your total service fee) goes <strong>100% directly into {selectedWorker?.name}'s hands</strong>.
              No platform cut. No admin commission. Worker welfare insurance is government-backed (PMSBY) — not deducted from your payment.
              {effectiveTip > 0 && ` Additional tip of ₹${effectiveTip} is also 100% to the worker.`}
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
