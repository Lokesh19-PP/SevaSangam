import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookings } from '../../mock/data/bookings';
import { payments } from '../../mock/data/payments';
import { invoices } from '../../mock/data/invoices';
import { Button, Card, Badge, Modal } from '../../components/ui';

/**
 * BookingHistory Component — SevaSangam
 * Customer's complete booking history with status tracking, payment receipts,
 * and cooperative invoices. 100% of fare displayed goes to the worker.
 */
const BookingHistory = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Bookings belonging to this customer (mock: cust_001)
  const myBookings = bookings.filter((b) => b.customerId === 'cust_001');

  const filterOptions = [
    { label: 'All Bookings', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const filtered =
    activeFilter === 'all'
      ? myBookings
      : myBookings.filter((b) => b.status === activeFilter);

  const getStatusBadge = (status) => {
    const map = {
      upcoming: <Badge variant="accent" size="sm" dot>Upcoming</Badge>,
      in_progress: <Badge variant="secondary" size="sm" dot>In Progress</Badge>,
      completed: <Badge variant="success" size="sm" dot>Completed</Badge>,
      cancelled: <Badge variant="danger" size="sm" dot>Cancelled</Badge>,
    };
    return map[status] || <Badge variant="default" size="sm">{status}</Badge>;
  };

  const getPayment = (bookingId) => payments.find((p) => p.bookingId === bookingId);
  const getInvoice = (bookingId) => invoices.find((inv) => inv.bookingId === bookingId);

  const selectedPayment = selectedBooking ? getPayment(selectedBooking.id) : null;
  const selectedInvoice = selectedBooking ? getInvoice(selectedBooking.id) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {myBookings.length} total • {myBookings.filter((b) => b.status === 'upcoming' || b.status === 'in_progress').length} active
          </p>
        </div>
        <Link to="/customer/book">
          <Button
            variant="primary"
            size="md"
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Book New Service
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setActiveFilter(opt.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === opt.value
                ? 'bg-primary-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {opt.label}
            {opt.value !== 'all' && (
              <span className="ml-1.5 opacity-70">
                ({myBookings.filter((b) => b.status === opt.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-slate-800">No {activeFilter !== 'all' ? activeFilter : ''} bookings</h4>
          <p className="text-sm text-slate-500 mt-1">Browse cooperative services and schedule your first booking.</p>
          <div className="mt-5">
            <Link to="/customer/services">
              <Button variant="primary" size="md">Browse Services</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const payment = getPayment(booking.id);
            return (
              <Card key={booking.id} className="p-0 overflow-hidden border border-slate-200/80 hover:border-slate-300 transition-colors">
                {/* Emergency strip */}
                {booking.isEmergency && (
                  <div className="bg-rose-600 text-white text-xs font-bold px-4 py-1 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Emergency Service Request
                  </div>
                )}

                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      {/* Service & Booking Number */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{booking.serviceName}</h3>
                        {getStatusBadge(booking.status)}
                      </div>

                      <p className="text-[11px] text-slate-400 font-mono">{booking.bookingNumber}</p>

                      {/* Meta Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Worker: <strong className="ml-0.5 text-slate-800">{booking.workerName}</strong>
                        </span>

                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>

                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {booking.address.split(',')[0]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 pt-0.5 italic">"{booking.notes}"</p>
                    </div>

                    {/* Amount + Actions */}
                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Paid to Worker</span>
                        <p className="text-xl font-extrabold text-slate-900">₹{booking.amount.toLocaleString('en-IN')}</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">✓ 100% goes to {booking.workerName}</p>
                        <Badge
                          variant={payment?.status === 'paid' ? 'success' : payment?.status === 'refunded' ? 'danger' : 'warning'}
                          size="sm"
                          className="mt-1"
                        >
                          {payment?.status || 'pending'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowInvoice(false);
                          }}
                        >
                          View Details
                        </Button>
                        {(booking.status === 'completed' || booking.status === 'cancelled') && getInvoice(booking.id) && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowInvoice(true);
                            }}
                          >
                            Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Detail / Invoice Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => { setSelectedBooking(null); setShowInvoice(false); }}
          title={showInvoice ? `Invoice — ${selectedBooking.bookingNumber}` : `Booking Details`}
          subtitle={showInvoice ? null : `${selectedBooking.bookingNumber}`}
          size="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedBooking(null); setShowInvoice(false); }}>
                Close
              </Button>
              {!showInvoice && selectedInvoice && (
                <Button variant="primary" size="sm" onClick={() => setShowInvoice(true)}>
                  View Invoice
                </Button>
              )}
            </div>
          }
        >
          {!showInvoice ? (
            /* Booking Details view */
            <div className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-slate-400 font-semibold uppercase">Service</span><p className="font-semibold text-slate-900 mt-0.5">{selectedBooking.serviceName}</p></div>
                <div><span className="text-xs text-slate-400 font-semibold uppercase">Status</span><div className="mt-0.5">{getStatusBadge(selectedBooking.status)}</div></div>
                <div><span className="text-xs text-slate-400 font-semibold uppercase">Worker</span><p className="font-semibold text-slate-900 mt-0.5">{selectedBooking.workerName}</p></div>
                <div><span className="text-xs text-slate-400 font-semibold uppercase">Scheduled</span><p className="font-semibold text-slate-900 mt-0.5">{new Date(selectedBooking.scheduledDate).toLocaleString('en-IN')}</p></div>
                <div className="col-span-2"><span className="text-xs text-slate-400 font-semibold uppercase">Address</span><p className="font-semibold text-slate-900 mt-0.5">{selectedBooking.address}</p></div>
                <div className="col-span-2"><span className="text-xs text-slate-400 font-semibold uppercase">Notes</span><p className="font-semibold text-slate-900 mt-0.5">{selectedBooking.notes}</p></div>
              </div>

              {/* Payment summary */}
              {selectedPayment && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Payment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span>Service Total</span>
                      <span className="font-semibold">₹{selectedBooking.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Platform Commission
                      </span>
                      <span className="font-bold text-emerald-700">₹0 (Zero — Cooperative Model)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Payment Method</span>
                      <span className="font-semibold capitalize">{selectedPayment.method.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-100">
                      <span>Amount Paid to Worker</span>
                      <span>₹{selectedBooking.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-3 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    100% of your payment goes directly into the worker's hands. Zero deductions.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Invoice view */
            selectedInvoice && (
              <div className="space-y-5 text-sm">
                {/* Invoice Header */}
                <div className="flex items-start justify-between p-4 bg-primary-700 text-white rounded-xl">
                  <div>
                    <h3 className="font-bold text-lg">SevaSangam</h3>
                    <p className="text-primary-200 text-xs mt-0.5">Cooperative Service Network</p>
                    <p className="text-primary-300 text-[11px] mt-2">GSTIN: {selectedInvoice.cooperativeGstin}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" size="sm">Tax Invoice</Badge>
                    <p className="text-xs font-mono mt-2 text-primary-100">{selectedInvoice.invoiceNumber}</p>
                    <p className="text-[11px] text-primary-300 mt-1">
                      {new Date(selectedInvoice.issuedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-[10px] text-slate-400 uppercase mb-1.5">Billed To</p>
                    <p className="font-bold text-slate-900">{selectedInvoice.customerName}</p>
                    <p className="text-slate-600">{selectedBooking.address.split(',').slice(0, 2).join(',')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-[10px] text-slate-400 uppercase mb-1.5">Service By</p>
                    <p className="font-bold text-slate-900">{selectedInvoice.workerName}</p>
                    <p className="text-slate-600">{selectedBooking.serviceName}</p>
                    <p className="text-primary-700 font-semibold mt-0.5">Cooperative Registered Worker</p>
                  </div>
                </div>

                {/* Invoice Line Items */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-bold text-slate-700 uppercase text-[10px] tracking-wider">Description</th>
                        <th className="text-right px-4 py-2.5 font-bold text-slate-700 uppercase text-[10px] tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 text-slate-700">{selectedInvoice.serviceTitle}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="text-slate-500">
                        <td className="px-4 py-2">CGST @ 9%</td>
                        <td className="px-4 py-2 text-right">₹{selectedInvoice.cgst.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="text-slate-500">
                        <td className="px-4 py-2">SGST @ 9%</td>
                        <td className="px-4 py-2 text-right">₹{selectedInvoice.sgst.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-primary-50 border-t-2 border-primary-200">
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-900">Total (incl. GST)</td>
                        <td className="px-4 py-3 text-right font-extrabold text-primary-800 text-base">
                          ₹{selectedInvoice.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Zero commission declaration */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    <strong>Cooperative Transparency Declaration:</strong> ₹{selectedInvoice.subtotal.toLocaleString('en-IN')} (service total, excluding government GST) goes <strong>100% directly to worker {selectedInvoice.workerName}</strong>. No platform commission. No cooperative admin deduction. Worker welfare is funded through the PMSBY scheme, not from your service fee.
                  </span>
                </div>
              </div>
            )
          )}
        </Modal>
      )}
    </div>
  );
};

export default BookingHistory;
