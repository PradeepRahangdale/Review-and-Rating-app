/** Production backend on Render (override with VITE_API_URL in Vercel if different). */
export const DEFAULT_BACKEND_URL = 'https://review-and-rating-app.onrender.com';

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  || (import.meta.env.PROD ? DEFAULT_BACKEND_URL : '');
