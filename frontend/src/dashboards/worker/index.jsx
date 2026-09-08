import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

/**
 * Worker Dashboard — SevaSangam
 * Strictly isolated worker-only operations.
 */
const WorkerDashboard = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="space-y-6">
      {/* Worker Header with Availability Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Worker Portal: {user?.name || 'Worker'}
            </h1>
            <Badge variant="success">Cooperative Verified</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pune Labour Cooperative Society • Member ID: #WRK-4821
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Availability:</span>
          <button
            type="button"
            onClick={() => setIsAvailable((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAvailable
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}
          >
            {isAvailable ? '🟢 Online / Ready for Jobs' : '⚪ Offline'}
          </button>
        </div>
      </div>

      {/* Worker Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">This Month Earnings</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹18,400</p>
          <span className="text-[10px] text-emerald-600 font-medium">Fair distribution rate</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Completed Jobs</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">120</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Worker Rating</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">⭐ 4.8 / 5.0</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Welfare Status</span>
          <p className="text-sm font-semibold text-emerald-600 mt-2">Active Insurance</p>
        </div>
      </div>

      {/* Active Job Opportunities */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">New Incoming Job Requests</h2>
        <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 uppercase">Emergency Pipe Burst</span>
              <Badge variant="danger" size="sm">Emergency</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Location: 1.2 km away • Estimated earnings: ₹950
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              Accept Job
            </Button>
            <Button variant="ghost" size="sm">
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
