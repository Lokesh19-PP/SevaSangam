import { Link } from 'react-router-dom';

/**
 * Footer Component — SevaSangam
 * Platform footer with links, copyright, and cooperative mission statement.
 */
const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">SevaSangam</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Trusted Services. Fair Opportunities. Stronger Communities.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/services" className="hover:text-slate-900">
              Services
            </Link>
            <Link to="/workers" className="hover:text-slate-900">
              Workers
            </Link>
            <Link to="/login" className="hover:text-slate-900">
              Login
            </Link>
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} SevaSangam Labour Cooperative Federation.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
