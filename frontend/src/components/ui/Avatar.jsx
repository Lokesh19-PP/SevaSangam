/**
 * Avatar Component — SevaSangam
 * Displays worker or customer profile photo, initials fallback, and status dot.
 */
const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  status = null,
  verified = false,
  className = '',
}) => {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizes = {
    xs: 'w-2 h-2 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-slate-400',
    away: 'bg-rose-500',
  };

  const getInitials = (str) => {
    if (!str) return 'SS';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`
          flex items-center justify-center overflow-hidden rounded-full font-semibold select-none
          bg-gradient-to-br from-primary-700 to-primary-900 text-white shadow-2xs
          ${sizes[size] || sizes.md}
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name || alt)}</span>
        )}
      </div>

      {status && statusColors[status] && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full ring-white
            ${statusColors[status]}
            ${statusSizes[size] || statusSizes.md}
          `}
        />
      )}

      {verified && (
        <span
          title="Cooperative Verified Worker"
          className="absolute -top-1 -right-1 bg-secondary-500 text-slate-950 rounded-full p-0.5 ring-2 ring-white shadow-xs"
        >
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default Avatar;
