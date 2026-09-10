/**
 * useRatings Hook — SevaSangam
 * Encapsulates rating-related API calls and distribution analysis.
 */
import { useState, useCallback, useMemo } from 'react';
import ratingApi from '../services/api/ratingApi';

const useRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ratingApi.getRatings(params);
      const data = result.data || result;
      setRatings(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorkerRatings = useCallback(async (workerId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ratingApi.getWorkerRatings(workerId);
      const data = result.data || result;
      setRatings(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitRating = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ratingApi.submitRating(data);
      const newRating = result.data || result;
      setRatings((prev) => [newRating, ...prev]);
      return newRating;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute stats: average, total, distribution (5, 4, 3, 2, 1), category scores
  const stats = useMemo(() => {
    if (!ratings || ratings.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        distributionPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categories: { punctuality: 0, skillQuality: 0, cleanliness: 0, politeness: 0 },
      };
    }

    const total = ratings.length;
    let sum = 0;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const catSums = { punctuality: 0, skillQuality: 0, cleanliness: 0, politeness: 0 };
    let catCount = 0;

    ratings.forEach((r) => {
      const score = Number(r.score) || 5;
      sum += score;
      const rounded = Math.min(5, Math.max(1, Math.round(score)));
      dist[rounded] = (dist[rounded] || 0) + 1;

      if (r.categoryScores) {
        catSums.punctuality += Number(r.categoryScores.punctuality) || score;
        catSums.skillQuality += Number(r.categoryScores.skillQuality) || score;
        catSums.cleanliness += Number(r.categoryScores.cleanliness) || score;
        catSums.politeness += Number(r.categoryScores.politeness) || score;
        catCount++;
      }
    });

    const avg = Number((sum / total).toFixed(1));
    const distPct = {};
    Object.keys(dist).forEach((star) => {
      distPct[star] = Math.round((dist[star] / total) * 100);
    });

    const divisor = catCount || total;
    const categories = {
      punctuality: Number((catSums.punctuality / divisor).toFixed(1)),
      skillQuality: Number((catSums.skillQuality / divisor).toFixed(1)),
      cleanliness: Number((catSums.cleanliness / divisor).toFixed(1)),
      politeness: Number((catSums.politeness / divisor).toFixed(1)),
    };

    return {
      averageRating: avg,
      totalReviews: total,
      distribution: dist,
      distributionPercentages: distPct,
      categories,
    };
  }, [ratings]);

  return {
    ratings,
    stats,
    loading,
    error,
    fetchRatings,
    fetchWorkerRatings,
    submitRating,
  };
};

export default useRatings;
