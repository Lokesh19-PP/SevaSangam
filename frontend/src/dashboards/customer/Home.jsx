import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { services } from '../../mock/data/services';
import { workers } from '../../mock/data/workers';
import { bookings } from '../../mock/data/bookings';
import { Button, Card, Badge, Avatar } from '../../components/ui';

/**
 * Customer Home — SevaSangam
 * Browse service categories as cards, view active bookings, and access cooperative verified trades.
 */
const CustomerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const customerName = user?.name || 'Rahul Sharma';

  // Active bookings for this customer
  const customerBookings = bookings.filter(
    (b) => b.customerId === 'cust_001' || b.customerId === user?.id
  );
  const activeBookings = customerBookings.filter(
    (b) => b.status === 'upcoming' || b.status === 'in_progress'
  );

  const categories = ['All', 'Home Maintenance', 'Housekeeping', 'Appliance Repair', 'Healthcare & Welfare', 'Outdoor & Green'];

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory);

  // Icon mapper helper
  const getServiceSvg = (icon) => {
    switch (icon) {
      case 'wrench':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        );
      case 'bolt':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'hammer':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11l-4-4m0 0l-2 2m2-2l4-4m-6 6l-6 6m0 0l-3-3m3 3l6-6" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="secondary" size="sm" dot>
            Verified Labour Cooperative Network • Pune Region
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {customerName}!
          </h1>
          <p className="text-sm sm:text-base text-primary-100/90 leading-relaxed">
            Directly connect with certified plumbers, electricians, carpenters, and domestic specialists from registered labour cooperatives. 100% of service fees go to the worker with zero platform commission.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/customer/services">
              <Button
                variant="secondary"
                size="md"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              >
                Browse All Services
              </Button>
            </Link>

            <Link to="/customer/emergency">
              <Button
                variant="danger"
                size="md"
                leftIcon={
                  <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              >
                Instant Emergency Service (24x7)
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-secondary-500/10 pointer-events-none blur-xl" />
      </div>

      {/* Active Booking Alert (if any) */}
      {activeBookings.length > 0 && (
        <Card className="p-5 border-l-4 border-l-secondary-500 bg-amber-50/40 border-amber-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary-500 text-slate-950 rounded-xl shadow-xs">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Upcoming Appointment: {activeBookings[0].serviceName}
                  </h3>
                  <Badge variant="secondary" size="sm">
                    {activeBookings[0].status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Worker: <strong className="text-slate-800">{activeBookings[0].workerName}</strong> • {activeBookings[0].address}
                </p>
              </div>
            </div>
            <Link to="/customer/bookings">
              <Button variant="outline-primary" size="sm">
                View Details & Invoice
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Cooperative Guarantee Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-lg shrink-0">
            0%
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zero Platform Cut</h4>
            <p className="text-xs text-slate-500 mt-0.5">100% of your payment goes directly into the worker's hands.</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cooperative Verified</h4>
            <p className="text-xs text-slate-500 mt-0.5">OCR checked government licenses, police cleared, and skill tested.</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">30-Day Work Warranty</h4>
            <p className="text-xs text-slate-500 mt-0.5">Free cooperative resolution if any post-service issue arises.</p>
          </div>
        </div>
      </div>

      {/* Services Categories Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browse Services</h2>
            <p className="text-xs text-slate-500 mt-0.5">Transparent cooperative standard pricing across all trades</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat
                    ? 'bg-primary-700 text-white shadow-xs font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              hover
              onClick={() => navigate(`/customer/services?selected=${service.id}`)}
              className="flex flex-col justify-between p-5 group border border-slate-200 hover:border-primary-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 group-hover:bg-primary-700 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                    {getServiceSvg(service.icon)}
                  </div>
                  {service.emergencySupported && (
                    <Badge variant="secondary" size="sm">
                      ⚡ 24x7
                    </Badge>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Consultation</span>
                  <p className="text-base font-extrabold text-slate-900">
                    ₹{service.basePrice}{' '}
                    <span className="text-[11px] font-normal text-slate-500">/{service.priceUnit}</span>
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/customer/book/${service.id}`);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Cooperative Workers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Verified Cooperative Workers Nearby</h2>
            <p className="text-xs text-slate-500 mt-0.5">Matched using smart distance and fair workload allocation</p>
          </div>
          <Link to="/customer/services" className="text-xs font-semibold text-primary-700 hover:text-primary-800">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.slice(0, 3).map((worker) => (
            <Card key={worker.id} hover className="p-5 border border-slate-200">
              <div className="flex items-start gap-3.5">
                <Avatar
                  name={worker.name}
                  src={worker.avatar}
                  size="lg"
                  status={worker.availability === 'available' ? 'online' : 'busy'}
                  verified={worker.isVerified}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h4>
                    <span className="flex items-center text-xs font-bold text-amber-600 shrink-0">
                      ★ {worker.rating} <span className="font-normal text-slate-400 text-[10px]">({worker.reviewCount})</span>
                    </span>
                  </div>
                  <p className="text-xs text-primary-700 font-medium truncate">{worker.primarySkill}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{worker.cooperative}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" size="sm">
                      📍 {worker.distance}
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {worker.experienceYears} yrs exp
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Standard Rate</span>
                  <p className="text-sm font-bold text-slate-900">₹{worker.hourlyRate}/hr</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/customer/workers/${worker.id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/customer/book?worker=${worker.id}`)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
