module.exports = {
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