/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  pageExtensions: ["ts", "tsx"],
  // Ensure server components can fetch from backend
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
