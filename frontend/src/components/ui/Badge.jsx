/**
 * Badge Component — SevaSangam
 * Status indicator and tag badge with theme color tokens.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    // Primary: Deep Teal (Trust & Cooperative verified status)
    primary: 'bg-primary-50 text-primary-800 border-primary-200/70',
    // Secondary: Warm Saffron/Amber (Service/Pending/Star status)
    secondary: 'bg-secondary-50 text-secondary-900 border-secondary-200/70',
    // Accent: Soft Blue (Active links, notifications)
    accent: 'bg-accent-50 text-accent-800 border-accent-200/70',
    // Success / Completed
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
    // Warning / High Workload
    warning: 'bg-amber-50 text-amber-800 border-amber-200/70',
    // Danger / Emergency / Rejected
    danger: 'bg-rose-50 text-rose-800 border-rose-200/70',
    // Default Neutral
    default: 'bg-slate-100 text-slate-700 border-slate-200/80',
  };

  const dotColors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    default: 'bg-slate-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || dotColors.default}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
