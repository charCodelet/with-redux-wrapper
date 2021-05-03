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


const ScrollPanel = dynamic(() => import("./benchmark/ScrollPanel"), { ssr: false });
const CalculatorServer = dynamic(() => import("./Calculator"), { ssr: false });
// const Editor = dynamic(() => import("./Editor"), { ssr: false });

const WrappedApp = ({ Component, pageProps }) => {
  console.log(pageProps, `--> pageProps`);
  const router = useRouter();
  // console.log(router.pathname, `--> router.pathname`);
  const { theme } = useTypedSelector((state) => state.theme);
  return (
    <> 
      <Head> 
        <title>NextJS With React Redux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/statics/styles.css" rel="stylesheet" />
        <link href="/katex/styles.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.5/dist/katex.min.css" integrity="sha384-L+Gq2Cso/Y2x8fX4wausgiZT8z0QPZz7OqPuz4YqAycQJyrJT9NRLpjFBD6zlOia" crossorigin="anonymous"/>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.5/dist/katex.min.js" integrity="sha384-z64WtjpyrKFsxox9eI4SI8eM9toXdoYeWb5Qh+8PO+eG54Bv9BZqf9xNhlcLf/sA" crossorigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.5/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossorigin="anonymous" onload="renderMathInElement(document.body);"></script>
      </Head>
      {/* <CalculatorServer model='30MV' model2='30XS' model3='30mv'/> */}
      <CalculatorServer model='108' model2='108' model3='108'/>
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
          <div id="editorContainer"></div>
          <Keyboard />
        </GlobalProvider>
      </ScrollPanel> 
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
