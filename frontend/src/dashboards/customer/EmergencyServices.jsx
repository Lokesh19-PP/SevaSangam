import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/ui';

/**
 * Emergency Services Information Page — SevaSangam
 * Route: /customer/emergency-services (alias /customer/emergency)
 *
 * Explains platform emergency services, categories, facilities/benefits,
 * and highlights AI-powered emergency intelligence with an interactive triage demo.
 */
const EmergencyServices = () => {
  const navigate = useNavigate();

  // AI Interactive Triage Demo State
  const [problemDescription, setProblemDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Pre-configured emergency categories
  const emergencyCategories = [
    {
      id: 'svc_001',
      title: 'Emergency Plumbing',
      icon: '💧',
      badge: '⚡ < 20 min dispatch',
      description: 'Immediate resolution for pipe bursts, active floods, and plumbing failures.',
      examples: [
        'Major water leakage',
        'Burst pipe / main line fracture',
        'Blocked drainage overflow',
        'Contaminated or suspended water supply',
      ],
      safetyTip: 'Turn off the main water stopcock immediately to prevent structural damage.',
    },
    {
      id: 'svc_002',
      title: 'Emergency Electrical',
      icon: '⚡',
      badge: '⚡ < 15 min dispatch',
      description: 'Certified wiremen for critical electrical faults, fire hazards, and blackouts.',
      examples: [
        'Total power failure / main MCB trip',
        'Electrical short circuit',
        'Sparking or burning smell from switchboard',
        'Critical appliance wiring breakdown',
      ],
      safetyTip: 'Do not touch switches with wet hands. Switch off main MCB breaker outside your flat.',
    },
    {
      id: 'svc_003',
      title: 'Emergency Appliance Repair',
      icon: '❄️',
      badge: '⚡ Same-day emergency',
      description: 'Urgent intervention for essential household and food preservation equipment.',
      examples: [
        'Refrigerator cooling breakdown (spoilage risk)',
        'Washing machine emergency drainage lock',
        'Essential microwave / cooking stove fault',
        'Water purifier pump failure',
      ],
      safetyTip: 'Unplug the appliance power cord safely and avoid opening refrigerator doors.',
    },
    {
      id: 'svc_004',
      title: 'Emergency Locksmith',
      icon: '🔑',
      badge: '⚡ < 25 min dispatch',
      description: 'Rapid door unlocking, lockout assistance, and urgent latch repair.',
      examples: [
        'Locked out of residence',
        'Broken key inside door cylinder',
        'Jammed security deadbolt',
        'Urgent lock replacement after incident',
      ],
      safetyTip: 'Verify cooperative worker government ID credentials upon arrival before opening access.',
    },
    {
      id: 'svc_005',
      title: 'Emergency Cleaning',
      icon: '🧹',
      badge: '⚡ Urgent dispatch',
      description: 'Rapid sanitization and water cleanup to prevent contamination and damage.',
      examples: [
        'Urgent flood & water leakage cleanup',
        'Sewage overflow sanitization',
        'Post-incident debris removal',
        'Urgent deep sanitization',
      ],
      safetyTip: 'Ventilate rooms with open windows and avoid barefoot walking in standing water.',
    },
    {
      id: 'svc_006',
      title: 'Emergency Care / Assistance',
      icon: '❤️',
      badge: '⚡ Priority welfare',
      description: 'Urgent bedside support, elder mobility assistance, and emergency household aide.',
      examples: [
        'Sudden elder mobility assistance',
        'Post-discharge patient attendant support',
        'Urgent medicine pickup & physical support',
        'Emergency domestic helping hands',
      ],
      safetyTip: 'For medical emergencies requiring an ambulance, call 108 or 112 immediately.',
    },
  ];

  // Why Choose Emergency Services Benefits
  const benefits = [
    {
      icon: '🚀',
      title: 'Early Reach',
      description: 'Workers near the customer’s location are prioritized for the fastest possible physical response.',
    },
    {
      icon: '📍',
      title: 'Location-Based Matching',
      description: 'The system identifies active, available cooperative workers within your immediate municipal ward.',
    },
    {
      icon: '⚡',
      title: 'Priority Matching',
      description: 'Emergency service requests receive higher queue priority than standard scheduled visits.',
    },
    {
      icon: '🕐',
      title: '24/7 Support',
      description: 'Emergency service requests can be raised at any time, backed by cooperative emergency rosters.',
    },
    {
      icon: '👷',
      title: 'Verified Workers',
      description: 'Emergency requests are strictly assigned to OCR-verified, police-cleared cooperative workers.',
    },
    {
      icon: '📱',
      title: 'Real-Time Status',
      description: 'Track booking confirmation, worker assignment, live ETA, and route progress on your dashboard.',
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'Clear standard emergency rates with zero commission surcharges or unfair surge pricing.',
    },
    {
      icon: '⭐',
      title: 'Trusted Service',
      description: 'Workers are backed by the cooperative welfare network with formal resolution backing.',
    },
  ];

  // Quick sample queries for AI demo
  const samplePrompts = [
    { text: 'There is water leaking heavily from my bathroom pipe and flooding floor', category: 'Emergency Plumbing', priority: 'Critical', eta: '14 mins', serviceId: 'svc_001' },
    { text: 'Sparking sound and burning smell coming from main electrical switchboard', category: 'Emergency Electrical', priority: 'Critical', eta: '11 mins', serviceId: 'svc_002' },
    { text: 'Refrigerator stopped cooling and making loud clicking sound', category: 'Emergency Appliance Repair', priority: 'Urgent', eta: '25 mins', serviceId: 'svc_003' },
    { text: 'Door lock jammed from outside with stove left running', category: 'Emergency Locksmith', priority: 'Critical', eta: '12 mins', serviceId: 'svc_004' },
  ];

  const handleSimulateAi = (customText) => {
    const textToAnalyze = customText || problemDescription;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();
      let matchedCat = emergencyCategories[0];
      let priority = 'Urgent';
      let eta = '18 mins';

      if (lower.includes('spark') || lower.includes('electric') || lower.includes('power') || lower.includes('mcb') || lower.includes('wire') || lower.includes('shock')) {
        matchedCat = emergencyCategories[1];
        priority = 'Critical';
        eta = '12 mins';
      } else if (lower.includes('leak') || lower.includes('water') || lower.includes('pipe') || lower.includes('drain') || lower.includes('burst') || lower.includes('flood')) {
        matchedCat = emergencyCategories[0];
        priority = lower.includes('burst') || lower.includes('flood') ? 'Critical' : 'Urgent';
        eta = '15 mins';
      } else if (lower.includes('lock') || lower.includes('key') || lower.includes('door') || lower.includes('stuck')) {
        matchedCat = emergencyCategories[3];
        priority = lower.includes('stove') || lower.includes('child') ? 'Critical' : 'Urgent';
        eta = '14 mins';
      } else if (lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('machine') || lower.includes('appliance')) {
        matchedCat = emergencyCategories[2];
        priority = 'Urgent';
        eta = '22 mins';
      } else if (lower.includes('clean') || lower.includes('sewage') || lower.includes('overflow')) {
        matchedCat = emergencyCategories[4];
        priority = 'Urgent';
        eta = '25 mins';
      } else if (lower.includes('care') || lower.includes('elder') || lower.includes('patient') || lower.includes('help')) {
        matchedCat = emergencyCategories[5];
        priority = 'Urgent';
        eta = '20 mins';
      }

      setAiAnalysis({
        query: textToAnalyze,
        category: matchedCat.title,
        serviceId: matchedCat.id,
        priority,
        eta,
        safetyTip: matchedCat.safetyTip,
        confidence: '98%',
      });
      setIsAnalyzing(false);
    }, 450);
  };

  const handleBookEmergency = (serviceId = '') => {
    if (serviceId) {
      navigate(`/customer/booking?emergency=true&service=${serviceId}`);
    } else {
      navigate('/customer/booking?emergency=true');
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 text-white p-6 sm:p-10 shadow-xl border border-rose-800/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
            <Badge variant="danger" size="sm" className="bg-rose-500/30 text-white border-rose-400/50">
              ⚡ 24×7 Cooperative Emergency Network
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ⚡ Emergency Services
          </h1>

          <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed">
            Get urgent household and community services when you need them most. Backed by verified cooperative tradespeople on immediate standby with zero surge markups.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              variant="danger"
              size="lg"
              onClick={() => handleBookEmergency()}
              className="shadow-lg hover:shadow-rose-600/30 ring-2 ring-white/20 font-bold"
              leftIcon={
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              Book Emergency Service
            </Button>

            <a
              href="tel:18002008888"
              className="inline-flex items-center gap-2 text-xs font-semibold text-rose-200 bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Coop Helpline: 1800-200-8888</span>
            </a>
          </div>
        </div>

        {/* Decorative ambient background accents */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-rose-500/10 pointer-events-none blur-2xl" />
        <div className="absolute right-20 -top-12 w-56 h-56 rounded-full bg-secondary-500/10 pointer-events-none blur-xl" />
      </div>

      {/* Emergency Service Categories Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>⚡ Supported Emergency Categories</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a specialized category below for instant dispatch to the nearest available cooperative worker.
            </p>
          </div>
          <Badge variant="primary" size="sm">
            6 Active On-Call Trades
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyCategories.map((cat) => (
            <Card
              key={cat.id}
              hover
              className="p-6 border border-slate-200 hover:border-rose-300 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                    {cat.icon}
                  </div>
                  <Badge variant="danger" size="sm">
                    {cat.badge}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>

                {/* Common Examples */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Common Emergencies:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {cat.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold mt-0.5">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100">
                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={() => handleBookEmergency(cat.id)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                >
                  Request Dispatch
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Facilities & Benefits: Why Choose Emergency Services? */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge variant="secondary" size="sm" className="mb-2">
            Cooperative Advantage
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Emergency Services?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Designed for trust, rapid response, and worker dignity without corporate surge algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-primary-200 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-primary-50 text-xl flex items-center justify-center mb-3.5 transition-colors">
                  {b.icon}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Bottom Dispatch CTA Banner */}
      <div className="text-center p-8 rounded-3xl bg-slate-900 text-white space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold">Facing an Urgent Household Issue?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Immediate priority matching connects you directly to nearest cooperative technicians in Pune.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            size="lg"
            onClick={() => handleBookEmergency()}
            className="font-bold px-8 shadow-lg"
          >
            ⚡ Open Emergency Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
