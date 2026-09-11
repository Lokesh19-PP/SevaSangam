import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';

/**
 * Worker Availability Page — SevaSangam
 *
 * Lets a worker configure:
 *  - Overall availability status (Available / Busy / Offline)
 *  - Weekly schedule: per-day on/off toggle + time slots
 *  - Blocked-out date ranges (holidays / leave)
 *  - Emergency / on-demand availability toggle
 *
 * Lives at: /worker/availability
 * Uses: Button, Badge from components/ui
 */

// ── Constants ──────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_SLOTS = [
  '06:00 – 08:00',
  '08:00 – 10:00',
  '10:00 – 12:00',
  '12:00 – 14:00',
  '14:00 – 16:00',
  '16:00 – 18:00',
  '18:00 – 20:00',
  '20:00 – 22:00',
];

const INIT_SCHEDULE = Object.fromEntries(
  DAYS.map((day, i) => [
    day,
    {
      enabled: i < 6, // Mon–Sat on by default
      slots: ['08:00 – 10:00', '10:00 – 12:00', '14:00 – 16:00', '16:00 – 18:00'],
    },
  ])
);

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available',  color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'busy',      label: 'Busy',        color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
  { value: 'offline',   label: 'Offline',     color: 'bg-slate-400',   text: 'text-slate-600',   bg: 'bg-slate-100',  border: 'border-slate-200'   },
];

// ── Section wrapper ────────────────────────────────────────────────
const Section = ({ title, subtitle, children }) => (
  <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// ── Toggle Switch ──────────────────────────────────────────────────
const Toggle = ({ id, checked, onChange, label }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 cursor-pointer select-none"
  >
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={`w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
      />
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </div>
    {label && <span className="text-xs font-medium text-slate-700">{label}</span>}
  </label>
);

// ── Main Component ─────────────────────────────────────────────────
const Availability = () => {
  const { availability }              = useOutletContext() || {};
  const status                        = availability || 'available';
  const [schedule, setSchedule]       = useState(INIT_SCHEDULE);
  const [emergency, setEmergency]     = useState(false);
  const [leaveStart, setLeaveStart]   = useState('');
  const [leaveEnd, setLeaveEnd]       = useState('');
  const [leaves, setLeaves]           = useState([]);
  const [saved, setSaved]             = useState(false);

  // ── Helpers ──
  const toggleDay = (day, enabled) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], enabled } }));

  const toggleSlot = (day, slot) => {
    setSchedule((prev) => {
      const existing = prev[day].slots;
      const updated = existing.includes(slot)
        ? existing.filter((s) => s !== slot)
        : [...existing, slot];
      return { ...prev, [day]: { ...prev[day], slots: updated } };
    });
  };

  const addLeave = () => {
    if (!leaveStart || !leaveEnd) return;
    setLeaves((prev) => [...prev, { id: Date.now(), start: leaveStart, end: leaveEnd }]);
    setLeaveStart('');
    setLeaveEnd('');
  };

  const removeLeave = (id) =>
    setLeaves((prev) => prev.filter((l) => l.id !== id));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentStatus = STATUS_OPTIONS.find((o) => o.value === status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Availability</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Set your working hours, time slots, and leave dates so customers see accurate availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              ✓ Availability saved
            </span>
          )}
          <Button
            id="availability-save-btn"
            variant="primary"
            size="sm"
            onClick={handleSave}
          >
            Save Availability
          </Button>
        </div>
      </div>

      {/* ── Emergency Availability ── */}
      <Section
        title="Emergency / On-Demand Availability"
        subtitle="When enabled, customers can book you for urgent same-day requests (premium rate applies)."
      >
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-rose-800">Emergency / On-Demand Availability</p>
            <p className="text-xs text-rose-600/80 mt-0.5">
              When enabled, customers can book you for urgent same-day requests (premium rate applies).
            </p>
          </div>
          <Toggle
            id="emergency-toggle"
            checked={emergency}
            onChange={setEmergency}
          />
        </div>
        {emergency && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="danger" size="sm" dot>On-Demand Active</Badge>
            <span className="text-xs text-slate-500">You will receive SOS booking alerts</span>
          </div>
        )}
      </Section>

      {/* ── Weekly Schedule ── */}
      <Section
        title="Weekly Schedule"
        subtitle="Enable the days you work and select the time slots available for bookings."
      >
        <div className="space-y-4">
          {DAYS.map((day) => {
            const dayData = schedule[day];
            return (
              <div
                key={day}
                className={`rounded-xl border transition-all ${
                  dayData.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/60 opacity-60'
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">{day}</span>
                  <Toggle
                    id={`day-toggle-${day.toLowerCase()}`}
                    checked={dayData.enabled}
                    onChange={(val) => toggleDay(day, val)}
                  />
                </div>

                {/* Time slot grid */}
                {dayData.enabled && (
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Available time slots
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const active = dayData.slots.includes(slot);
                        return (
                          <button
                            key={slot}
                            id={`slot-${day.toLowerCase()}-${slot.replace(/[:\s–]/g, '')}`}
                            type="button"
                            onClick={() => toggleSlot(day, slot)}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                              active
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {dayData.slots.length === 0 && (
                      <p className="text-xs text-slate-400 italic mt-2">
                        No slots selected — you won't receive bookings on this day.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Leave / Blocked Dates ── */}
      <Section
        title="Leave & Blocked Dates"
        subtitle="Mark date ranges when you are unavailable. Existing bookings in this window will be flagged."
      >
        {/* Add leave form */}
        <div className="flex flex-wrap items-end gap-3 mb-5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              From
            </label>
            <input
              id="leave-start-date"
              type="date"
              value={leaveStart}
              onChange={(e) => setLeaveStart(e.target.value)}
              className="text-sm border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              To
            </label>
            <input
              id="leave-end-date"
              type="date"
              value={leaveEnd}
              min={leaveStart}
              onChange={(e) => setLeaveEnd(e.target.value)}
              className="text-sm border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
            />
          </div>
          <Button
            id="add-leave-btn"
            variant="outline"
            size="sm"
            onClick={addLeave}
            disabled={!leaveStart || !leaveEnd}
          >
            + Block Dates
          </Button>
        </div>

        {/* Leaves list */}
        {leaves.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-400">
            No blocked dates. You appear available on all enabled days.
          </div>
        ) : (
          <div className="space-y-2">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50/60"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {new Date(leave.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' '}–{' '}
                      {new Date(leave.end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500">Blocked — unavailable for bookings</p>
                  </div>
                </div>
                <button
                  id={`remove-leave-${leave.id}`}
                  type="button"
                  onClick={() => removeLeave(leave.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-rose-50"
                  aria-label="Remove blocked date range"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Summary ── */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 flex flex-wrap gap-5">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${currentStatus.color} ${status === 'available' ? 'animate-pulse' : ''}`} />
          <div>
            <p className="text-xs text-slate-500">Current Status</p>
            <p className={`text-sm font-bold ${currentStatus.text}`}>{currentStatus.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl">📅</span>
          <div>
            <p className="text-xs text-slate-500">Active Work Days</p>
            <p className="text-sm font-bold text-slate-800">
              {DAYS.filter((d) => schedule[d].enabled).length} days / week
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl">⏰</span>
          <div>
            <p className="text-xs text-slate-500">Avg Slots / Active Day</p>
            <p className="text-sm font-bold text-slate-800">
              {(() => {
                const active = DAYS.filter((d) => schedule[d].enabled);
                if (!active.length) return '—';
                const total = active.reduce((sum, d) => sum + schedule[d].slots.length, 0);
                return (total / active.length).toFixed(1);
              })()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <p className="text-xs text-slate-500">Emergency Bookings</p>
            <p className={`text-sm font-bold ${emergency ? 'text-rose-600' : 'text-slate-400'}`}>
              {emergency ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
