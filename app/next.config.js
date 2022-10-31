/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    images: {
      unoptimized: true,
    }
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"]
    .map((extension) => {
      const prefixes = process.env.NEXT_PUBLIC_ENV == 'dev' ? ["dev", "prod"] : ["prod"];
      return [
        ...prefixes.map((prefix) => `${prefix}.${extension}`),
        extension
      ];
    }).flat(),
}

module.exports = nextConfig
