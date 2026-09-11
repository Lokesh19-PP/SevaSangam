import { useState, useEffect, useCallback, useMemo } from 'react';
import complaintApi from '../../services/api/complaintApi';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  Input,
} from '../../components/ui';

/**
 * Admin Complaints Management — SevaSangam
 * Cooperative dispute resolution and consumer grievance redressal interface.
 */

const initialComplaints = [
  {
    id: 'comp_001',
    ticketNumber: 'GRV-2025-0012',
    bookingId: 'bkg_007',
    customerId: 'cust_002',
    customerName: 'Anjali Verma',
    workerId: 'wrk_003',
    workerName: 'Ramesh Shinde',
    subject: 'Delayed communication for rescheduling',
    category: 'Communication',
    description: 'Worker informed about rescheduling only 15 minutes before the scheduled slot.',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2025-02-10T16:00:00Z',
    resolvedAt: '2025-02-11T11:00:00Z',
    resolutionNotes: 'Worker was engaged in an emergency job. Full booking fee refunded and 10% credit issued.',
  },
  {
    id: 'comp_002',
    ticketNumber: 'GRV-2025-0013',
    bookingId: null,
    customerId: 'cust_003',
    customerName: 'Vikram Joshi',
    workerId: null,
    workerName: null,
    subject: 'Emergency booking dispatch took longer than 20 mins',
    category: 'SLA Delay',
    description: 'Emergency plumber took 35 mins to be assigned during heavy rain.',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2025-03-09T18:30:00Z',
    resolvedAt: null,
    resolutionNotes: 'Admin reviewing monsoon buffer allocation in Yerawada sector.',
  },
  {
    id: 'comp_003',
    ticketNumber: 'GRV-2025-0014',
    bookingId: 'bkg_001',
    customerId: 'cust_001',
    customerName: 'Rahul Sharma',
    workerId: 'wrk_001',
    workerName: 'Priya Deshmukh',
    subject: 'Bill breakdown clarification request',
    category: 'Billing',
    description: 'Customer requested itemized GST receipt for society reimbursement.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2025-02-15T15:00:00Z',
    resolvedAt: '2025-02-15T16:30:00Z',
    resolutionNotes: 'Automated cooperative GST invoice PDF SS-PUN-2025-0142 delivered via WhatsApp.',
  },
  {
    id: 'comp_004',
    ticketNumber: 'GRV-2025-0015',
    bookingId: 'bkg_006',
    customerId: 'cust_005',
    customerName: 'Tanmay Bhattacharya',
    workerId: 'wrk_006',
    workerName: 'Anand Thorat',
    subject: 'Specialized copper pipe spare part pricing check',
    category: 'Pricing',
    description: 'Customer inquired whether replacement copper tubing follows cooperative standard rates.',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-03-10T14:15:00Z',
    resolvedAt: null,
    resolutionNotes: null,
  },
  {
    id: 'comp_005',
    ticketNumber: 'GRV-2025-0016',
    bookingId: 'bkg_009',
    customerId: 'cust_006',
    customerName: 'Sunita Rao',
    workerId: 'wrk_002',
    workerName: 'Suresh Patil',
    subject: 'Appliance power socket polarity query',
    category: 'Quality of Work',
    description: 'Customer wanted re-verification of earthing voltage after air conditioner installation.',
    status: 'open',
    priority: 'high',
    createdAt: '2025-03-11T09:00:00Z',
    resolvedAt: null,
    resolutionNotes: null,
  },
];

const Complaints = () => {
  const [complaintsList, setComplaintsList] = useState(initialComplaints);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'open' | 'in_progress' | 'resolved'
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Resolution Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionAction, setResolutionAction] = useState('Clarification Provided & Ticket Closed');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmittingResolve, setIsSubmittingResolve] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  // Fetch complaints from API or fallback
  const fetchComplaints = useCallback(async () => {
    try {
      const response = await complaintApi.getComplaints();
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        setComplaintsList(response.data);
      }
    } catch (err) {
      console.warn('Complaints API fallback to mock state.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaintsList.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        c.ticketNumber.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.customerName.toLowerCase().includes(query) ||
        (c.workerName && c.workerName.toLowerCase().includes(query)) ||
        c.description.toLowerCase().includes(query);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [complaintsList, statusFilter, priorityFilter, searchQuery]);

  // Open Resolve Dialog
  const openResolveDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setResolutionNotes('');
    setIsResolveModalOpen(true);
  };

  // Submit Resolution
  const handleConfirmResolve = async () => {
    if (!selectedComplaint) return;
    setIsSubmittingResolve(true);

    const fullNotes = `${resolutionAction}: ${resolutionNotes.trim() || 'Cooperative resolution accepted.'}`;

    try {
      // Call complaintApi.updateComplaintStatus if available
      await complaintApi.updateComplaintStatus(selectedComplaint.id, {
        status: 'resolved',
        resolutionNotes: fullNotes,
        resolvedAt: new Date().toISOString(),
      });
    } catch {
      // Handled in local state regardless
    }

    setComplaintsList((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? {
              ...c,
              status: 'resolved',
              resolutionNotes: fullNotes,
              resolvedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setFeedbackBanner({
      type: 'success',
      message: `Grievance ticket ${selectedComplaint.ticketNumber} marked as Resolved.`,
    });
    setTimeout(() => setFeedbackBanner(null), 4500);

    setIsSubmittingResolve(false);
    setIsResolveModalOpen(false);
    setSelectedComplaint(null);
  };

  // Count summaries
  const totalCount = complaintsList.length;
  const openCount = complaintsList.filter((c) => c.status === 'open').length;
  const inProgressCount = complaintsList.filter((c) => c.status === 'in_progress').length;
  const resolvedCount = complaintsList.filter((c) => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Feedback Toast Banner */}
      {feedbackBanner && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{feedbackBanner.message}</span>
          </div>
          <button
            onClick={() => setFeedbackBanner(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Complaints & Grievance Redressal</h1>
            <Badge variant="secondary" size="sm">Cooperative Ombudsman</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Resolve consumer complaints, billing discrepancies, and ensure fair dispute arbitration for cooperative workers.
          </p>
        </div>

        {/* Stats Summary Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
            <span className="block text-[10px] font-semibold text-rose-700 uppercase">Open</span>
            <span className="text-base font-bold text-rose-900">{openCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <span className="block text-[10px] font-semibold text-amber-700 uppercase">In Progress</span>
            <span className="text-base font-bold text-amber-900">{inProgressCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <span className="block text-[10px] font-semibold text-emerald-700 uppercase">Resolved</span>
            <span className="text-base font-bold text-emerald-900">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: `All (${totalCount})` },
            { key: 'open', label: `Open (${openCount})` },
            { key: 'in_progress', label: `In Progress (${inProgressCount})` },
            { key: 'resolved', label: `Resolved (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                statusFilter === tab.key
                  ? 'bg-primary-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter & Search Box */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shrink-0"
          >
            <option value="ALL">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <Input
            type="text"
            placeholder="Search ticket, name, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs py-1.5 w-full md:w-60"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="text-center p-8 bg-white">
            <p className="text-xs text-slate-500">Loading complaints registry...</p>
          </Card>
        ) : filteredComplaints.length === 0 ? (
          <Card className="text-center p-12 bg-white border border-dashed border-slate-200">
            <span className="text-4xl">✨</span>
            <h3 className="text-base font-semibold text-slate-800 mt-2">No Complaints Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are currently no grievance tickets matching your active filter criteria.
            </p>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => {
            const isResolved = complaint.status === 'resolved';
            const isOpen = complaint.status === 'open';

            return (
              <Card key={complaint.id} className="transition-all hover:border-slate-300">
                <CardHeader className="bg-slate-50/50 py-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                        {complaint.ticketNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">•</span>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {complaint.category}
                      </span>
                      {complaint.bookingId && (
                        <span className="text-[11px] text-slate-400">
                          Booking: <span className="font-mono text-slate-600">{complaint.bookingId}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority Badge */}
                      <Badge
                        variant={
                          complaint.priority === 'high' || complaint.priority === 'urgent'
                            ? 'danger'
                            : complaint.priority === 'medium'
                            ? 'warning'
                            : 'default'
                        }
                        size="xs"
                      >
                        {complaint.priority?.toUpperCase()} PRIORITY
                      </Badge>

                      {/* Status Badge */}
                      <Badge
                        variant={
                          complaint.status === 'resolved'
                            ? 'success'
                            : complaint.status === 'in_progress'
                            ? 'warning'
                            : 'danger'
                        }
                        size="xs"
                        dot
                      >
                        {complaint.status === 'in_progress'
                          ? 'In Progress'
                          : complaint.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{complaint.subject}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  {/* Customer and Worker Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium">Customer: </span>
                      <span className="font-semibold text-slate-800">{complaint.customerName}</span>
                    </div>

                    {complaint.workerName && (
                      <div>
                        <span className="text-slate-400 font-medium">Worker Involved: </span>
                        <span className="font-semibold text-primary-800">{complaint.workerName}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-400 font-medium">Lodged on: </span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}</span>
                    </div>
                  </div>

                  {/* Resolution Notes (If already resolved) */}
                  {isResolved && complaint.resolutionNotes && (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-0.5">
                        <span>✓</span>
                        <span>Resolution Record</span>
                        {complaint.resolvedAt && (
                          <span className="text-[10px] font-normal text-emerald-700">
                            • Resolved on {new Date(complaint.resolvedAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-900 font-medium">{complaint.resolutionNotes}</p>
                    </div>
                  )}
                </CardContent>

                {/* Footer with Resolve Action */}
                <CardFooter className="bg-slate-50/70 py-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {isResolved ? 'Issue closed by Cooperative Admin' : 'Action required by administrator'}
                  </span>

                  <div>
                    {!isResolved ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openResolveDialog(complaint)}
                        leftIcon={<span>✓</span>}
                      >
                        Resolve Grievance
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          setComplaintsList((prev) =>
                            prev.map((c) =>
                              c.id === complaint.id
                                ? { ...c, status: 'open', resolutionNotes: null }
                                : c
                            )
                          );
                        }}
                      >
                        Reopen Ticket
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Resolution Action Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title={`Resolve Grievance — ${selectedComplaint?.ticketNumber || ''}`}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Complaint Details</span>
            <p className="font-bold text-slate-900">{selectedComplaint?.subject}</p>
            <p className="text-slate-600 text-[11px]">{selectedComplaint?.description}</p>
            <p className="text-[11px] text-slate-500 pt-1">
              Customer: <strong>{selectedComplaint?.customerName}</strong>
              {selectedComplaint?.workerName && ` | Worker: ${selectedComplaint?.workerName}`}
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Resolution Outcome</label>
            <select
              value={resolutionAction}
              onChange={(e) => setResolutionAction(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
            >
              <option value="Clarification Provided & Ticket Closed">Clarification Provided & Ticket Closed</option>
              <option value="Full Refund Processed to Customer Wallet">Full Refund Processed to Customer Wallet</option>
              <option value="Replacement Technician Dispatched at Zero Cost">Replacement Technician Dispatched at Zero Cost</option>
              <option value="Cooperative Quality Warning Issued to Worker">Cooperative Quality Warning Issued to Worker</option>
              <option value="Mutual Agreement Reached with Consumer">Mutual Agreement Reached with Consumer</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resolution Summary & Notes</label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Spoke with customer and technician. Re-verified meter reading and credited ₹150 goodwill voucher."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleConfirmResolve}
              isLoading={isSubmittingResolve}
              leftIcon={<span>✓</span>}
            >
              Confirm & Resolve
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Complaints;
