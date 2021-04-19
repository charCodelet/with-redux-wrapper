import { wrapper } from '../state/store'
import Head from 'next/head';
import dynamic from "next/dynamic";

const CalculatorServer = dynamic(() => import("./Calculator"), { ssr: false });

const WrappedApp = ({ Component, pageProps }) => {
  return (
    <> 
      <Head>
        <title>NextJS With React Redux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <CalculatorServer />
      <Component {...pageProps} />
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
