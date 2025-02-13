/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Fixed API Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          'http://children-point.ap-southeast-1.elasticbeanstalk.com:8081/:path*', // Removed /api/v1 here
      },
    ];
  },

  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  // Uncomment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  // ✅ SVGR Configuration
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
