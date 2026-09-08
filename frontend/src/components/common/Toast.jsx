/**
 * Toast Component — SevaSangam
 * Alert toast notification banner.
 */
const Toast = ({ message, type = 'info', onClose }) => {
  const typeStyles = {
    info: 'bg-slate-900 text-white',
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-600 text-white',
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${typeStyles[type] || typeStyles.info}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
