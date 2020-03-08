const webpack = require('webpack')
const withCSS = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const config = require('./config')

// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = file => {}
// }

const { GITHUB_OAUTH_URL, OAUTH_URL } = config
module.exports = withBundleAnalyzer(
  withCSS({
    webpack(config) {
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
      return config
    },
    publicRuntimeConfig: {
      GITHUB_OAUTH_URL,
      OAUTH_URL
    },
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: './bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: './bundles/client.html'
      }
    }
  })
)
