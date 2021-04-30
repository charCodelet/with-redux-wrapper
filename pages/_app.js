import { wrapper } from '../state/store'
import GlobalProvider from './benchmark/GlobalProvider'
import themes from './benchmark/themes';
import { Box } from './benchmark/Base'
import { useTypedSelector } from '../hooks/useTypedSelector';
import TabsRenderer from './TabsRenderer';
import ToolbarRenderer from './Toolbar';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Modal from './Modal';
import Keyboard from './Keyboard';
import { useRouter } from 'next/router';
// import classes from './style.module.css';
// import '../style.css';

const ScrollPanel = dynamic(() => import("./benchmark/ScrollPanel"), { ssr: false });
const CalculatorServer = dynamic(() => import("./Calculator"), { ssr: false });
// const Editor = dynamic(() => import("./Editor"), { ssr: false });

const WrappedApp = ({ Component, pageProps }) => {
  const router = useRouter();
  // console.log(router.pathname, `--> router.pathname`);
  const { theme } = useTypedSelector((state) => state.theme);

  return (
    <> 
      <Head> 
        <title>NextJS With React Redux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/statics/styles.css" rel="stylesheet" />
      </Head>
      <CalculatorServer />
      <Modal />
      {/* <Editor />   */}
      <ScrollPanel height="100%" width="100%" overflowY="auto" overflowX="hidden">
        <GlobalProvider theme={themes[theme]}>
          <Box style={{ zIndex: 1, position: 'sticky' }}>
            <ToolbarRenderer />
            <TabsRenderer />         
          </Box>
          <Component {...pageProps} />
          <canvas id="can" style={{display: "none", position: "absolute", top: '0'/*, border: "2px solid"*/}}/>
          <Keyboard />
        </GlobalProvider>
      </ScrollPanel> 
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
