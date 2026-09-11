import { Link } from 'react-router-dom';

/**
 * Neo-Brutalist Footer Component — SevaSangam
 * Bold border, high contrast yellow band, and punchy cooperative mission badges.
 */
const Footer = () => {
  return (
    <footer className="w-full bg-yellow-300 border-t-3 border-black mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-black text-yellow-300 flex items-center justify-center font-extrabold text-lg">
                ⚡
              </div>
              <span className="text-xl font-extrabold text-black tracking-tight font-display">
                SevaSangam
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 max-w-md">
              Democratizing the digital gig economy through worker-owned Labour Cooperative Federations. 
              Fair wages, verified skills, and collective social security.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-extrabold bg-white text-black px-2.5 py-1 rounded-md border-2 border-black shadow-neo-xs">
                🏛️ Ministry of Cooperation
              </span>
              <span className="text-xs font-extrabold bg-teal-300 text-black px-2.5 py-1 rounded-md border-2 border-black shadow-neo-xs">
                🛡️ NSDC Certified
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-black text-sm uppercase tracking-wider mb-3">
              Platform
            </h4>
            <div className="flex flex-col gap-2 text-sm font-bold text-slate-900">
              <Link to="/services" className="hover:underline">
                Explore Services
              </Link>
              <Link to="/workers" className="hover:underline">
                Find Workers
              </Link>
              <Link to="/register" className="hover:underline">
                Join Cooperative
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-black text-sm uppercase tracking-wider mb-3">
              Portals
            </h4>
            <div className="flex flex-col gap-2 text-sm font-bold text-slate-900">
              <Link to="/login" className="hover:underline">
                Customer Login
              </Link>
              <Link to="/login" className="hover:underline">
                Worker Dashboard
              </Link>
              <Link to="/login" className="hover:underline">
                Admin & Federation
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-extrabold text-slate-900">
          <div>
            © {new Date().getFullYear()} SevaSangam Cooperative Federation. Built for Smart India Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span>Fair Work Policy</span>
            <span>•</span>
            <span>Privacy</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
