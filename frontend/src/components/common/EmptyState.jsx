/**
 * EmptyState Component — SevaSangam
 * Displays cooperative marketplace placeholder message when records or lists are empty.
 */
const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no records to display at this time.',
  icon = null,
  action = null,
  className = '',
}) => {
  const defaultIcon = (
    <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100 shadow-2xs">
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
  );

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-8 sm:p-12 text-center
        bg-white rounded-2xl border border-slate-200/80 shadow-xs
        ${className}
      `}
    >
      <div className="mb-4">
        {icon ? (
          typeof icon === 'string' ? (
            <span className="text-4xl select-none">{icon}</span>
          ) : (
            icon
          )
        ) : (
          defaultIcon
        )}
      </div>

      <h4 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
