/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.upbit.com",
        port: "",
        pathname: "/logos/**",
      },
    ],
  },
};

export default nextConfig;
