const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lavender-advisory-lamprey-101.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};
