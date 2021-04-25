import { useRef } from 'react';
import { wrapper } from '../state/store'
import { GlobalProvider, themes, Box } from '@coreym/benchmark';
import { useTypedSelector } from '../hooks/useTypedSelector';
import TabsRenderer from './TabsRenderer';
import ToolbarRenderer from './Toolbar';
import Head from 'next/head';
import dynamic from "next/dynamic";

const ScrollPanel = dynamic(() => import("./../pages/benchmark/ScrollPanel"), { ssr: false });
const CalculatorServer = dynamic(() => import("./Calculator"), { ssr: false });

const WrappedApp = ({ Component, pageProps }) => {
  const ref = useRef(null);
  const { theme } = useTypedSelector((state) => state.theme);
  return (
    <> 
      <Head>
        <title>NextJS With React Redux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <CalculatorServer />
      <ScrollPanel ref={ref} height="100%" width="100%" overflowY="auto" overflowX="hidden">
        <GlobalProvider theme={themes[theme]}>
          <div style={{userSelect: 'none'}} ref={ref} id="scrollWrapper">
            <Box id="bear" style={{ zIndex: 1, position: 'sticky', overflowY: 'auto', overflowX: 'hidden' }}>
              <ToolbarRenderer />
              <TabsRenderer /> 
            </Box>
            <Component {...pageProps} />
            <canvas id="can" style={{display: "none", position: "absolute", top: '0', border: "2px solid"}}/>
          </div>  
        </GlobalProvider>
      </ScrollPanel> 
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
