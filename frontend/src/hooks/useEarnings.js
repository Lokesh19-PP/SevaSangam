/**
 * useEarnings Hook — SevaSangam
 * Encapsulates worker earnings, completed jobs, payout breakdown, and cooperative welfare contribution.
 */
import { useState, useCallback, useMemo } from 'react';
import bookingApi from '../services/api/bookingApi';
import paymentApi from '../services/api/paymentApi';

const useEarnings = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      // Fetch completed bookings for earnings calculations
      const bookingResult = await bookingApi.getBookings({ status: 'completed', ...params });
      const bookingList = bookingResult.data || bookingResult;
      setCompletedBookings(Array.isArray(bookingList) ? bookingList : []);

      // Also attempt to fetch payment history
      try {
        const paymentResult = await paymentApi.getPaymentHistory(params);
        const paymentList = paymentResult.data || paymentResult;
        setPayments(Array.isArray(paymentList) ? paymentList : []);
      } catch (e) {
        // Fallback to empty payments list if not available
        setPayments([]);
      }
      return bookingList;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute metrics using the T&M-aware cooperative payout formula:
  //   Tools & Materials amount = gross × 20% (only if toolsMaterialsRequired === true)
  //   Worker Base             = gross + toolsAmt
  //   Cooperative Admin (5%) = workerBase × 5%
  //   Worker Gets            = workerBase − adminAmt
  const metrics = useMemo(() => {
    const list = completedBookings || [];
    let grossTotal = 0;
    let netWorkerTotal = 0;
    let thisMonthGross = 0;
    let thisMonthNet = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const jobsWithPayout = list.map((job) => {
      const gross = Number(job.amount) || 0;
      grossTotal += gross;

      // T&M surcharge: worker earns 20% of gross when tools/materials were provided
      const toolsAmt = job.toolsMaterialsRequired ? Math.round(gross * 0.20) : 0;
      const workerBase = gross + toolsAmt;

      // Cooperative admin deduction (5% of worker base)
      const adminAmt = Math.round(workerBase * 0.05);
      const workerGets = workerBase - adminAmt;
      netWorkerTotal += workerGets;

      // Check if job completed this month
      if (job.completedDate || job.scheduledDate) {
        const d = new Date(job.completedDate || job.scheduledDate);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          thisMonthGross += gross;
          thisMonthNet += workerGets;
        }
      }

      return {
        ...job,
        gross,
        toolsAmt,
        workerBase,
        adminAmt,
        workerGets,
        // Legacy alias kept for backwards compat with any other consumer
        workerPayout: workerGets,
        welfareContribution: toolsAmt,
        platformFee: adminAmt,
        payoutStatus: job.paymentStatus === 'paid' ? 'Paid' : 'Processing',
        payoutMethod: 'UPI / Direct Bank Transfer',
      };
    });

    return {
      totalJobs: list.length,
      grossTotal,
      netTotal: netWorkerTotal,
      thisMonthNet,
      // totalWelfareFund kept for metric card; represents total T&M amounts earned this period
      totalWelfareFund: list.reduce((sum, job) => {
        const gross = Number(job.amount) || 0;
        return sum + (job.toolsMaterialsRequired ? Math.round(gross * 0.20) : 0);
      }, 0),
      jobsWithPayout,
    };
  }, [completedBookings]);

  return {
    completedBookings,
    payments,
    metrics,
    loading,
    error,
    fetchEarnings,
  };
};

export default useEarnings;
