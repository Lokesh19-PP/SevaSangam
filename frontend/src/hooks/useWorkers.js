/**
 * useWorkers Hook — SevaSangam
 * Encapsulates worker-related API calls and state.
 */
import { useState, useCallback } from 'react';
import workerApi from '../services/api/workerApi';

const useWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await workerApi.getWorkers(params);
      setWorkers(result.data || result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNearbyWorkers = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await workerApi.getNearbyWorkers(params);
      setWorkers(result.data || result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { workers, loading, error, fetchWorkers, fetchNearbyWorkers };
};

export default useWorkers;
