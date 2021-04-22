import React, { ReactElement } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
// import {SSRProvider} from '@react-aria/ssr';
import AssessmentRenderer from './Assessment';
// import useSWR from "swr";
import { wrapper } from '../state/store';


export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  let tools = await fetch('http://localhost:3010/tools/VH447212');
  let toolsJson = await tools.json();
  store.dispatch({type: 'tools_props_success', payload: toolsJson});
  let blocks = await fetch('http://localhost:3010/blocks');
  let blocksJson = await blocks.json();
  let nestedIdsMap = blocksJson[0].itemHeaders.map(v => v.nestedItemIds);
  let nestedIds = nestedIdsMap.filter(v => v);
  // console.log(nestedIds, `--> nestedIds`);
  let uniqueChars = [...new Set(nestedIds.flat())];
  // console.log(uniqueChars, `--> uniqueChars`);
  let blockTitle = blocksJson[0].title;
  nestedIds = uniqueChars[0]
  store.dispatch({type: 'tabs_success_server_side', payload: {tabsData: blocksJson[0].itemHeaders, nestedId: nestedIds, blockTitle: blockTitle}});
  let urls = await store.getState().tabs.tabsData.map((datum: { id: string; }) => `http://localhost:3010/item/${datum.id}`); // return { props: store.dispatch({type: 'tabs_success', payload: blocksJson[0].itemHeaders}) }
  let requests = await urls.map((url: RequestInfo) => fetch(url)); // map every url to the promise of the fetch // console.log("oh wow! I needed to put await in from of Promise.all...that made ALL the difference...");
  await Promise.all(requests).then(responses => responses).then(async responses => Promise.all(responses.map(r => r.json())).then(async data => { // Promise.all waits until all jobs are resolved
    console.log(data, `--> data`);
    store.dispatch({type: 'fetch_all_items', payload: data });
  })); 
})

const App: React.FC = (): ReactElement => {
  const { zoom } = useTypedSelector((state) => state.zoom);
  console.log(zoom, `--> zoom`);
  return ( 
    // <SSRProvider>     
      <section id="pointerTest" style={{ /*overflow: 'hidden',*/ position: 'relative', transform: `scale(${zoom.toFixed(2)}) translate(${zoom.toFixed(2)}rem)`}}>
        <AssessmentRenderer /> 
      </section>   
  //  </SSRProvider>
  )
}  

export default App;

