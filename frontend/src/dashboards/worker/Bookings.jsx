import React, { useState, useEffect, useMemo } from 'react';
import useBookings from '../../hooks/useBookings';
import useAuth from '../../hooks/useAuth';
import BookingRequestCard from '../../components/cards/BookingRequestCard';
import { Button, Badge, Card, CardHeader, CardContent, CardFooter } from '../../components/ui';

/**
 * Worker Bookings Page — SevaSangam
 *
 * Tabs:
 *  - New Requests: Incoming job requests with Accept/Reject actions (uses BookingRequestCard)
 *  - Upcoming: Confirmed and in-progress jobs with progress tracking
 *  - Completed: Successfully completed jobs with payout summary
 *
 * Fully wired to API layer via useBookings hook (zero direct API imports).
 */
const Bookings = () => {
  const { user } = useAuth();
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBookingStatus,
    cancelBooking,
  } = useBookings();

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'upcoming' | 'completed' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' | 'reject' | 'complete' | 'start'
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Initial fetch on mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Tab Counts
  const counts = useMemo(() => {
    const list = bookings || [];
    return {
      new: list.filter((b) => b.status === 'pending').length,
      upcoming: list.filter((b) => b.status === 'upcoming' || b.status === 'in_progress').length,
      completed: list.filter((b) => b.status === 'completed').length,
      all: list.length,
    };
  }, [bookings]);

  // Filtered Bookings for current tab & search
  const filteredBookings = useMemo(() => {
    let list = bookings || [];

    // Filter by tab
    if (activeTab === 'new') {
      list = list.filter((b) => b.status === 'pending');
    } else if (activeTab === 'upcoming') {
      list = list.filter((b) => b.status === 'upcoming' || b.status === 'in_progress');
    } else if (activeTab === 'completed') {
      list = list.filter((b) => b.status === 'completed');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.customerName?.toLowerCase().includes(q) ||
          b.serviceName?.toLowerCase().includes(q) ||
          b.bookingNumber?.toLowerCase().includes(q) ||
          b.address?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [bookings, activeTab, searchQuery]);

  // Handler: Accept Booking
  const handleAccept = async (booking) => {
    try {
      setProcessingId(booking.id);
      setActionType('accept');
      await updateBookingStatus(booking.id, 'upcoming');
      setFeedbackMessage({
        type: 'success',
        text: `Job ${booking.bookingNumber || '#' + booking.id} accepted! Moved to Upcoming.`,
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: `Failed to accept booking: ${err.message}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handler: Reject Booking
  const handleReject = async (booking) => {
    try {
      setProcessingId(booking.id);
      setActionType('reject');
      await cancelBooking(booking.id, 'Declined by worker');
      setFeedbackMessage({
        type: 'info',
        text: `Job ${booking.bookingNumber || '#' + booking.id} declined.`,
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: `Failed to decline booking: ${err.message}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handler: Start Job (in_progress)
  const handleStartJob = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      setActionType('start');
      await updateBookingStatus(bookingId, 'in_progress');
      setFeedbackMessage({
        type: 'success',
        text: 'Job status updated to In Progress. Work safely!',
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: `Failed to update status: ${err.message}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handler: Complete Job
  const handleCompleteJob = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      setActionType('complete');
      await updateBookingStatus(bookingId, 'completed');
      setFeedbackMessage({
        type: 'success',
        text: 'Congratulations! Job marked as completed. Earnings credited to your ledger.',
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: `Failed to mark completed: ${err.message}`,
      });
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manage Bookings & Jobs
            </h1>
            <Badge variant="primary" size="sm">
              Live Dispatch
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming requests, manage upcoming appointments, and track your completed services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="worker-bookings-refresh-btn"
            variant="outline"
            size="sm"
            onClick={() => fetchBookings()}
            isLoading={loading}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Feedback Banner ── */}
      {feedbackMessage && (
        <div
          id="worker-bookings-alert"
          className={`p-4 rounded-xl border text-sm flex items-center justify-between transition-all ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : feedbackMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-sky-50 text-sky-800 border-sky-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">
              {feedbackMessage.type === 'success' ? '✓' : feedbackMessage.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Tabs & Search Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            id="tab-btn-new"
            type="button"
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'new'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>New Requests</span>
            {counts.new > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                {counts.new}
              </span>
            )}
          </button>

          <button
            id="tab-btn-upcoming"
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Upcoming</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {counts.upcoming}
            </span>
          </button>

          <button
            id="tab-btn-completed"
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {counts.completed}
            </span>
          </button>

          <button
            id="tab-btn-all"
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Bookings</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {counts.all}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            id="worker-bookings-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, service..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Content View ── */}
      {loading && filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-600">Loading your bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === 'new'
              ? 'No new job requests'
              : activeTab === 'upcoming'
              ? 'No upcoming jobs scheduled'
              : activeTab === 'completed'
              ? 'No completed jobs recorded yet'
              : 'No bookings found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'new'
              ? 'Keep your availability set to Online in the top header to receive instant customer bookings.'
              : activeTab === 'upcoming'
              ? 'New confirmed bookings will appear here. Check back soon!'
              : 'Completed services with verified payouts will be archived here.'}
          </p>
        </div>
      ) : activeTab === 'new' ? (
        /* ── New Requests Tab: Uses BookingRequestCard ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => (
            <BookingRequestCard
              key={booking.id}
              booking={booking}
              onAccept={handleAccept}
              onReject={handleReject}
              isAccepting={processingId === booking.id && actionType === 'accept'}
              isRejecting={processingId === booking.id && actionType === 'reject'}
            />
          ))}
        </div>
      ) : activeTab === 'upcoming' ? (
        /* ── Upcoming Tab: Schedule & In-Progress Cards ── */
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isInProgress = booking.status === 'in_progress';
            const isEmergency = Boolean(booking.isEmergency);

            return (
              <Card
                key={booking.id}
                className={`border transition-all ${
                  isInProgress
                    ? 'border-emerald-300 ring-1 ring-emerald-200/60 shadow-xs'
                    : 'border-slate-200'
                }`}
              >
                <CardHeader className="px-5 py-4 flex flex-row items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-700">
                      {booking.bookingNumber || `BKG #${booking.id}`}
                    </span>
                    {isEmergency && (
                      <Badge variant="danger" size="sm" dot>
                        Emergency Request
                      </Badge>
                    )}
                    <Badge
                      variant={isInProgress ? 'success' : 'primary'}
                      size="sm"
                    >
                      {isInProgress ? 'In Progress' : 'Confirmed'}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900">
                      ₹{booking.amount || 0}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-medium">Standard Fare</span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {booking.serviceName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Customer: <span className="font-semibold text-slate-800">{booking.customerName}</span>
                        {booking.customerPhone && (
                          <span className="text-slate-600 ml-1.5 font-normal">({booking.customerPhone})</span>
                        )}
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60 inline-flex items-center gap-1.5 self-start sm:self-auto">
                      <svg className="w-4 h-4 text-primary-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {booking.scheduledDate
                          ? new Date(booking.scheduledDate).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'Immediate'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium text-slate-700">{booking.address}</span>
                  </div>

                  {booking.notes && (
                    <div className="text-xs bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 text-amber-900">
                      <span className="font-bold">Customer Notes: </span>
                      {booking.notes}
                    </div>
                  )}

                  {/* Tools & Materials Section */}
                  <div className={`rounded-xl border p-3 ${
                    booking.toolsMaterialsRequired
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-base shrink-0">🛠️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900">
                          Tools &amp; Materials Required
                        </p>
                        <p className={`text-[11px] font-semibold mt-0.5 ${
                          booking.toolsMaterialsRequired ? 'text-amber-700' : 'text-slate-500'
                        }`}>
                          Status:{' '}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            booking.toolsMaterialsRequired
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {booking.toolsMaterialsRequired ? 'YES' : 'NO'}
                          </span>
                        </p>
                        {booking.toolsMaterialsRequired ? (
                          <p className="text-[11px] text-amber-700 mt-1 font-medium">
                            ⚠️ Bring the required tools/materials for this service.
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-500 mt-1">
                            Customer will provide the required tools/materials.
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Fare breakdown when T&M is ON */}
                    {booking.toolsMaterialsRequired && (
                      <div className="mt-2.5 pt-2.5 border-t border-amber-200 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-700">
                          <span>Base Fare</span>
                          <span className="font-semibold">₹{booking.amount}</span>
                        </div>
                        <div className="flex justify-between text-amber-700 font-semibold">
                          <span>🛠️ Tools &amp; Materials Charge</span>
                          <span>+₹{Math.round(booking.amount * 0.15)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-amber-200">
                          <span>Worker Payment</span>
                          <span>₹{booking.amount + Math.round(booking.amount * 0.15)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Payment Status: <span className="font-semibold text-slate-800 capitalize">{booking.paymentStatus || 'Pending'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isInProgress ? (
                      <Button
                        id={`btn-start-${booking.id}`}
                        variant="outline"
                        size="sm"
                        isLoading={processingId === booking.id && actionType === 'start'}
                        onClick={() => handleStartJob(booking.id)}
                        className="text-primary-700 border-primary-300 hover:bg-primary-50"
                      >
                        Start Work
                      </Button>
                    ) : (
                      <Button
                        id={`btn-complete-${booking.id}`}
                        variant="primary"
                        size="sm"
                        isLoading={processingId === booking.id && actionType === 'complete'}
                        onClick={() => handleCompleteJob(booking.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ── Completed & All Tab: Table View ── */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Booking #</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Tools &amp; Materials</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {b.bookingNumber || b.id}
                      {b.isEmergency && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          SOS
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {b.serviceName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {b.completedDate
                        ? new Date(b.completedDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : b.scheduledDate
                        ? new Date(b.scheduledDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{b.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.toolsMaterialsRequired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          🛠️ Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          b.status === 'completed'
                            ? 'success'
                            : b.status === 'in_progress'
                            ? 'primary'
                            : b.status === 'pending'
                            ? 'warning'
                            : b.status === 'cancelled'
                            ? 'danger'
                            : 'default'
                        }
                        size="sm"
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {b.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
