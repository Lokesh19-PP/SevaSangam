/**
 * Neo-Brutalist Input Component — SevaSangam
 * Bold black borders, tactile focus lift, and high readability.
 */
const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  disabled = false,
  required = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold text-black mb-1.5"
        >
          {label} {required && <span className="text-rose-600 font-extrabold">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl border-2 text-sm font-medium transition-all duration-150
            focus:outline-none focus:shadow-neo focus:-translate-x-0.5 focus:-translate-y-0.5
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon ? 'pr-11' : 'pr-4'}
            py-3 bg-white text-black
            ${
              error
                ? 'border-rose-600 bg-rose-50/40 focus:border-rose-600 text-rose-950 shadow-neo-xs'
                : 'border-black hover:border-black focus:border-black shadow-neo-sm'
            }
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-700">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs font-medium text-slate-600">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
