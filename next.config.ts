import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'postimg.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.vintageliquorkenya.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.mafrservices.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.shoprite.co.za', pathname: '/**' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 's3-eu-west-1.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'thev.bar', pathname: '/**' },
      { protocol: 'https', hostname: 'afrovibesltd.com', pathname: '/**' },
      { protocol: 'https', hostname: 'mybigorder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'tuma250.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;