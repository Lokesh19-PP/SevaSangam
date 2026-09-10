/**
 * Loading Component — SevaSangam
 * Spinner and skeleton indicator for async operations with theme colors.
 */
const Loading = ({
  message = 'Loading...',
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <div
        className={`
          rounded-full animate-spin
          border-primary-200 border-t-primary-700
          ${sizes[size] || sizes.md}
        `}
      />
      {message && (
        <p className="text-sm font-medium text-slate-600 tracking-wide">{message}</p>
      )}
    </div>
  );

  const skeleton = (
    <div className={`space-y-3 w-full animate-pulse p-4 ${className}`}>
      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
      <div className="h-4 bg-slate-200 rounded-md w-full" />
      <div className="h-4 bg-slate-200 rounded-md w-5/6" />
    </div>
  );

  const content = variant === 'skeleton' ? skeleton : spinner;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
