import { useState } from 'react';
import Modal from './Modal';
import StarRating from './StarRating';
import { createReview } from '../services/api';

export default function AddReviewModal({ open, onClose, companyId, onSuccess }) {
  const [form, setForm] = useState({
    reviewerName: '',
    subject: '',
    reviewText: '',
    rating: 4,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createReview({ companyId, ...form, rating: Number(form.rating) });
      setForm({ reviewerName: '', subject: '', reviewText: '', rating: 4 });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="Add Review" onClose={onClose}>
      <form className="figma-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label className="figma-field">
          <span>Full Name</span>
          <input
            name="reviewerName"
            value={form.reviewerName}
            onChange={handleChange}
            placeholder="Enter"
            required
          />
        </label>

        <label className="figma-field">
          <span>Subject</span>
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Enter" required />
        </label>

        <label className="figma-field">
          <span>Enter your Review</span>
          <textarea
            name="reviewText"
            value={form.reviewText}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            required
          />
        </label>

        <div className="figma-rating-block">
          <span className="rating-heading">Rating</span>
          <StarRating
            value={form.rating}
            interactive
            showLabel
            size="lg"
            onChange={(rating) => setForm((p) => ({ ...p, rating }))}
          />
        </div>

        <button type="submit" className="btn btn-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Modal>
  );
}
