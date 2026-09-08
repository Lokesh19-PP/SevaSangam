import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * BookingCard Component — SevaSangam
 * Displays booking summary, status, and tracking actions.
 */
const BookingCard = ({ booking, onCancel, onViewDetails }) => {
  if (!booking) return null;

  const statusVariants = {
    pending: 'warning',
    upcoming: 'info',
    completed: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Booking #{booking.id}
          </span>
          <h4 className="text-base font-semibold text-slate-900 mt-0.5">
            {booking.notes || 'Service Appointment'}
          </h4>
        </div>
        <Badge variant={statusVariants[booking.status] || 'default'}>
          {booking.status}
        </Badge>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-600">
        <p>
          <span className="text-slate-400">Scheduled:</span>{' '}
          {new Date(booking.scheduledDate).toLocaleString()}
        </p>
        <p>
          <span className="text-slate-400">Location:</span> {booking.address}
        </p>
        <p className="font-semibold text-slate-900 pt-1">
          Amount: ₹{booking.amount}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
        {onCancel && booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>
            Cancel
          </Button>
        )}
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={() => onViewDetails(booking)}>
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
