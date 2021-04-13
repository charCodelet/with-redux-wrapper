/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useEffect /*, useRef*/ } from 'react';
// import TabsRenderer from './TabsRenderer';
// import ToolbarConnectorNew from '../components/ToolbarNew';
// import { /*GlobalProvider, themes,*/ Box } from '@coreym/benchmark';
// import ScrollPanel from '../components/benchmark/ScrollPanel';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useActions } from '../hooks/useActions';
// import NewAssessment from '../newViews/Assessment';
import dynamic from "next/dynamic";
// import { wrapper } from '../state/store';

const App: React.FC = (): ReactElement => {
  // const ref = useRef(null);
  const { createLaunch, fetchTabs } = useActions();
  const { tabs } = useTypedSelector((state) => state);
  // const { theme } = useTypedSelector((state) => state.theme);
  // const { zoom } = useTypedSelector((state) => state.zoom);

  // const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  //   // store.dispatch(serverRenderClock(true))
  //   // store.dispatch(addCount())
  //   // store.dispatch(true)
  //   // store.dispatch(true)
  //   console.log(store, `--> store [getStaticProps]`);
  // });
  // console.log(getStaticProps);

  // const NewAssessmentDynamic = dynamic(() => import("./Assessment"), { ssr: false });
  const ToolbarNewWithCustomLoading = dynamic(
    () => import('../components/ToolbarNew'),
    { loading: () => <p>...</p> }
  )
  const TabsRendererWithCustomLoading = dynamic(
    () => import('./TabsRenderer'),
    { loading: () => <p>...</p> }
  )
  useEffect(() => {
    fetchTabs('blocks');
    createLaunch('tools/VH447212');
  }, []);

  const obj = {};
  tabs && tabs.data.map((v: { sequence: string | number; id: any }) => (obj[v.sequence] = v.id));
  return (
    // <GlobalProvider theme={themes[theme]}>
    <React.StrictMode>
      {/* <Box style={{ zIndex: 1, position: 'sticky' }}> */}
      <ToolbarNewWithCustomLoading tabNums={obj} /> 
      <TabsRendererWithCustomLoading tabNums={obj} />
      {/* <ToolbarConnectorNew tabNums={obj} />
      <TabsRenderer tabNums={obj} /> */}
      {/* </Box> */}
      {/* <NewAssessmentDynamic /> */}
      {/* <ScrollPanel ref={ref} hasIndicator height="100%" width="100%" overflow="hidden">
        <div ref={ref} id="test">
          <Box style={{ zIndex: 1, position: 'sticky' }}>
            <ToolbarConnectorNew tabNums={obj} />
            <TabsRenderer tabNums={obj} />
          </Box>
          <section style={{ zIndex: -1, transform: `scale(${zoom.toFixed(2)})` }}>
            <NewAssessment />
          </section>
        </div>
      </ScrollPanel> */}
    </React.StrictMode>
    // </GlobalProvider>
  );
};

export default App;
