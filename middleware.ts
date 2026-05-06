export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/reports/:path*',
    '/api/modules/:path*',
    '/api/tests/:path*',
    '/api/reports/:path*',
    '/api/notifications/:path*',
    '/api/stats/:path*',
  ],
};
