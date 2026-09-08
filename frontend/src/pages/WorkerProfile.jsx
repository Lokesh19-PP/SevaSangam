import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { workers } from '../mock/data/workers';
import { certifications } from '../mock/data/certifications';

/**
 * Worker Profile Page — SevaSangam
 * Detailed view of worker credentials, cooperative affiliation, certifications, and skills.
 */
const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const worker = workers.find((w) => w.id === id) || workers[0];
  const workerCerts = certifications.filter((c) => c.workerId === worker?.id);

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Worker not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link to="/workers" className="text-xs font-semibold text-sky-600 hover:text-sky-700 mb-4 inline-block">
          ← Back to Workers
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar name={worker.name} size="xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{worker.name}</h1>
                  {worker.isVerified && <Badge variant="success">Verified Cooperative Member</Badge>}
                </div>
                <p className="text-sm text-slate-500 mt-1">{worker.cooperative}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span>⭐ {worker.rating} Rating</span>
                  <span>•</span>
                  <span>{worker.totalJobs} Jobs Completed</span>
                  <span>•</span>
                  <span>{worker.experience} Years Exp.</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/booking?workerId=${worker.id}`)}
            >
              Book Worker
            </Button>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Skills & Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills?.map((skill, idx) => (
                  <Badge key={idx} variant="primary" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mt-6 mb-3">
                Languages Spoken
              </h3>
              <div className="flex gap-2">
                {worker.languages?.map((lang, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {lang.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Verified Certifications
              </h3>
              {workerCerts.length > 0 ? (
                <div className="space-y-3">
                  {workerCerts.map((cert) => (
                    <div key={cert.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800">{cert.name}</span>
                        <Badge variant={cert.status === 'verified' ? 'success' : 'warning'} size="sm">
                          {cert.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Issued by: {cert.issuedBy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No certificates uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkerProfile;
