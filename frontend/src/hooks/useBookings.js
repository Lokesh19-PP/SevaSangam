/**
 * useBookings Hook — SevaSangam
 * Encapsulates booking-related API calls and state.
 */
import { useState, useCallback } from 'react';
import bookingApi from '../services/api/bookingApi';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingApi.getBookings(params);
      setBookings(result.data || result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingApi.createBooking(data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookings, loading, error, fetchBookings, createBooking };
};

export default useBookings;
