import { wrapper } from '../state/store'
import GlobalProvider from './../pages/benchmark/GlobalProvider'
import themes from './../pages/benchmark/themes';
import { Box } from './../pages/benchmark/Base'
import { useTypedSelector } from '../hooks/useTypedSelector';
import TabsRenderer from './TabsRenderer';
import ToolbarRenderer from './Toolbar';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Modal from './Modal';
import { useRouter } from 'next/router';

const ScrollPanel = dynamic(() => import("./../pages/benchmark/ScrollPanel"), { ssr: false });
const CalculatorServer = dynamic(() => import("./Calculator"), { ssr: false });
// const Editor = dynamic(() => import("./Editor"), { ssr: false });

const WrappedApp = ({ Component, pageProps }) => {
  const router = useRouter();
  console.log(router.pathname, `--> router.pathname`);
  const { theme } = useTypedSelector((state) => state.theme);

  return (
    <> 
      <Head> 
        <title>NextJS With React Redux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <CalculatorServer />
      <Modal />
      {/* <Editor />   */}
      {/* <div id="dani"> */}
        <div id="editorContainer" />  
      {/* </div>             */}
      <ScrollPanel height="100%" width="100%" overflowY="auto" overflowX="hidden">
        <GlobalProvider theme={themes[theme]}>
          <Box style={{ zIndex: 1, position: 'sticky' }}>
            <ToolbarRenderer />
            <TabsRenderer /> 
            
          </Box>
          <Component {...pageProps} />
          <canvas id="can" style={{display: "none", position: "absolute", top: '0'/*, border: "2px solid"*/}}/>
        </GlobalProvider>
      </ScrollPanel> 
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
