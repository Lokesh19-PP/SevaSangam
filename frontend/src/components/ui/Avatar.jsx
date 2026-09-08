/**
 * Avatar Component — SevaSangam
 * Displays user profile image or initials fallback.
 */
const Avatar = ({ src, alt = 'Avatar', name = '', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (str) => {
    if (!str) return '?';
    return str
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-700 font-semibold select-none ${sizes[size] || sizes.md} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name || alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
