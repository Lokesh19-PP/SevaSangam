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

  // Compute metrics: gross amount, net worker payout (85%), cooperative welfare fee (10%), platform fee (5%)
  const metrics = useMemo(() => {
    const list = completedBookings || [];
    let grossTotal = 0;
    let thisMonthGross = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const jobsWithPayout = list.map((job) => {
      const gross = Number(job.amount) || 0;
      grossTotal += gross;

      // Check if job completed this month
      if (job.completedDate || job.scheduledDate) {
        const d = new Date(job.completedDate || job.scheduledDate);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          thisMonthGross += gross;
        }
      }

      // Cooperative transparent split:
      // 85% directly to worker
      // 10% cooperative welfare & health/accident insurance pool (PMSBY/PMJJBY)
      // 5% platform administrative operations
      const workerPayout = Math.round(gross * 0.85);
      const welfareContribution = Math.round(gross * 0.10);
      const platformFee = Math.round(gross * 0.05);

      return {
        ...job,
        gross,
        workerPayout,
        welfareContribution,
        platformFee,
        payoutStatus: job.paymentStatus === 'paid' ? 'Paid' : 'Processing',
        payoutMethod: 'UPI / Direct Bank Transfer',
      };
    });

    const netTotal = Math.round(grossTotal * 0.85);
    const thisMonthNet = Math.round(thisMonthGross * 0.85);
    const totalWelfareFund = Math.round(grossTotal * 0.10);

    return {
      totalJobs: list.length,
      grossTotal,
      netTotal,
      thisMonthNet,
      totalWelfareFund,
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
