/**
 * EmptyState Component — SevaSangam
 * Displays friendly placeholder message when no data is available.
 */
const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no records to display at this time.',
  icon = '📂',
  action = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-200">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
