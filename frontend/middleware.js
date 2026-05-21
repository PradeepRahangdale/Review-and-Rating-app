/**
 * Proxies /api and /uploads to the Node backend on Render.
 * Set BACKEND_URL or VITE_API_URL in Vercel → Environment Variables (no trailing slash).
 */
export const config = {
  matcher: ['/api/:path*', '/uploads/:path*'],
};

export default async function middleware(request) {
  const backend = (process.env.BACKEND_URL || process.env.VITE_API_URL || '').replace(/\/$/, '');

  if (!backend) {
    return Response.json(
      {
        message:
          'Backend not configured. Set BACKEND_URL (or VITE_API_URL) on Vercel to your Render URL, then redeploy.',
      },
      { status: 503 }
    );
  }

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
