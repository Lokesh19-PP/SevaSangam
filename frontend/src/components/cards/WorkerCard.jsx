import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

/**
 * Neo-Brutalist WorkerCard Component — SevaSangam
 * Displays verified Labour Cooperative Society worker information with high contrast.
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
    <Card hover={hover} className={`flex flex-col justify-between bg-white border-2 border-black shadow-neo ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar with hard border */}
          <div className="relative shrink-0">
            <Avatar
              src={worker.avatar}
              name={worker.name}
              size="lg"
              status={availabilityStatus}
              verified={worker.isVerified}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-extrabold text-black truncate font-display">
                {worker.name}
              </h4>
              {worker.isVerified && (
                <Badge variant="success" size="sm" shadow>
                  ✓ Verified
                </Badge>
              )}
            </div>

            {/* Cooperative Name */}
            {worker.cooperative && (
              <p className="text-xs text-slate-700 font-bold truncate mt-0.5">
                🏛️ {worker.cooperative}
              </p>
            )}

            {/* Rating and Distance */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 font-extrabold bg-yellow-300 border border-black px-2 py-0.5 rounded-md shadow-neo-xs text-black">
                <span>★</span>
                <span>{worker.rating ? worker.rating.toFixed(1) : '5.0'}</span>
                {worker.reviewCount ? (
                  <span className="font-semibold text-slate-800">({worker.reviewCount})</span>
                ) : null}
              </span>

              {distanceText && (
                <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 border border-black px-2 py-0.5 rounded-md">
                  📍 {distanceText}
                </span>
              )}

              {worker.hourlyRate && (
                <span className="font-extrabold bg-teal-100 text-teal-950 border border-black px-2 py-0.5 rounded-md">
                  ₹{worker.hourlyRate}<span className="text-slate-600 font-normal">/hr</span>
                </span>
              )}
            </div>

            {/* Emergency Available indicator */}
            {worker.emergencyAvailable && (
              <div className="mt-2.5">
                <Badge variant="danger" size="sm" dot shadow>
                  ⚡ Emergency Dispatch Ready
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
                  <Badge variant="secondary" size="sm">
                    +{worker.skills.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Card Footer Actions */}
      <CardFooter className="px-5 py-3.5 bg-yellow-50/60 border-t-2 border-black flex items-center justify-between">
        <div className="text-xs font-bold text-slate-800">
          <span className="text-black font-extrabold">{worker.totalJobs || 0}</span> jobs done
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
              variant="secondary"
              size="sm"
              onClick={() => onBook(worker)}
            >
              Book Now ⚡
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default WorkerCard;
