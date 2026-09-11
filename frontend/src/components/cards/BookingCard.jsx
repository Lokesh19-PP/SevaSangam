import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Neo-Brutalist BookingCard Component — SevaSangam
 * Displays booking summary, lifecycle status, scheduled time, and tracking actions.
 */
const BookingCard = ({ booking, onCancel, onViewDetails }) => {
  if (!booking) return null;

  const statusVariants = {
    pending: 'warning',
    assigned: 'accent',
    in_progress: 'primary',
    upcoming: 'accent',
    completed: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold bg-slate-100 border border-black px-2 py-0.5 rounded text-black uppercase tracking-wider">
            Ref #{booking.bookingReference || booking.id}
          </span>
          <h4 className="text-base font-extrabold text-black mt-2 font-display">
            {booking.serviceName || booking.notes || booking.description || 'Cooperative Service Appointment'}
          </h4>
        </div>
        <Badge variant={statusVariants[booking.status] || 'default'} size="sm" shadow dot>
          {booking.status}
        </Badge>
      </div>

      <div className="mt-3.5 space-y-1.5 text-xs font-semibold text-slate-800 bg-amber-50/40 p-3 rounded-xl border border-black/30">
        <p className="flex items-center gap-1.5">
          <span className="text-slate-600">📅 Scheduled:</span>{' '}
          <span className="font-extrabold text-black">
            {booking.scheduledAt || booking.scheduledDate ? new Date(booking.scheduledAt || booking.scheduledDate).toLocaleString() : 'Immediate Dispatch'}
          </span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="text-slate-600">📍 Address:</span>{' '}
          <span className="font-bold text-black truncate max-w-[280px]">
            {booking.serviceAddress || booking.address || 'Customer Location'}
          </span>
        </p>
        <p className="font-extrabold text-teal-950 pt-1 flex items-center justify-between border-t border-black/20 mt-1.5">
          <span>Total Fare:</span>
          <span className="text-sm bg-teal-300 text-teal-950 px-2 py-0.5 rounded border border-black font-extrabold">
            ₹{booking.totalAmount || booking.amount || 0}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t-2 border-black">
        {onCancel && booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>
            Cancel
          </Button>
        )}
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={() => onViewDetails(booking)}>
            Details ⚡
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
