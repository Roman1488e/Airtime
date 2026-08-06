/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Metadatani sozlash
  experimental: {
    // Next.js 15.3.0 da mavjud bo'lgan eksperimental xususiyatlar
    optimizePackageImports: ["lucide-react"],
  },
  // serverComponentsExternalPackages o'rniga serverExternalPackages ishlatiladi
  env: { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://airtime.uz" },
};

export default nextConfig;
