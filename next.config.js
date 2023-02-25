/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // webpack: function (config, options) {
  //   config.experiments = { asyncWebAssembly: true, };
  //   return config;
  // },
  // experiments: {
  //   topLevelAwait: true
  // },
  // future: {
  //   webpack5: true
  // },
  webpack: function (config, options) {
    console.log(options.webpack.version); // 5.18.0
    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    };
    return config;
  }
}

module.exports = nextConfig
