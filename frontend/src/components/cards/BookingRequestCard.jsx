import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * BookingRequestCard Component — SevaSangam
 * 
 * Displays incoming service / job request for worker dashboard with:
 * customer details, service type, schedule, location, fair payout amount,
 * emergency flag, and Accept / Reject action buttons.
 * 
 * Reuses Janhvi's Card, Badge, and Button from components/ui.
 */
const BookingRequestCard = ({
  booking,
  onAccept,
  onReject,
  onViewDetails,
  isAccepting = false,
  isRejecting = false,
  className = '',
}) => {
  if (!booking) return null;

  const isEmergency = Boolean(booking.isEmergency);

  const formattedDate = booking.scheduledDate
    ? new Date(booking.scheduledDate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Immediate / As soon as possible';

  return (
    <Card
      className={`border transition-all ${
        isEmergency
          ? 'border-rose-300 ring-1 ring-rose-200/60 shadow-sm'
          : 'border-slate-200/90 hover:border-slate-300'
      } ${className}`}
    >
      <CardHeader className="px-5 py-4 flex flex-row items-center justify-between gap-3 bg-slate-50/40">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {booking.bookingNumber || `REQ #${booking.id}`}
          </span>
          {isEmergency && (
            <Badge variant="danger" size="sm" dot className="animate-pulse">
              Emergency Request
            </Badge>
          )}
          {booking.status && (
            <Badge
              variant={
                booking.status === 'upcoming' || booking.status === 'in_progress'
                  ? 'success'
                  : booking.status === 'pending'
                  ? 'warning'
                  : 'default'
              }
              size="sm"
            >
              {booking.status}
            </Badge>
          )}
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-slate-900">
            ₹{booking.amount || 0}
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Standard Fare</p>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3.5">
        {/* Service Title */}
        <div>
          <h4 className="text-base font-semibold text-slate-900 leading-snug">
            {booking.serviceName || 'Cooperative Service Request'}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer: <span className="font-medium text-slate-800">{booking.customerName || 'Customer'}</span>
            {booking.customerPhone && (
              <span className="text-slate-400 ml-1.5 font-normal">({booking.customerPhone})</span>
            )}
          </p>
        </div>

        {/* Schedule & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-primary-700 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <span className="text-slate-400 block text-[11px]">Schedule</span>
              <span className="font-medium text-slate-800">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-primary-700 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="min-w-0">
              <span className="text-slate-400 block text-[11px]">Service Location</span>
              <span className="font-medium text-slate-800 line-clamp-1">
                {booking.address || 'Address provided upon acceptance'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Notes */}
        {booking.notes && (
          <div className="text-xs bg-amber-50/60 border border-amber-200/60 rounded-md p-2.5 text-amber-900">
            <span className="font-semibold text-amber-950">Job Notes: </span>
            {booking.notes}
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(booking)}
              className="text-xs"
            >
              Details
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onReject && (
            <Button
              variant="outline"
              size="sm"
              isLoading={isRejecting}
              disabled={isAccepting || isRejecting}
              onClick={() => onReject(booking)}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 active:bg-rose-100"
            >
              Reject
            </Button>
          )}
          {onAccept && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isAccepting}
              disabled={isAccepting || isRejecting}
              onClick={() => onAccept(booking)}
            >
              Accept Job
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookingRequestCard;
