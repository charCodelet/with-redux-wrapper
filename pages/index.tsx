import React, { ReactElement /*, useEffect*/ } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { GlobalProvider, themes /*, Box*/ } from '@coreym/benchmark';
import {SSRProvider} from '@react-aria/ssr'
import ToolbarRenderer from './Toolbar';
import TabsRenderer from './TabsRenderer';
import AssessmentRenderer from './Assessment';
import dynamic from "next/dynamic";
// import { useActions } from '../hooks/useActions';
// import useSWR from "swr";
import { wrapper } from '../state/store';

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  let tools = await fetch('http://localhost:3010/tools/VH447212');
  let toolsJson = await tools.json();
  store.dispatch({type: 'tools_props_success', payload: toolsJson});
  let blocks = await fetch('http://localhost:3010/blocks');
  let blocksJson = await blocks.json();
  // let nestedIdsMap = blocksJson[0].itemHeaders.map(v => v.nestedItemIds);
  // console.log(nestedIdsMap, `--> nestedIdsMap`);
  // let nestedIds = nestedIdsMap.filter(v => v);
  // console.log(nestedIds, `--> nestedIds`);
  store.dispatch({type: 'tabs_success_server_side', payload: {tabsData: blocksJson[0].itemHeaders, nestedId: 'VH447209'}});
  // console.log(store.getState(), ` --> getState`)
  let urls = await store.getState().tabs.tabsData.map(datum => `http://localhost:3010/item/${datum.id}`); // return { props: store.dispatch({type: 'tabs_success', payload: blocksJson[0].itemHeaders}) }
  let requests = await urls.map((url: RequestInfo) => fetch(url)); // map every url to the promise of the fetch
  // console.log("oh wow! I needed to put await in from of Promise.all...that made ALL the difference...");
  await Promise.all(requests).then(responses => responses).then(async responses => Promise.all(responses.map(r => r.json())).then(async data => { // Promise.all waits until all jobs are resolved
    store.dispatch({type: 'fetch_all_items', payload: data });
  })); 
})


const App: React.FC = (): ReactElement => {
  // const { createLaunch, fetchTabs, fetchStart } = useActions();
  const { theme } = useTypedSelector((state) => state.theme);
  // const { fetchAllItems } = useTypedSelector((state) => state);
  // const { data, error } = useSWR('tools/VH447212', createLaunch);
  // console.log(data, `--> data`);
  // console.log(error, `--> error`);
  // useEffect(() => {
  //   fetchStart('start');
  //   fetchTabs('blocks');
  //   createLaunch('tools/VH447212');
  // }, []);
  // const obj = {};
  // tabs && tabs.tabsData.map((v: { sequence: string | number; id: any }) => (obj[v.sequence] = v.id));
  // console.log(obj, `--> obj`);
  // console.log(theme, `--> theme`);
  // console.log(fetchAllItems, `--> fetchAllItems`);
  return ( 
    <SSRProvider>   
      <GlobalProvider theme={themes[theme]}>
        <ToolbarRenderer />
        <TabsRenderer /> 
        <AssessmentRenderer />  
      </GlobalProvider>
    </SSRProvider>
  )
}  

export default App;

// function async(arg: { store: any; }): (context: import("next-redux-wrapper").GetStaticPropsContext & { store: import("redux").Store<any, any>; }) => any {
//   throw new Error('Function not implemented.');
// }

