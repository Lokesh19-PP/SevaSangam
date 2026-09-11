import { useEffect } from 'react';

/**
 * Neo-Brutalist Modal Component — SevaSangam
 * Bold black borders, hard offset drop shadows, and high contrast.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Dialog Window */}
      <div
        className={`
          relative w-full bg-white rounded-2xl shadow-neo-2xl border-3 border-black overflow-hidden
          transition-all duration-200 z-10 animate-in fade-in zoom-in-95
          ${sizes[size] || sizes.md}
        `}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between px-6 py-4 border-b-2 border-black bg-yellow-300">
          <div>
            <h3 className="text-lg font-extrabold text-black tracking-tight">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-xs font-semibold text-slate-800">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg bg-white border-2 border-black shadow-neo-xs flex items-center justify-center text-black font-bold hover:bg-rose-400 hover:text-white transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-6 max-h-[72vh] overflow-y-auto">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t-2 border-black">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
