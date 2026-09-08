import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * Home Page — SevaSangam
 * "Trusted Services. Fair Opportunities. Stronger Communities."
 */
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-sky-50/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" size="lg" className="mb-4">
            Cooperative-Powered Gig Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Trusted Services. Fair Opportunities.{' '}
            <span className="text-sky-600">Stronger Communities.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            SevaSangam connects households and businesses with verified, skilled workers from
            Labour Cooperative Federations. Ensuring fair wages, worker welfare, and trusted quality.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/services">
              <Button variant="primary" size="lg">
                Explore Services
              </Button>
            </Link>
            <Link to="/workers">
              <Button variant="outline" size="lg">
                Find Workers
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Join as Worker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Why SevaSangam is Different
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Built for dignity of labor and trusted community service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mb-4">
              🏛️
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Cooperative Owned</h3>
            <p className="text-sm text-slate-600 mt-2">
              Workers belong to registered Labour Cooperative Federations, ensuring collective
              bargaining, fair earnings, and profit sharing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
              🛡️
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Skill Verified & Insured</h3>
            <p className="text-sm text-slate-600 mt-2">
              Every worker undergoes certificate validation and skill verification with comprehensive
              welfare protection and health insurance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4">
              ⚖️
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Fair Job Distribution</h3>
            <p className="text-sm text-slate-600 mt-2">
              Our AI matching ensures work is fairly distributed among all cooperative members rather
              than favoring a select few.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
