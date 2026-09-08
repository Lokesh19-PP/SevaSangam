import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

/**
 * Admin Dashboard — SevaSangam
 * Strictly isolated cooperative administrator operations & monitoring.
 */
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">
          Cooperative Administration & Operations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Workforce management, fair distribution tracking, and certificate verifications.
        </p>
      </div>

      {/* Admin Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Registered Workers</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">156</p>
          <span className="text-[10px] text-emerald-600 font-medium">98.2% Verified</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Fair Distribution Index</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">0.94</p>
          <span className="text-[10px] text-slate-400">Target: &gt; 0.90 (Balanced)</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Pending Verifications</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">7</p>
          <span className="text-[10px] text-amber-600 font-medium">Requires Admin OCR check</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Completed Bookings</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,247</p>
          <span className="text-[10px] text-sky-600 font-medium">₹8,75,600 Disbursed</span>
        </div>
      </div>

      {/* Pending Certificate Verification Queue */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Pending Worker Skill & Certificate Verifications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="p-3">Worker Name</th>
                <th className="p-3">Skill / Certificate</th>
                <th className="p-3">Cooperative Society</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Suresh Patil</td>
                <td className="p-3">Wireman License (OCR Extracted: 94% match)</td>
                <td className="p-3 text-slate-500">Pune Labour Cooperative</td>
                <td className="p-3">
                  <Badge variant="warning" size="sm">Pending Review</Badge>
                </td>
                <td className="p-3 text-right">
                  <Button variant="primary" size="sm">Approve</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
