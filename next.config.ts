import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Short links used in outreach emails so every link matches the sending domain
      { source: "/go/facebook", destination: "https://www.facebook.com/TheUrbanSlide", permanent: false },
    ];
  },
};

export default nextConfig;
