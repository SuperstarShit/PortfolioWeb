/** next.config.js (for static export) */
const nextConfig = {
  // Export entire site as static HTML/Assets
  output: 'export',

  // Keep temporary bypass for TS build errors (remove later!)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Next Image optimization requires a server; disable optimization for static export
  images: {
    unoptimized: true,
  },

  // Optional: if you prefer URLs like /about/ instead of /about.html
  // trailingSlash: true,
};

module.exports = nextConfig;
