import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import CompanyLogo from '../components/CompanyLogo';
import StarRating from '../components/StarRating';
import AddReviewModal from '../components/AddReviewModal';
import { PinIcon, ChevronDownIcon } from '../components/Icons';
import { getCompany, getReviews, toggleReviewLike } from '../services/api';
import { formatDate, formatDateTime, getSessionId } from '../utils/format';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);
  const sessionId = getSessionId();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [companyRes, reviewsRes] = await Promise.all([
        getCompany(id),
        getReviews(id, { sortBy }),
      ]);
      setCompany(companyRes.company);
      setReviews(reviewsRes.reviews || []);
      setAvgRating(reviewsRes.avgRating || 0);
      setCount(reviewsRes.count || 0);
    } catch {
      setCompany(null);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [id, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async (reviewId) => {
    try {
      const updated = await toggleReviewLike(reviewId, sessionId);
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? updated : r)));
    } catch {
      /* ignore */
    }
  };

  const handleShare = async (review) => {
    const text = `${review.reviewerName}: ${review.subject} — ${review.reviewText}`;
    if (navigator.share) {
      await navigator.share({ title: review.subject, text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Review copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="page page-detail">
        <Header search={headerSearch} onSearchChange={setHeaderSearch} />
        <main className="container main-content">
          <p className="loading-text">Loading...</p>
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="page page-detail">
        <Header search={headerSearch} onSearchChange={setHeaderSearch} />
        <main className="container main-content">
          <p className="empty-text">Company not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page page-detail">
      <Header search={headerSearch} onSearchChange={setHeaderSearch} />

      <main className="container main-content">
        <div className="detail-panel">
          <section className="company-detail-card">
            <CompanyLogo company={company} size="xl" />
            <div className="company-detail-info">
              <span className="founded-label detail-founded">
                Founded on {formatDate(company.foundedOn)}
              </span>
              <h1>{company.name}</h1>
              <p className="company-address">
                <PinIcon className="address-pin" />
                {company.location}
              </p>
              <div className="company-rating-row">
                <strong>{avgRating}</strong>
                <StarRating value={avgRating} size="sm" />
                <span className="review-count">{count} Reviews</span>
              </div>
            </div>
            <button type="button" className="btn btn-add-review" onClick={() => setShowAddReview(true)}>
              + Add Review
            </button>
          </section>

          <div className="detail-divider" />

          <div className="reviews-section">
            <div className="reviews-toolbar">
              <p className="result-count">Result Found : {count}</p>
              <label className="filter-field sort-field inline">
                <span>Sort:</span>
                <div className="select-wrap">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="relevance">Relevance</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </label>
            </div>

            <ul className="review-list">
              {reviews.map((review) => (
                <li key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="avatar">{review.reviewerName.charAt(0)}</div>
                      <div>
                        <strong>{review.reviewerName}</strong>
                        <span>{formatDateTime(review.createdAt)}</span>
                      </div>
                    </div>
                    <StarRating value={review.rating} size="sm" />
                  </div>
                  <p className="review-text">{review.reviewText}</p>
                  <div className="review-actions">
                    <button
                      type="button"
                      className={`action-btn ${review.likedBy?.includes(sessionId) ? 'active' : ''}`}
                      onClick={() => handleLike(review._id)}
                    >
                      👍 Like ({review.likes || 0})
                    </button>
                    <button type="button" className="action-btn" onClick={() => handleShare(review)}>
                      ↗ Share
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {reviews.length === 0 && (
              <p className="empty-text">No reviews yet. Be the first to add one.</p>
            )}
          </div>
        </div>
      </main>

      <AddReviewModal
        open={showAddReview}
        onClose={() => setShowAddReview(false)}
        companyId={id}
        onSuccess={fetchData}
      />
    </div>
  );
}
