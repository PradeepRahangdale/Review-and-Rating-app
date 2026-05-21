import { API_BASE } from '../config';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function getCompanies(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && String(v).trim() !== '')
  );
  const query = new URLSearchParams(clean).toString();
  return request(`/api/companies${query ? `?${query}` : ''}`);
}

export function getCompany(id) {
  return request(`/api/companies/${id}`);
}

export function createCompany(formData) {
  return request('/api/companies', { method: 'POST', body: formData });
}

export function getReviews(companyId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/api/reviews/company/${companyId}?${query}`);
}

export function createReview(payload) {
  return request('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function toggleReviewLike(reviewId, sessionId) {
  return request(`/api/reviews/${reviewId}/like`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
}
