import { wrapper } from '../state/store'
import GlobalProvider from './benchmark/GlobalProvider'
import themes from './benchmark/themes';
import { Box } from './benchmark/Base'
import { useTypedSelector } from '../hooks/useTypedSelector';
import TabsRenderer from './TabsRenderer';
import ToolbarRenderer from './Toolbar';
import dynamic from 'next/dynamic';
import Modal from './Modal';
import Keyboard from './Keyboard';
import Scratchpad from './Scratchpad';
import { SSRProvider } from '@react-aria/ssr';

const ScrollPanel = dynamic(() => import("./benchmark/ScrollPanel"), { ssr: false });
const CalculatorServer = dynamic(() => import("./Calculator"), { ssr: false });
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const WrappedApp = ({ Component, pageProps }) => {
  const { theme } = useTypedSelector((state) => state.theme);
  const { tabs } = useTypedSelector((state) => state);
  const handleMouseMove = ({pageX, pageY}) => console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Mouse X: ${pageX}, Mouse Y: ${pageY})}`);

  return (
    <main /*onMouseMove={handleMouseMove}*/> 
      <SSRProvider>
        {/* <CalculatorServer model='30MV' model2='30XS' model3='30mv'/> */}
        <CalculatorServer model='108' model2='108' model3='108'/>  
        <Modal />
        <Editor />  
        <ScrollPanel height="100%" width="100%" overflowY="auto" overflowX="hidden">
          <GlobalProvider theme={themes[theme]}>
            <Box style={{ zIndex: 1, position: 'sticky' }}>
              <ToolbarRenderer />
              <TabsRenderer />         
            </Box>
            <Component {...pageProps} />
            <Scratchpad />
            <Keyboard />
          </GlobalProvider>
        </ScrollPanel> 
      </SSRProvider>
    </main>
  )
}

export default wrapper.withRedux(WrappedApp)
