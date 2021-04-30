module.exports = {
  // webpack: (config, options) => {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: [
  //       options.defaultLoaders.babel,
  //       {
  //         loader: 'svg-inline-loader',
  //         // options: pluginOptions.options,
  //       },
  //     ],
  //   })
  //   return config
  // },
  async redirects() {
    return [
      {
        source: '/help',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
