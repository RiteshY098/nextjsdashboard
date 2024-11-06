// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig;

const nextConfig = {
  // Enable React Strict Mode (helps with debugging)
  reactStrictMode: true,

  // If your app is deployed under a subpath like /my-app, you can set a basePath
  // basePath: '/my-app', 

  // Add custom redirects or rewrites if needed
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },

  // Environment variables (for example, API URL, etc.)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' || 'https://nextjsdashboard-seven-pi.vercel.app',
  },

  // Custom headers (for example, to prevent caching)
  async headers() {
    return [
      {
        source: '/login',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
