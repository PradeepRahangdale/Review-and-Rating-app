const DEFAULT_BACKEND_URL = 'https://review-and-rating-app.onrender.com';

/**
 * Proxies /api and /uploads to the Node backend on Render.
 * Override with BACKEND_URL or VITE_API_URL on Vercel if your Render URL differs.
 */
export const config = {
  matcher: ['/api/:path*', '/uploads/:path*'],
};

export default async function middleware(request) {
  const backend = (
    process.env.BACKEND_URL ||
    process.env.VITE_API_URL ||
    DEFAULT_BACKEND_URL
  ).replace(/\/$/, '');

  const url = new URL(request.url);
  const target = `${backend}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  return fetch(target, init);
}
