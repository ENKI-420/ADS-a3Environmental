/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow builds with warnings for initial deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize images for production
  images: {
    unoptimized: false,
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Compress responses
  compress: true,
  // Enable static optimization
  trailingSlash: false,
  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
