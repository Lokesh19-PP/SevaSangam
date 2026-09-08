import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

/**
 * WorkerCard Component — SevaSangam
 * Displays worker details, rating, cooperative, and action button.
 */
const WorkerCard = ({ worker, onBook, onViewProfile }) => {
  if (!worker) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar name={worker.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-slate-900 truncate">{worker.name}</h4>
            {worker.isVerified && (
              <Badge variant="success" size="sm">
                ✓ Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{worker.cooperative}</p>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span>⭐ {worker.rating || 'N/A'}</span>
            <span>•</span>
            <span>{worker.totalJobs || 0} jobs</span>
            <span>•</span>
            <span className="font-medium text-slate-900">₹{worker.hourlyRate}/hr</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {worker.skills?.map((skill, index) => (
              <Badge key={index} variant="default" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
        {onViewProfile && (
          <Button variant="ghost" size="sm" onClick={() => onViewProfile(worker)}>
            View Profile
          </Button>
        )}
        {onBook && (
          <Button variant="primary" size="sm" onClick={() => onBook(worker)}>
            Book Worker
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;
