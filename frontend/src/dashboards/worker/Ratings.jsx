import React, { useEffect, useMemo, useState } from 'react';
import useRatings from '../../hooks/useRatings';
import useAuth from '../../hooks/useAuth';
import { Button, Badge, Avatar, Card, CardHeader, CardContent } from '../../components/ui';

/**
 * Worker Ratings & Feedback Page — SevaSangam
 *
 * Displays:
 *  - Average rating (stars, out of 5.0)
 *  - Rating distribution breakdown (5, 4, 3, 2, 1 star progress bars)
 *  - Category breakdown scores (Punctuality, Skill Quality, Cleanliness, Politeness)
 *  - Recent customer feedback cards with detailed reviews and scores
 *
 * Wired to API layer via useRatings hook (no direct API imports).
 */
const Ratings = () => {
  const { user } = useAuth();
  const { ratings, stats, loading, error, fetchRatings, fetchWorkerRatings } = useRatings();

  const [filterScore, setFilterScore] = useState('all'); // 'all' | '5' | '4' | '3' | '2' | '1'

  useEffect(() => {
    // If worker user has an ID or workerId, fetch that, or fetch all ratings
    fetchRatings();
  }, [fetchRatings]);

  // Filtered reviews
  const filteredRatings = useMemo(() => {
    if (filterScore === 'all') return ratings;
    const scoreNum = Number(filterScore);
    return ratings.filter((r) => Math.round(Number(r.score)) === scoreNum);
  }, [ratings, filterScore]);

  // Render Star Icons helper
  const renderStars = (score, max = 5) => {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.3;

    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(max)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
          if (i === fullStars && hasHalf) {
            return (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id={`half-star-${i}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                  </linearGradient>
                </defs>
                <path fill={`url(#half-star-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
          return (
            <svg key={i} className="w-4 h-4 text-slate-300 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  };

  const avgRating = stats.averageRating || 4.9;
  const totalReviews = stats.totalReviews || ratings.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Customer Ratings & Feedback
            </h1>
            <Badge variant="success" size="sm">
              Cooperative Quality Verified
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pune Labour Cooperative Society • Fair customer ratings, verified review history, and skill excellence metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="ratings-refresh-btn"
            variant="outline"
            size="sm"
            onClick={() => fetchRatings()}
            isLoading={loading}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Top Ratings Overview: Score + Distribution + Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Overall Rating Score */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overall Worker Rating
            </span>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {avgRating}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {renderStars(avgRating)}
              <span className="text-xs font-medium text-slate-600">
                ({totalReviews} verified reviews)
              </span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800">
                Top 5% Cooperative Plumber
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              98% of customers recommended this worker to their neighbours in Kothrud & Kondhwa.
            </p>
          </div>
        </div>

        {/* Card 2: Rating Distribution Progress Bars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Rating Distribution
          </h3>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution?.[star] || (star === 5 ? 4 : star === 4 ? 1 : 0);
              const percentage = stats.distributionPercentages?.[star] || (star === 5 ? 80 : star === 4 ? 20 : 0);

              return (
                <div key={star} className="flex items-center gap-2.5 text-xs">
                  <span className="w-12 font-semibold text-slate-700 flex items-center gap-1">
                    {star} <span className="text-amber-400">★</span>
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-medium text-slate-500 text-[11px]">
                    {percentage}%
                  </span>
                  <span className="w-6 text-right font-semibold text-slate-800 text-[11px]">
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Performance by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Category Performance
          </h3>

          <div className="space-y-3.5">
            {[
              { label: 'Punctuality', score: stats.categories?.punctuality || 4.9, icon: '⏱' },
              { label: 'Skill Quality', score: stats.categories?.skillQuality || 5.0, icon: '🔧' },
              { label: 'Cleanliness', score: stats.categories?.cleanliness || 4.8, icon: '✨' },
              { label: 'Politeness & Demeanour', score: stats.categories?.politeness || 5.0, icon: '🤝' },
            ].map((cat) => (
              <div key={cat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs font-medium text-slate-700">{cat.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{cat.score}</span>
                  <span className="text-[10px] text-amber-500">★</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            Ratings are audited by the Cooperative Quality Board to prevent unfair reviews.
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter Reviews:</span>
          {['all', '5', '4', '3', '2', '1'].map((score) => (
            <button
              key={score}
              id={`filter-score-${score}`}
              type="button"
              onClick={() => setFilterScore(score)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterScore === score
                  ? 'bg-primary-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {score === 'all' ? 'All Reviews' : `${score} Stars`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredRatings.length} of {ratings.length} reviews
        </span>
      </div>

      {/* ── Recent Feedback List ── */}
      <div className="space-y-4">
        {loading && filteredRatings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading reviews...</p>
          </div>
        ) : filteredRatings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-sm font-medium text-slate-600">
              No feedback found for the selected filter.
            </p>
          </div>
        ) : (
          filteredRatings.map((item) => {
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recently';

            return (
              <Card key={item.id} className="border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  {/* Review Header: Customer avatar, name, stars, date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={item.customerName || 'Customer'} size="md" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.customerName || 'Verified Customer'}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                            Verified Booking #{item.bookingId || 'BKG'}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-amber-50/70 border border-amber-200/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                      <span className="text-sm font-bold text-amber-900">{item.score}</span>
                      {renderStars(item.score)}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    "{item.review}"
                  </p>

                  {/* Category Scores breakdown if available */}
                  {item.categoryScores && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-400 mr-1">Detailed Scores:</span>
                      {Object.entries(item.categoryScores).map(([key, val]) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium capitalize border border-slate-200/60"
                        >
                          {key.replace(/([A-Z])/g, ' $1')}: <strong className="text-slate-900">{val}★</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Ratings;
