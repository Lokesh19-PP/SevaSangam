/**
 * Card Component — SevaSangam
 * Surface container with shadow and optional header/footer.
 */
const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
