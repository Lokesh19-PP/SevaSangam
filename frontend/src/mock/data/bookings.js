/**
 * Mock Bookings Data — SevaSangam
 */
export const bookings = [
  {
    id: 'bkg_001',
    customerId: 'cust_001',
    workerId: 'wrk_001',
    serviceId: 'svc_001',
    status: 'completed',
    scheduledDate: '2025-08-15T10:00:00Z',
    completedDate: '2025-08-15T12:30:00Z',
    amount: 700,
    address: '123 MG Road, Pune',
    notes: 'Kitchen sink leak repair',
  },
  {
    id: 'bkg_002',
    customerId: 'cust_001',
    workerId: 'wrk_002',
    serviceId: 'svc_002',
    status: 'upcoming',
    scheduledDate: '2025-09-20T14:00:00Z',
    completedDate: null,
    amount: 500,
    address: '123 MG Road, Pune',
    notes: 'Switchboard replacement',
  },
];
