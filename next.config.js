/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  compiler: {
    removeConsole: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Avoid AWS SDK Node.js require issue
    if (isServer && nextRuntime === "nodejs")
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ })
      );

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "braidcustomerdocuments.s3.us-west-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
