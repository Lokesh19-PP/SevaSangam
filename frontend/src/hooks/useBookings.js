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

  const updateBookingStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingApi.updateBookingStatus(id, status);
      const updated = result.data || result;
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updated, status } : b))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingApi.cancelBooking(id, reason);
      const updated = result.data || result;
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updated, status: 'cancelled' } : b))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingApi.getUpcomingBookings(params);
      const data = result.data || result;
      setBookings(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookingHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingApi.getBookingHistory(params);
      const data = result.data || result;
      setBookings(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    setBookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    fetchUpcomingBookings,
    fetchBookingHistory,
  };
};

export default useBookings;

