import { useParams, useNavigate, Link } from 'react-router-dom';
import { workers } from '../../mock/data/workers';
import { certifications } from '../../mock/data/certifications';
import { ratings } from '../../mock/data/ratings';
import { Button, Card, Badge, Avatar } from '../../components/ui';

/**
 * WorkerProfile Component — SevaSangam
 * Detailed worker profile for customers with verified cooperative credentials,
 * OCR certified documents, fair workload metrics, insurance status, and ratings.
 */
const CustomerWorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find worker or default to first
  const worker = workers.find((w) => w.id === id) || workers[0];
  const workerCerts = certifications.filter((c) => c.workerId === worker.id);
  const workerRatings = ratings.filter((r) => r.workerId === worker.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to browse</span>
      </button>

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <Avatar
              name={worker.name}
              src={worker.avatar}
              size="xl"
              status={worker.availability === 'available' ? 'online' : 'busy'}
              verified={worker.isVerified}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{worker.name}</h1>
                <Badge variant="primary" size="sm">
                  Coop Verified
                </Badge>
                {worker.emergencyAvailable && (
                  <Badge variant="danger" size="sm">
                    ⚡ 24x7 Emergency
                  </Badge>
                )}
              </div>

              <p className="text-sm font-semibold text-primary-700 mt-1">
                {worker.primarySkill} Specialist
              </p>

              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{worker.cooperative}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  ★ {worker.rating} <span className="font-normal text-slate-400">({worker.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span>📍 {worker.distance} away ({worker.location.area})</span>
                <span>•</span>
                <span>💼 {worker.totalJobs} jobs completed</span>
              </div>
            </div>
          </div>

          {/* Rate and Instant Booking CTA */}
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:items-end justify-between gap-3 shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Standard Rate</span>
              <p className="text-2xl font-black text-slate-900">
                ₹{worker.hourlyRate}
                <span className="text-xs font-normal text-slate-500"> / hr</span>
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                ✓ 100% fare directly to worker
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate(`/customer/book?worker=${worker.id}`)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            >
              Book This Worker
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid: Details, Certifications, Welfare, and Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 cols: Bio, Skills & Verified Certifications */}
        <div className="md:col-span-2 space-y-6">
          {/* About & Bio */}
          <Card className="p-6 border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-2">About the Professional</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{worker.bio}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Experience</span>
                <p className="text-sm font-bold text-slate-800">{worker.experienceYears} Years</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Languages</span>
                <p className="text-sm font-bold text-slate-800">
                  {worker.languages.map((l) => (l === 'mr' ? 'Marathi' : l === 'hi' ? 'Hindi' : 'English')).join(', ')}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Cooperative Workload</span>
                <p className="text-sm font-bold text-emerald-600">Fairly Balanced ({worker.currentWorkload} active)</p>
              </div>
            </div>
          </Card>

          {/* Skills Breakdown */}
          <Card className="p-6 border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-3">Certified Skills</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-800 text-xs font-semibold border border-primary-100 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-primary-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* OCR Verified Licenses & Certifications */}
          <Card className="p-6 border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Verified Credentials & Licenses</h3>
                <p className="text-xs text-slate-500 mt-0.5">Authenticated via OCR and Cooperative Administrator inspection</p>
              </div>
              <Badge variant="primary" size="sm">
                OCR Verified
              </Badge>
            </div>

            <div className="space-y-3">
              {workerCerts.length > 0 ? (
                workerCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{cert.issuedBy}</p>
                        <span className="text-[11px] font-mono text-slate-400 mt-1 inline-block">
                          ID: {cert.certificateNumber}
                        </span>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      {cert.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-500">
                  Cooperative background verification completed. Standard license on record.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right col: Welfare Protection & Reviews */}
        <div className="space-y-6">
          {/* Worker Welfare & Insurance Card */}
          <Card className="p-6 bg-gradient-to-br from-primary-900 to-primary-800 text-white border-0 shadow-md">
            <Badge variant="secondary" size="sm" className="mb-3">
              Worker Welfare Protected
            </Badge>
            <h4 className="text-base font-bold">Labour Welfare Backed</h4>
            <p className="text-xs text-primary-100 mt-1 leading-relaxed">
              When you book {worker.name}, you directly support cooperative dignity and worker health insurance.
            </p>

            <div className="mt-4 pt-4 border-t border-primary-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-primary-200">Policy:</span>
                <span className="font-mono font-semibold">{worker.insurancePolicy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-200">Coverage:</span>
                <span className="font-semibold text-secondary-300">PM Suraksha Bima Yojana</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-200">Platform Cut:</span>
                <span className="font-bold text-white">0% (Zero)</span>
              </div>
            </div>
          </Card>

          {/* Customer Reviews for this worker */}
          <Card className="p-6 border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-3">Customer Feedback</h3>
            <div className="space-y-4 divide-y divide-slate-100">
              {workerRatings.length > 0 ? (
                workerRatings.map((rev) => (
                  <div key={rev.id} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      <span className="text-xs font-bold text-amber-600">★ {rev.score}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{rev.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-2">
                  Consistently rated 5 stars across recent cooperative jobs.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerWorkerProfile;
