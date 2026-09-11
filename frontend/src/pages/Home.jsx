import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * Neo-Brutalist Home Landing Page — SevaSangam
 * "Trusted Services. Fair Opportunities. Stronger Communities."
 */
const Home = () => {
  const serviceCategories = [
    { name: 'Electrical & Wiring', icon: '⚡', color: 'bg-yellow-300', count: '142 Workers', desc: 'Wiring, MCB setup, switchboards & appliance fitting' },
    { name: 'Plumbing & Sanitary', icon: '🔧', color: 'bg-cyan-300', count: '98 Workers', desc: 'Leak detection, pipe repairs, taps & geyser installation' },
    { name: 'Carpentry & Woodwork', icon: '🪚', color: 'bg-orange-300', count: '76 Workers', desc: 'Furniture repairs, custom cabinetry, doors & locks' },
    { name: 'Deep Home Cleaning', icon: '✨', color: 'bg-lime-300', count: '115 Workers', desc: 'Sanitization, bathroom deep scrub & sofa shampooing' },
    { name: 'AC & Appliance Repair', icon: '❄️', color: 'bg-teal-300', count: '89 Workers', desc: 'AC gas recharge, servicing, fridge & washing machines' },
    { name: 'Painting & Seepage', icon: '🎨', color: 'bg-purple-300', count: '64 Workers', desc: 'Interior & exterior painting, texture & waterproofing' },
  ];

  const stats = [
    { label: 'Verified Workers', value: '4,850+', bg: 'bg-yellow-300', icon: '👷' },
    { label: 'Labour Cooperatives', value: '38', bg: 'bg-teal-300', icon: '🏛️' },
    { label: 'Completed Jobs', value: '62,400+', bg: 'bg-cyan-300', icon: '⚡' },
    { label: 'Fair Wage Index', value: '100%', bg: 'bg-lime-300', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24 border-b-3 border-black bg-neo-dots overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-full shadow-neo-sm mb-6 font-extrabold text-xs uppercase tracking-wider">
            <span>⚡ India's 1st Cooperative-Owned Gig Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-black tracking-tight max-w-5xl mx-auto leading-tight md:leading-[1.1] font-display">
            Dignity of Labor.{' '}
            <span className="inline-block bg-teal-400 border-3 border-black px-3 py-0.5 rounded-2xl shadow-neo transform -rotate-1 text-black">
              Fair Earnings.
            </span>{' '}
            <span className="inline-block bg-orange-400 border-3 border-black px-3 py-0.5 rounded-2xl shadow-neo transform rotate-1 text-black mt-2 sm:mt-0">
              Zero Exploitation.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-base sm:text-lg md:text-xl font-bold text-slate-800 max-w-3xl mx-auto leading-relaxed">
            SevaSangam connects households and businesses directly with certified, insured trade workers 
            from registered Labour Cooperative Federations. Powered by AI for equitable job distribution.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/services">
              <Button variant="secondary" size="xl" className="font-extrabold">
                Explore Services ⚡
              </Button>
            </Link>
            <Link to="/workers">
              <Button variant="outline" size="xl" className="font-extrabold">
                Find Workers 📍
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="xl" className="font-extrabold">
                Join Cooperative 🏛️
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-extrabold">
            <span className="bg-white border-2 border-black px-3 py-1.5 rounded-xl shadow-neo-xs flex items-center gap-1.5">
              🛡️ NSDC Certified
            </span>
            <span className="bg-white border-2 border-black px-3 py-1.5 rounded-xl shadow-neo-xs flex items-center gap-1.5">
              🏥 Covered by Welfare Fund
            </span>
            <span className="bg-white border-2 border-black px-3 py-1.5 rounded-xl shadow-neo-xs flex items-center gap-1.5">
              💰 100% Direct Payouts
            </span>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section className="py-12 bg-white border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((st, i) => (
              <div
                key={i}
                className={`${st.bg} rounded-2xl border-2.5 border-black p-5 shadow-neo text-center hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all`}
              >
                <div className="text-3xl mb-1">{st.icon}</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-black font-display tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider mt-1">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Catalog Showcase */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="secondary" size="lg" shadow className="mb-3">
              Popular Cooperative Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-display tracking-tight">
              Verified Professionals Ready For Dispatch
            </h2>
            <p className="text-sm font-bold text-slate-700 mt-2">
              Book skilled trade professionals with transparent pricing and standardized safety standards.
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="md">
              View All 15+ Categories →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((cat, idx) => (
            <Link
              key={idx}
              to="/services"
              className="bg-white rounded-2xl border-2.5 border-black p-6 shadow-neo hover:-translate-x-1.5 hover:-translate-y-1.5 hover:shadow-neo-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} border-2 border-black shadow-neo-xs flex items-center justify-center text-2xl`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs font-extrabold bg-slate-100 border border-black px-2.5 py-1 rounded-md text-black">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-black font-display group-hover:text-teal-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs font-semibold text-slate-700 mt-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between font-extrabold text-xs text-black">
                <span>Book Instant Dispatch</span>
                <span className="w-7 h-7 rounded-lg bg-yellow-300 border border-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why SevaSangam — The Cooperative Revolution */}
      <section className="py-16 md:py-20 bg-teal-50 border-y-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="primary" size="lg" shadow className="mb-3">
              Why Cooperative Ownership Wins
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-display tracking-tight">
              A Platform Built For Workers, Governed By Workers
            </h2>
            <p className="text-sm font-bold text-slate-800 mt-2">
              Unlike private aggregator monopolies that take 20-30% commissions, SevaSangam is owned by registered Labour Cooperatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-yellow-300 rounded-2xl border-3 border-black p-6 shadow-neo-lg hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-black shadow-neo-xs flex items-center justify-center text-3xl mb-5">
                🏛️
              </div>
              <h3 className="text-xl font-extrabold text-black font-display">100% Cooperative Owned</h3>
              <p className="text-xs font-bold text-slate-900 mt-3 leading-relaxed">
                Platform surplus flows back into the worker welfare pool, providing health insurance, pension, and emergency hardship support.
              </p>
              <div className="mt-6 inline-block bg-white text-black font-extrabold text-xs px-3 py-1 rounded-md border border-black shadow-neo-xs">
                Zero Venture Capital Extraction
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-cyan-300 rounded-2xl border-3 border-black p-6 shadow-neo-lg hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-black shadow-neo-xs flex items-center justify-center text-3xl mb-5">
                ⚖️
              </div>
              <h3 className="text-xl font-extrabold text-black font-display">AI Fairness Safeguard</h3>
              <p className="text-xs font-bold text-slate-900 mt-3 leading-relaxed">
                Our proprietary matching algorithm prevents star-worker monopoly by ensuring equitable job allocation across all qualified guild members.
              </p>
              <div className="mt-6 inline-block bg-white text-black font-extrabold text-xs px-3 py-1 rounded-md border border-black shadow-neo-xs">
                Gini-Cooperative Balancing
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-lime-300 rounded-2xl border-3 border-black p-6 shadow-neo-lg hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-black shadow-neo-xs flex items-center justify-center text-3xl mb-5">
                🛡️
              </div>
              <h3 className="text-xl font-extrabold text-black font-display">Skill & Identity Verified</h3>
              <p className="text-xs font-bold text-slate-900 mt-3 leading-relaxed">
                National Skill Development Council (NSDC) certificate verification, police background verification, and transparent customer ratings.
              </p>
              <div className="mt-6 inline-block bg-white text-black font-extrabold text-xs px-3 py-1 rounded-md border border-black shadow-neo-xs">
                Guaranteed Quality
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Emergency & AI Demand Callout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-yellow-400 rounded-3xl border-3 border-black p-8 sm:p-12 shadow-neo-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold bg-black text-yellow-300 px-3 py-1 rounded-md uppercase tracking-wider">
              ⚡ Rapid Dispatch Available
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-black font-display tracking-tight mt-4 leading-tight">
              Need an Emergency Electrician or Plumber in 15 Minutes?
            </h2>
            <p className="text-sm font-bold text-slate-900 mt-4 leading-relaxed">
              Our cooperative dispatch engine locates the nearest on-duty verified worker with instant booking confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link to="/workers">
              <Button variant="danger" size="xl" className="font-extrabold">
                🚨 Emergency Dispatch
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="xl" className="font-extrabold">
                Book Scheduled
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
