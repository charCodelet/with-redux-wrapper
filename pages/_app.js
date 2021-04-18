import { wrapper } from '../state/store'

const WrappedApp = ({ Component, pageProps }) => {
  return (
      <Component {...pageProps} />
  )
}

export default wrapper.withRedux(WrappedApp)
