import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * Neo-Brutalist ServiceCard Component — SevaSangam
 * Displays service catalog item with category badge, base rate, and select action.
 */
const ServiceCard = ({ service, onSelect }) => {
  if (!service) return null;

  const getCategoryColor = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('electric')) return 'bg-yellow-300';
    if (c.includes('plumb')) return 'bg-cyan-300';
    if (c.includes('clean')) return 'bg-lime-300';
    if (c.includes('carpent')) return 'bg-orange-300';
    if (c.includes('appliance') || c.includes('ac')) return 'bg-teal-300';
    return 'bg-purple-300';
  };

  const catColor = getCategoryColor(service.category || service.name);

  return (
    <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`w-12 h-12 rounded-xl ${catColor} border-2 border-black shadow-neo-xs flex items-center justify-center font-extrabold text-xl text-black`}>
            {service.icon || service.name?.charAt(0) || '⚡'}
          </div>
          {service.category && (
            <Badge variant="secondary" size="sm" shadow>
              {service.category}
            </Badge>
          )}
        </div>

        <h4 className="text-lg font-extrabold text-black tracking-tight font-display mb-1 group-hover:text-teal-700 transition-colors">
          {service.name}
        </h4>
        <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed mb-3">
          {service.description}
        </p>

        {service.basePrice && (
          <div className="inline-block bg-teal-50 border border-black px-2.5 py-1 rounded-md text-xs font-extrabold text-teal-950 mb-2">
            Starting from ₹{service.basePrice}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
          ✓ Verified Standards
        </span>
        <Button variant="secondary" size="sm" onClick={() => onSelect?.(service)}>
          Select ⚡
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
