import Button from '../ui/Button';

/**
 * ServiceCard Component — SevaSangam
 * Displays service information with category and booking button.
 */
const ServiceCard = ({ service, onSelect }) => {
  if (!service) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg mb-3">
          {service.name?.charAt(0)}
        </div>
        <h4 className="text-base font-semibold text-slate-900">{service.name}</h4>
        <span className="inline-block text-xs font-medium text-sky-600 mb-2">
          {service.category}
        </span>
        <p className="text-xs text-slate-500 line-clamp-2">{service.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Cooperative Verified</span>
        <Button variant="outline" size="sm" onClick={() => onSelect?.(service)}>
          Select Service
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
