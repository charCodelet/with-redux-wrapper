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
      <GlobalProvider theme={themes[theme]}>
        <ScrollPanel ref={ref} hasIndicator height="100%" width="100%" overflow="hidden">
            <div ref={ref} id="scrollWrapper">
              <Box style={{ zIndex: 1, position: 'sticky' }}>
                <ToolbarRenderer />
                <TabsRenderer /> 
              </Box>
              <canvas id="can" style={{zIndex: 1, display: "none", position: "absolute", border: "2px solid"}}/>
              <Component {...pageProps} />
            </div>
          </ScrollPanel> 
      </GlobalProvider>
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
