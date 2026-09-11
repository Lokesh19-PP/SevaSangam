/**
 * Neo-Brutalist Badge Component — SevaSangam
 * High contrast status pills with solid black borders and vibrant fills.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  shadow = false,
  className = '',
}) => {
  const variants = {
    // Primary: Neo Teal
    primary: 'bg-teal-300 text-teal-950 border-black',
    // Secondary: Electric Yellow
    secondary: 'bg-yellow-300 text-black border-black',
    // Accent / Cyan
    accent: 'bg-cyan-300 text-cyan-950 border-black',
    // Saffron / Orange
    orange: 'bg-orange-300 text-orange-950 border-black',
    // Success / Lime
    success: 'bg-lime-300 text-lime-950 border-black',
    // Warning / Amber
    warning: 'bg-amber-300 text-amber-950 border-black',
    // Danger / Emergency / Pink
    danger: 'bg-rose-400 text-white border-black',
    // Purple
    purple: 'bg-purple-300 text-purple-950 border-black',
    // Default Clean White
    default: 'bg-white text-black border-black',
  };

  const dotColors = {
    primary: 'bg-teal-900',
    secondary: 'bg-black',
    accent: 'bg-cyan-900',
    orange: 'bg-orange-900',
    success: 'bg-lime-900',
    warning: 'bg-amber-900',
    danger: 'bg-white',
    purple: 'bg-purple-900',
    default: 'bg-black',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-bold',
    md: 'px-3 py-1 text-xs font-bold',
    lg: 'px-4 py-1.5 text-sm font-extrabold',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 tracking-tight rounded-full border-2
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${shadow ? 'shadow-neo-xs' : ''}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-2 h-2 rounded-full border border-black shrink-0 ${dotColors[variant] || dotColors.default}`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
