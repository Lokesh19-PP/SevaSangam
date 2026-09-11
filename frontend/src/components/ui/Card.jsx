/**
 * Neo-Brutalist Card Component — SevaSangam
 * Bold black borders, crisp offset drop shadow, and punchy section headers.
 */
export const Card = ({
  children,
  className = '',
  hover = false,
  bordered = true,
  bg = 'bg-white',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${bg} rounded-2xl overflow-hidden transition-all duration-200
        ${bordered ? 'border-2 border-black' : ''}
        ${
          hover
            ? 'shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg cursor-pointer'
            : 'shadow-neo'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', bg = 'bg-slate-50/50', ...props }) => (
  <div className={`px-6 py-4 border-b-2 border-black ${bg} ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-bold text-black tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs font-medium text-slate-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', bg = 'bg-amber-50/40', ...props }) => (
  <div
    className={`px-6 py-4 border-t-2 border-black flex items-center justify-between ${bg} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
