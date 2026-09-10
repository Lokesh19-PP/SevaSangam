import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { services } from '../../mock/data/services';
import { ratings } from '../../mock/data/ratings';
import { Button, Input, Card, Badge, Modal } from '../../components/ui';

/**
 * Customer Services View — SevaSangam
 * Search, filter, inspect 5-step cooperative process, view ratings breakdown, and book services.
 * Implements the exact 5-step process flow and detailed reviews breakdown shown in reference mockups.
 */
const CustomerServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [activeService, setActiveService] = useState(null); // Service selected for process/review modal
  const [reviewFilter, setReviewFilter] = useState('All');

  const categories = ['All', 'Home Maintenance', 'Housekeeping', 'Appliance Repair', 'Healthcare & Welfare', 'Outdoor & Green'];

  // Check URL params on initial load e.g. ?selected=svc_001
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const match = services.find((s) => s.id === selectedId);
      if (match) setActiveService(match);
    }
  }, [searchParams]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      const matchesEmergency = !emergencyOnly || service.emergencySupported;
      return matchesSearch && matchesCategory && matchesEmergency;
    });
  }, [searchQuery, selectedCategory, emergencyOnly]);

  // Realistic review items for the selected service (matching Image 3)
  const serviceReviews = useMemo(() => {
    return [
      {
        id: 'rev_1',
        author: 'Fd',
        date: 'Sep 2, 2026',
        tag: 'For Plumbers consultation',
        score: 5,
        text: 'Plumbing is my go to place for plumbing and furnace repairs. I always have fantastic and speedy service. My last service call was truly exceptional and worth taking the time to review. Your technician Shafi was wonderful to deal with problems to repair ☀️☀️',
      },
      {
        id: 'rev_2',
        author: 'Anusha Vivek',
        date: 'Sep 2, 2026',
        tag: 'For Plumbers consultation, Shut-off valve leakage, Waste pipe basin',
        score: 4.8,
        text: 'The cooperative worker arrived on time with proper ID. Fixed the kitchen water shut-off valve quickly and gave great maintenance advice. Transparent pricing without any hidden charges.',
      },
      {
        id: 'rev_3',
        author: 'Ruma Saha',
        date: 'Sep 6, 2026',
        tag: 'For Plumbers consultation',
        score: 4.5,
        text: 'Courteous behavior and neat cleanup after replacing the bathroom drain pipe. Appreciate the zero platform fee policy that supports the workers directly.',
      },
      {
        id: 'rev_4',
        author: 'Kunal Deshpande',
        date: 'Aug 29, 2026',
        tag: 'In my area (Kothrud)',
        score: 5,
        text: 'Had an urgent water tank leak and the cooperative dispatched a specialist in under 25 minutes. Outstanding workmanship and full 30-day warranty card issued.',
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cooperative Service Catalogue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fair wages for verified workers • 0% platform commission • 30-day service warranty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8">
            <Input
              placeholder="Search for plumbing, electrical wiring, AC service, deep cleaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-between sm:justify-end gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="w-4 h-4 rounded text-primary-700 focus:ring-primary-500 border-slate-300 cursor-pointer"
              />
              <span>⚡ 24x7 Emergency Only</span>
            </label>

            {(searchQuery || selectedCategory !== 'All' || emergencyOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setEmergencyOnly(false);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            hover
            onClick={() => setActiveService(service)}
            className="p-5 flex flex-col justify-between border border-slate-200/90 hover:border-primary-400 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                  {service.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  ★ 4.74 <span className="font-normal text-slate-400 text-[10px]">(210K)</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span>⏱️ {service.estimatedTime}</span>
                <span>•</span>
                <span>🛡️ 30-day warranty</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Consultation Fee</span>
                <p className="text-base font-extrabold text-slate-900">
                  ₹{service.basePrice}{' '}
                  <span className="text-xs font-normal text-slate-500">/{service.priceUnit}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveService(service);
                  }}
                >
                  Details & Process
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/customer/book/${service.id}`);
                  }}
                >
                  Book
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* SERVICE DETAILS MODAL (Exact match to Image 2: "Our Process" & Image 3: Reviews breakdown) */}
      {activeService && (
        <Modal
          isOpen={!!activeService}
          onClose={() => setActiveService(null)}
          title={`${activeService.name}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="text-xs text-slate-500">Consultation Rate</span>
                <p className="text-lg font-bold text-slate-900">₹{activeService.basePrice}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setActiveService(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const sid = activeService.id;
                    setActiveService(null);
                    navigate(`/customer/book/${sid}`);
                  }}
                >
                  Proceed to Book
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-6 pb-2">
            {/* Top Service Header Card (Image 2 style) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeService.name} consultation</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center">
                    ★ 4.74 <span className="font-normal text-slate-500 ml-1">(210K reviews)</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600">{activeService.estimatedTime}</span>
                </div>
                <p className="text-sm font-extrabold text-primary-800 mt-2">
                  ₹{activeService.basePrice}
                </p>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  const sid = activeService.id;
                  setActiveService(null);
                  navigate(`/customer/book/${sid}`);
                }}
              >
                Add / Select
              </Button>
            </div>

            {/* OUR PROCESS (Exact implementation of Image 2) */}
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Our process</h4>

              <div className="space-y-5 pl-2 relative">
                {/* Connecting timeline line */}
                <div className="absolute left-[19px] top-3 bottom-6 w-0.5 bg-slate-200" />

                {/* Step 1 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 z-10">
                    1
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Consultation</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      A certified cooperative worker will visit to understand your requirements & share a transparent quote for approval.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 z-10">
                    2
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Quote approval</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      You can approve the quote to proceed, or pay a minimal visitation charge if declined. Zero hidden charges.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 z-10">
                    3
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Service completion</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Once approved, the service will be completed skillfully as per the identified cooperative standard scope.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 z-10">
                    4
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Cleanup</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      We will clean the work area once service is completed before departure.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 z-10">
                    5
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Warranty activation</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      The service is covered by a 30-day cooperative warranty for any post-service issues with free revisit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEWS & RATINGS BREAKDOWN (Exact implementation of Image 3) */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">★ 4.74</span>
                <span className="text-xs text-slate-500">210K reviews</span>
              </div>

              {/* Horizontal Star Distribution Bars (as in Image 3) */}
              <div className="mt-3 space-y-1.5 max-w-md">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-6 shrink-0 font-medium">★ 5</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full w-[90%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">191K</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-6 shrink-0 font-medium">★ 4</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full w-[15%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">6K</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-6 shrink-0 font-medium">★ 3</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full w-[8%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">3K</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-6 shrink-0 font-medium">★ 2</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full w-[5%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">2K</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-6 shrink-0 font-medium">★ 1</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full w-[12%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">8K</span>
                </div>
              </div>

              {/* All reviews header & filter pills (as in Image 3) */}
              <div className="mt-6 flex items-center justify-between">
                <h5 className="text-base font-bold text-slate-900">All reviews</h5>
                <span className="text-xs font-semibold text-primary-700 cursor-pointer hover:underline">
                  Filter
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1">
                {['Most detailed', 'In my area', 'Frequent users'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setReviewFilter(tag)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      reviewFilter === tag
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Individual review cards (as in Image 3) */}
              <div className="mt-4 space-y-4 divide-y divide-slate-100">
                {serviceReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="text-sm font-bold text-slate-900">{rev.author}</h6>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {rev.date} • {rev.tag}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold text-white px-2 py-0.5 rounded ${
                        rev.score >= 4 ? 'bg-emerald-700' : rev.score >= 3 ? 'bg-amber-600' : 'bg-rose-700'
                      }`}>
                        ★ {rev.score}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerServices;
