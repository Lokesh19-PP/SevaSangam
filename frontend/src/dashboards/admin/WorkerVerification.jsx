import { useState, useMemo } from 'react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Avatar,
  Modal,
  Input,
} from '../../components/ui';

/**
 * Worker Verification Dashboard — SevaSangam
 * Cooperative administrator interface to review, verify OCR credentials,
 * and approve or reject worker onboardings and trade certificates.
 */
const initialPendingWorkers = [
  {
    id: 'verif_001',
    workerId: 'wrk_008',
    name: 'Ganesh More',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    primarySkill: 'Waterproofing & Painting',
    skills: ['Waterproofing', 'Wall Putty', 'Texture Painting', 'Damp Proofing'],
    cooperative: 'Pune Central Labour Cooperative Society',
    cooperativeId: 'coop_pune_01',
    experienceYears: 12,
    appliedDate: '2025-02-18',
    phone: '+91 98230 45678',
    email: 'ganesh.more@punelabour.coop',
    location: 'Hinjawadi, Pune',
    aadhaarStatus: 'Verified via DigiLocker',
    policeVerification: 'Clear (Pune City Police)',
    insuranceStatus: 'Enrolled in PM-SBY via Cooperative',
    status: 'pending',
    certificate: {
      name: 'Advanced Waterproofing Specialist Diploma',
      number: 'WTR-PRF-2023-9912',
      issuedBy: 'Asian Paints Colour Academy, Pune',
      issuedDate: '2023-05-18',
      expiryDate: 'Lifetime Validity',
      ocrMatchScore: 96,
      ocrSummary: 'Candidate Name: Ganesh More | Roll: 9912 | Trade: Waterproofing Specialist | Grade: Distinction',
      documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'verif_002',
    workerId: 'wrk_010',
    name: 'Deepak Sutar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    primarySkill: 'Carpentry & Modular Woodcraft',
    skills: ['Modular Kitchen Assembly', 'Wood Restoration', 'Hardware Fitting', 'Lock Repair'],
    cooperative: 'Sahyadri Shramik Sahakari Sanstha',
    cooperativeId: 'coop_pune_02',
    experienceYears: 9,
    appliedDate: '2025-02-19',
    phone: '+91 97654 32109',
    email: 'deepak.sutar@sahyadri.coop',
    location: 'Hadapsar, Pune',
    aadhaarStatus: 'Verified via DigiLocker',
    policeVerification: 'Clear (Hadapsar Police Stn)',
    insuranceStatus: 'Enrolled in PM-SBY via Cooperative',
    status: 'pending',
    certificate: {
      name: 'NSDC Certificate in Modular Woodcraft & Joinery',
      number: 'NSDC-CARP-2021-4402',
      issuedBy: 'Skill India / Furniture & Fittings Skill Council',
      issuedDate: '2021-09-10',
      expiryDate: 'Lifetime Validity',
      ocrMatchScore: 92,
      ocrSummary: 'Candidate: Deepak Sutar | Trade: Modular Joinery Level 4 | NSQF Compliant',
      documentUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'verif_003',
    workerId: 'wrk_011',
    name: 'Meena Jadhav',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    primarySkill: 'Sanitization & Deep Cleaning',
    skills: ['Deep Cleaning', 'Kitchen Degreasing', 'Hospital Sanitation', 'Eco-friendly Cleaning'],
    cooperative: 'Mahila Utkarsh Shramik Cooperative Society',
    cooperativeId: 'coop_pune_03',
    experienceYears: 6,
    appliedDate: '2025-02-20',
    phone: '+91 94220 11223',
    email: 'meena.jadhav@mahilacoop.in',
    location: 'Kothrud, Pune',
    aadhaarStatus: 'Verified via DigiLocker',
    policeVerification: 'Clear (Kothrud Police Stn)',
    insuranceStatus: 'Enrolled in PM-JJBY via Cooperative',
    status: 'pending',
    certificate: {
      name: 'Sanitization & Hygiene Supervisor Certification',
      number: 'MUSS-CLN-2023-881',
      issuedBy: 'National Institute of Open Schooling & Skill Mission',
      issuedDate: '2023-01-15',
      expiryDate: '2027-01-14',
      ocrMatchScore: 98,
      ocrSummary: 'Candidate: Meena Jadhav | Certification: Hygiene Protocol & Chemical Safety | Score: 94%',
      documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'verif_004',
    workerId: 'wrk_012',
    name: 'Kailash Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    primarySkill: 'Solar PV & Electrical Systems',
    skills: ['Solar Rooftop Installation', 'Inverter Wiring', 'LT Panel Maintenance', 'Earthing Testing'],
    cooperative: 'Pune Central Labour Cooperative Society',
    cooperativeId: 'coop_pune_01',
    experienceYears: 7,
    appliedDate: '2025-02-21',
    phone: '+91 98901 23456',
    email: 'kailash.v@punelabour.coop',
    location: 'Aundh, Pune',
    aadhaarStatus: 'Verified via DigiLocker',
    policeVerification: 'Clear (Chaturshrungi Police)',
    insuranceStatus: 'Enrolled in PM-SBY via Cooperative',
    status: 'pending',
    certificate: {
      name: 'Suryamitra Solar PV Technician Certificate',
      number: 'SM-MNRE-2022-7719',
      issuedBy: 'Ministry of New and Renewable Energy (MNRE) / NISE',
      issuedDate: '2022-07-30',
      expiryDate: '2027-07-29',
      ocrMatchScore: 94,
      ocrSummary: 'Trainee: Kailash Verma | Program: Suryamitra Skill Dev Program | Grade: A+',
      documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    },
  },
];

const WorkerVerification = () => {
  const [workersList, setWorkersList] = useState(initialPendingWorkers);
  const [selectedWorkerId, setSelectedWorkerId] = useState(initialPendingWorkers[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoop, setSelectedCoop] = useState('ALL');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified' | 'rejected'

  // Modal State for Reject
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Document illegible or low resolution');
  const [customReason, setCustomReason] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  // Filtered workers list
  const filteredWorkers = useMemo(() => {
    return workersList.filter((w) => {
      const matchesTab = w.status === activeTab;
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.primarySkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.certificate.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCoop = selectedCoop === 'ALL' || w.cooperativeId === selectedCoop;

      return matchesTab && matchesSearch && matchesCoop;
    });
  }, [workersList, activeTab, searchQuery, selectedCoop]);

  // Selected Worker
  const selectedWorker = useMemo(() => {
    return (
      workersList.find((w) => w.id === selectedWorkerId) ||
      filteredWorkers[0] ||
      null
    );
  }, [workersList, selectedWorkerId, filteredWorkers]);

  // Approve Handler
  const handleApprove = (workerId) => {
    setWorkersList((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: 'verified', verifiedAt: new Date().toISOString() } : w))
    );
    const worker = workersList.find((w) => w.id === workerId);
    setActionFeedback({
      type: 'success',
      message: `Accreditation approved for ${worker?.name || 'Worker'}. Cooperative badge issued.`,
    });
    setTimeout(() => setActionFeedback(null), 4000);

    // Auto-advance to next pending
    const remaining = workersList.filter((w) => w.id !== workerId && w.status === 'pending');
    if (remaining.length > 0) {
      setSelectedWorkerId(remaining[0].id);
    }
  };

  // Open Reject Modal
  const openRejectDialog = () => {
    setIsRejectModalOpen(true);
  };

  // Confirm Reject Handler
  const handleConfirmReject = () => {
    if (!selectedWorker) return;
    const finalReason = customReason.trim() ? customReason : rejectionReason;

    setWorkersList((prev) =>
      prev.map((w) =>
        w.id === selectedWorker.id
          ? { ...w, status: 'rejected', rejectionReason: finalReason, rejectedAt: new Date().toISOString() }
          : w
      )
    );

    setActionFeedback({
      type: 'danger',
      message: `Application rejected for ${selectedWorker.name}. Notification sent with feedback.`,
    });
    setTimeout(() => setActionFeedback(null), 4000);

    setIsRejectModalOpen(false);
    setCustomReason('');

    // Auto-advance to next pending
    const remaining = workersList.filter((w) => w.id !== selectedWorker.id && w.status === 'pending');
    if (remaining.length > 0) {
      setSelectedWorkerId(remaining[0].id);
    }
  };

  const pendingCount = workersList.filter((w) => w.status === 'pending').length;
  const verifiedCount = workersList.filter((w) => w.status === 'verified').length;
  const rejectedCount = workersList.filter((w) => w.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Action Notification Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium transition-all ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{actionFeedback.type === 'success' ? '✅' : 'ℹ️'}</span>
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Worker Verification & Accreditation</h1>
            <Badge variant="primary" size="sm">Cooperative Portal</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted vocational certificates, verify automated OCR matches, and accredit certified cooperative members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <span className="block text-[10px] font-semibold text-amber-700 uppercase">Pending</span>
            <span className="text-base font-bold text-amber-900">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <span className="block text-[10px] font-semibold text-emerald-700 uppercase">Approved</span>
            <span className="text-base font-bold text-emerald-900">{verifiedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="block text-[10px] font-semibold text-slate-600 uppercase">Rejected</span>
            <span className="text-base font-bold text-slate-900">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 border-b sm:border-b-0 pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-primary-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending Verification ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'verified'
                ? 'bg-primary-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Approved ({verifiedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-primary-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search worker or trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs py-1.5 w-full sm:w-56"
          />

          <select
            value={selectedCoop}
            onChange={(e) => setSelectedCoop(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shrink-0"
          >
            <option value="ALL">All Cooperatives</option>
            <option value="coop_pune_01">Pune Central Labour</option>
            <option value="coop_pune_02">Sahyadri Shramik</option>
            <option value="coop_pune_03">Mahila Utkarsh</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Worker Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {activeTab === 'pending'
                ? 'Pending Review Queue'
                : activeTab === 'verified'
                ? 'Accredited Workers'
                : 'Rejected Applications'}
            </span>
            <span className="text-xs text-slate-400">{filteredWorkers.length} results</span>
          </div>

          {filteredWorkers.length === 0 ? (
            <Card className="text-center p-8 bg-white border border-dashed border-slate-200">
              <span className="text-3xl">📭</span>
              <p className="text-sm font-semibold text-slate-700 mt-2">No workers found</p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'pending'
                  ? 'All pending applications in this queue have been resolved.'
                  : `No ${activeTab} workers match your filter criteria.`}
              </p>
            </Card>
          ) : (
            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredWorkers.map((worker) => {
                const isSelected = selectedWorker?.id === worker.id;
                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorkerId(worker.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-50/70 border-primary-600 shadow-xs ring-1 ring-primary-600/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={worker.avatar}
                        name={worker.name}
                        size="md"
                        verified={worker.status === 'verified'}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h4>
                          {worker.status === 'pending' && (
                            <Badge variant="warning" size="xs" dot>
                              Pending
                            </Badge>
                          )}
                          {worker.status === 'verified' && (
                            <Badge variant="success" size="xs" dot>
                              Approved
                            </Badge>
                          )}
                          {worker.status === 'rejected' && (
                            <Badge variant="danger" size="xs">
                              Rejected
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs font-medium text-primary-800 mt-0.5">{worker.primarySkill}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{worker.cooperative}</p>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span>{worker.experienceYears} yrs exp</span>
                          <span>•</span>
                          <span>Applied: {worker.appliedDate}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600">
                            OCR: {worker.certificate.ocrMatchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Worker Detail & Certificate Panel (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedWorker ? (
            <div className="space-y-4">
              {/* Worker Profile Overview Card */}
              <Card>
                <CardHeader className="bg-slate-50/50 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={selectedWorker.avatar}
                        name={selectedWorker.name}
                        size="lg"
                        verified={selectedWorker.status === 'verified'}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{selectedWorker.name}</CardTitle>
                          <Badge variant="secondary" size="xs">ID: {selectedWorker.workerId}</Badge>
                        </div>
                        <CardDescription className="text-xs text-slate-600 font-medium mt-0.5">
                          {selectedWorker.primarySkill} • {selectedWorker.experienceYears} Years Experience
                        </CardDescription>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Cooperative Society</span>
                      <span className="text-xs font-semibold text-slate-800">{selectedWorker.cooperative}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  {/* Contact & Verification Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone & Location</span>
                      <p className="font-medium text-slate-700 mt-0.5">{selectedWorker.phone}</p>
                      <p className="text-slate-500 text-[11px]">{selectedWorker.location}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Identity (Aadhaar)</span>
                      <p className="font-medium text-emerald-700 mt-0.5 flex items-center gap-1">
                        <span>🛡️</span> {selectedWorker.aadhaarStatus}
                      </p>
                      <p className="text-slate-500 text-[11px]">{selectedWorker.policeVerification}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Welfare & Insurance</span>
                      <p className="font-medium text-slate-700 mt-0.5">{selectedWorker.insuranceStatus}</p>
                      <p className="text-emerald-600 text-[11px] font-medium">Cooperative Covered</p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1.5">Claimed Skills & Endorsements</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWorker.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certificate Review Section */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Uploaded Trade Certificate</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Issued by {selectedWorker.certificate.issuedBy}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="primary" size="sm">
                          OCR Match: {selectedWorker.certificate.ocrMatchScore}%
                        </Badge>
                      </div>
                    </div>

                    {/* Certificate Meta Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-primary-50/40 rounded-lg text-xs border border-primary-100">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cert. Number</span>
                        <span className="font-semibold text-slate-900">{selectedWorker.certificate.number}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Issue Date</span>
                        <span className="text-slate-700">{selectedWorker.certificate.issuedDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Validity</span>
                        <span className="text-slate-700">{selectedWorker.certificate.expiryDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verification Check</span>
                        <span className="text-emerald-700 font-semibold">Registry Match</span>
                      </div>
                    </div>

                    {/* OCR Automated Extraction Result */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                        <span>🤖</span>
                        <span>AI / OCR Extraction Summary</span>
                      </div>
                      <p className="text-slate-600 font-mono text-[11px] leading-relaxed bg-white p-2 rounded border border-slate-200">
                        {selectedWorker.certificate.ocrSummary}
                      </p>
                    </div>

                    {/* Certificate Document Preview Placeholder */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700">Certificate Document Preview</span>
                      <div className="relative rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
                        {/* Realistic Certificate Layout Placeholder */}
                        <div className="w-full max-w-md bg-white border border-amber-300/80 p-6 rounded-lg shadow-xs text-left relative">
                          <div className="absolute top-2 right-2 opacity-15 text-5xl">🏛️</div>
                          <div className="text-center border-b border-amber-200/80 pb-2 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 block">
                              {selectedWorker.certificate.issuedBy}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 mt-1">
                              CERTIFICATE OF VOCATIONAL COMPETENCY
                            </h5>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            This certifies that <strong className="text-slate-900">{selectedWorker.name}</strong> has
                            satisfactorily completed all rigorous practical and theoretical assessments for{' '}
                            <strong className="text-slate-900">{selectedWorker.certificate.name}</strong>.
                          </p>

                          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Cert No: {selectedWorker.certificate.number}</span>
                            <span className="text-emerald-700 font-bold">DIGITALLY ACCREDITED</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <a
                            href={selectedWorker.certificate.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary-700 hover:text-primary-800 font-semibold hover:underline"
                          >
                            <span>🔍 View Original Scanned Copy</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Approve / Reject Actions Footer */}
                <CardFooter className="bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {selectedWorker.status === 'pending' ? (
                      <span>Review carefully before approving. Action updates cooperative registry.</span>
                    ) : selectedWorker.status === 'verified' ? (
                      <span className="text-emerald-700 font-medium">✓ Worker has been accredited and activated in the pool.</span>
                    ) : (
                      <span className="text-rose-700 font-medium">✗ Worker application was rejected ({selectedWorker.rejectionReason}).</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {selectedWorker.status === 'pending' ? (
                      <>
                        <Button
                          variant="danger"
                          size="md"
                          onClick={openRejectDialog}
                          leftIcon={<span>✕</span>}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="success"
                          size="md"
                          onClick={() => handleApprove(selectedWorker.id)}
                          leftIcon={<span>✓</span>}
                        >
                          Approve & Accredit
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Reset back to pending for testing
                          setWorkersList((prev) =>
                            prev.map((w) => (w.id === selectedWorker.id ? { ...w, status: 'pending' } : w))
                          );
                        }}
                      >
                        Reset to Pending
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Card className="text-center p-12 bg-white">
              <span className="text-4xl">📋</span>
              <h3 className="text-base font-semibold text-slate-800 mt-2">Select a Worker from Queue</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click on any worker from the list on the left to inspect trade documents, OCR score, and issue approval or rejection.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={`Reject Application — ${selectedWorker?.name || ''}`}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Please specify the reason for rejecting this worker&apos;s verification application. This reason will be logged and communicated to the worker&apos;s cooperative society.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Standard Rejection Reasons</label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="Document illegible or low resolution">Document illegible or low resolution</option>
              <option value="Certificate expired or invalid issuing authority">Certificate expired or invalid issuing authority</option>
              <option value="Name mismatch between Certificate and Aadhaar">Name mismatch between Certificate and Aadhaar</option>
              <option value="Trade skill does not match cooperative registration">Trade skill does not match cooperative registration</option>
              <option value="Background verification flagged unconfirmed records">Background verification flagged unconfirmed records</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Additional Specific Notes (Optional)</label>
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="e.g. Please re-upload a clear scanned PDF of the original ITI trade mark sheet."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkerVerification;
