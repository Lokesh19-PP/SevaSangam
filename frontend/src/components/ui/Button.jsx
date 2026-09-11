/**
 * Neo-Brutalist Button Component — SevaSangam
 * Bold borders, high tactile spring animations, hard box-shadows, and punchy colorways.
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
    'inline-flex items-center justify-center font-bold tracking-tight rounded-xl border-2 border-black select-none cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

  const variants = {
    // Primary: Neo Teal
    primary:
      'bg-teal-500 text-white shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-teal-600',
    // Secondary: Electric Neo Yellow (Signature punch)
    secondary:
      'bg-yellow-400 text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-yellow-300',
    // Orange / Saffron Energy
    orange:
      'bg-orange-500 text-white shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-orange-600',
    // Accent / Electric Sky
    accent:
      'bg-cyan-400 text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-cyan-300',
    // Vivid Pink
    pink:
      'bg-rose-400 text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-rose-300',
    // Electric Purple
    purple:
      'bg-purple-500 text-white shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-purple-600',
    // Outline White
    outline:
      'bg-white text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-slate-50',
    'outline-primary':
      'bg-teal-50 text-teal-950 shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-teal-100',
    // Ghost
    ghost:
      'border-transparent shadow-none hover:border-black hover:shadow-neo-sm hover:bg-yellow-50 text-black',
    // Success State
    success:
      'bg-lime-400 text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-lime-300',
    // Destructive Actions
    danger:
      'bg-rose-500 text-white shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-rose-600',
  };

  const sizes = {
    xs: 'px-3 py-1 text-xs gap-1.5 rounded-lg border-[1.5px]',
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3 rounded-2xl border-[3px]',
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
