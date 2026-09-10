import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

/**
 * WorkerCard Component — SevaSangam
 * 
 * Displays verified Labour Cooperative Society worker information including:
 * photo placeholder / avatar, name, skill tags, rating, distance, cooperative,
 * hourly rate, and action buttons.
 * 
 * Reuses Janhvi's Card, Badge, and Button from components/ui.
 */
const WorkerCard = ({
  worker,
  onBook,
  onViewProfile,
  className = '',
  hover = true,
}) => {
  if (!worker) return null;

  const availabilityStatus =
    worker.availability === 'available'
      ? 'online'
      : worker.availability === 'busy'
      ? 'busy'
      : 'offline';

  const distanceText =
    worker.distance ||
    (worker.distanceKm !== undefined ? `${worker.distanceKm} km away` : null);

  return (
    <Card hover={hover} className={`flex flex-col justify-between ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Photo Placeholder / Avatar */}
          <Avatar
            src={worker.avatar}
            name={worker.name}
            size="lg"
            status={availabilityStatus}
            verified={worker.isVerified}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-semibold text-slate-900 truncate">
                {worker.name}
              </h4>
              {worker.isVerified && (
                <Badge variant="success" size="sm">
                  ✓ Verified
                </Badge>
              )}
            </div>

            {/* Cooperative Name */}
            {worker.cooperative && (
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {worker.cooperative}
              </p>
            )}

            {/* Rating and Distance */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                <span className="text-amber-500">★</span>
                <span>{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                {worker.reviewCount ? (
                  <span className="font-normal text-slate-400">({worker.reviewCount})</span>
                ) : null}
              </span>

              {distanceText && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <svg
                      className="w-3.5 h-3.5 text-primary-600 shrink-0"
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
                    <span>{distanceText}</span>
                  </span>
                </>
              )}

              {worker.hourlyRate && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-900">
                    ₹{worker.hourlyRate}
                    <span className="text-slate-400 font-normal">/hr</span>
                  </span>
                </>
              )}
            </div>

            {/* Emergency Available indicator */}
            {worker.emergencyAvailable && (
              <div className="mt-2">
                <Badge variant="danger" size="sm" dot>
                  On-Demand / Emergency Ready
                </Badge>
              </div>
            )}

            {/* Skill Tags */}
            {Array.isArray(worker.skills) && worker.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {worker.skills.slice(0, 4).map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant={skill === worker.primarySkill ? 'primary' : 'default'}
                    size="sm"
                  >
                    {skill}
                  </Badge>
                ))}
                {worker.skills.length > 4 && (
                  <Badge variant="default" size="sm">
                    +{worker.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Card Footer Actions */}
      <CardFooter className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">{worker.totalJobs || 0}</span> jobs completed
        </div>

        <div className="flex items-center gap-2">
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(worker)}
            >
              Profile
            </Button>
          )}
          {onBook && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBook(worker)}
            >
              Book Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default WorkerCard;
