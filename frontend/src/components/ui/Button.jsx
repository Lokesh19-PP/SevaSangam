/**
 * Button Component — SevaSangam
 * Reusable UI button built on the "Trust + Service + Technology + Community" theme.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    // Primary: Deep Teal (Trust & Cooperation)
    primary:
      'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 focus:ring-primary-500 shadow-xs hover:shadow-sm',
    // Secondary: Warm Saffron/Amber (Service & Energy)
    secondary:
      'bg-secondary-500 text-slate-950 font-semibold hover:bg-secondary-600 active:bg-secondary-700 focus:ring-secondary-400 shadow-xs hover:shadow-sm',
    // Accent: Soft Blue (Actions & Highlights)
    accent:
      'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 focus:ring-accent-400 shadow-xs hover:shadow-sm',
    // Subtle Teal Outline
    'outline-primary':
      'border border-primary-700 text-primary-700 bg-white hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
    // Neutral Outline
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus:ring-primary-500',
    // Ghost / Plain
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400',
    // Success State
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 shadow-xs',
    // Destructive Actions
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-xs',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    xl: 'px-6 py-3 text-lg gap-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
