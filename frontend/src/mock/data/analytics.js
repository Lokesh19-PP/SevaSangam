/**
 * Mock Analytics Data — SevaSangam
 * Dashboard analytics reflecting cooperative metrics, workforce utilization,
 * fair distribution indices, emergency turnaround, and cooperative revenue.
 */
export const analytics = {
  overview: {
    totalWorkers: 156,
    activeWorkersNow: 48,
    verifiedWorkersPercent: 96.2,
    totalCustomers: 894,
    totalBookings: 2180,
    activeBookings: 32,
    completedBookings: 2045,
    averageRating: 4.8,
    emergencyResponseAvgMinutes: 14.2,
    totalRevenueGross: 1845000,
    workerPayoutTotal: 1568250, // 85% paid to workers
    welfareFundTotal: 184500, // 10% reserved for worker insurance & welfare
    cooperativeFairDistributionIndex: 0.92, // 1.0 = perfectly even job distribution
  },

  monthlyBookings: [
    { month: 'Oct', count: 180, revenue: 153000 },
    { month: 'Nov', count: 240, revenue: 204000 },
    { month: 'Dec', count: 310, revenue: 263500 },
    { month: 'Jan', count: 390, revenue: 331500 },
    { month: 'Feb', count: 480, revenue: 408000 },
    { month: 'Mar', count: 580, revenue: 485000 },
  ],

  topServices: [
    { name: 'Plumbing & Water Systems', bookings: 540, growth: '+28%' },
    { name: 'Electrical Repair & Wiring', bookings: 490, growth: '+22%' },
    { name: 'Home Deep Cleaning', bookings: 410, growth: '+35%' },
    { name: 'Appliance Repair & Servicing', bookings: 330, growth: '+18%' },
    { name: 'Carpentry & Woodwork', bookings: 220, growth: '+12%' },
    { name: 'Elderly Care & Patient Aide', bookings: 190, growth: '+42%' },
  ],

  zoneWorkforceUtilization: [
    { zone: 'Kothrud / Karve Nagar', activeWorkers: 18, pendingJobs: 5, fairScore: 94 },
    { zone: 'Shivaji Nagar / Deccan', activeWorkers: 14, pendingJobs: 4, fairScore: 91 },
    { zone: 'Kharadi / Viman Nagar', activeWorkers: 12, pendingJobs: 6, fairScore: 89 },
    { zone: 'Kondhwa / Wanowrie', activeWorkers: 10, pendingJobs: 3, fairScore: 93 },
    { zone: 'Hinjawadi / Wakad', activeWorkers: 16, pendingJobs: 7, fairScore: 88 },
  ],

  cooperativeFairDistributionSummary: {
    status: 'Optimal Balance',
    description: 'AI-based matching has distributed 84% of incoming jobs within ±1.5 jobs deviation per verified cooperative worker.',
    underutilizedWorkers: 4,
    balancedWorkers: 138,
    maxCapacityWorkers: 14,
  },
};
