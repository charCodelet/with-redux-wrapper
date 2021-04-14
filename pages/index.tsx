import React, { ReactElement, useEffect } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { GlobalProvider, themes /*, Box*/ } from '@coreym/benchmark';
import ToolbarRenderer from './Toolbar';
import TabsRenderer from './TabsRenderer';
import AssessmentRenderer from './Assessment';
import { useActions } from '../hooks/useActions';
// import dynamic from "next/dynamic";
// import useSWR from "swr";
// import { wrapper } from '../state/store';
// export const getStaticProps = wrapper.getStaticProps(/*async ({ store }*/context => {
//   // console.log(store, `--> store`);
//   const {params} = context;
//   console.log(params)
// });

// export async function getStaticProps(context: { params: any; }) {
//   const {params} = context;
//   console.log(params, `--> params`);
//   return {
//     props: {
//       firstOne: 'hi'
//     }
//   }
// }

const App: React.FC = (): ReactElement => {
  const { createLaunch, fetchTabs } = useActions();
  // const { tabs } = useTypedSelector((state) => state);
  const { theme } = useTypedSelector((state) => state.theme);
  // const { data, error } = useSWR('tools/VH447212', createLaunch);
  // console.log(data, `--> data`);
  // console.log(error, `--> error`);
  // console.log(props, `--> props`);
  // const ToolbarNewWithCustomLoading = dynamic(
  //   () => import('./Toolbar'),
  //   { ssr: false }
  //   // { loading: () => <p>...</p> }
  // )
  // const TabsRendererWithCustomLoading = dynamic(
  //   () => import('./TabsRenderer'),
  //   { ssr: false }
  //   // { loading: () => <p>...</p> }
  // )
  // const AssessmentRendererWithCustomLoading = dynamic(
  //   () => import('./Assessment'),
  //   { ssr: false }
  //   // { loading: () => <p>...</p> }
  // )
  useEffect(() => {
    fetchTabs('blocks');
    createLaunch('tools/VH447212');
  }, []);

  const obj = {};
  return (
    <GlobalProvider theme={themes[theme]}>
      <React.StrictMode>
        <ToolbarRenderer tabNums={obj} />
        <TabsRenderer tabNums={obj} />
        <AssessmentRenderer />
        {/* <ToolbarNewWithCustomLoading tabNums={obj} /> 
        <TabsRendererWithCustomLoading tabNums={obj} /> */}
        {/* <AssessmentRendererWithCustomLoading /> */}
      </React.StrictMode>
    </GlobalProvider>
  )
}  

export default App;
