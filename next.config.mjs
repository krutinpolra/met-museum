/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: "https://user-api-neon-five.vercel.app/api/user",
  },
};

export default nextConfig;
