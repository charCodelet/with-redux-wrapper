import React, { ReactElement } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import AssessmentRenderer from './Assessment';
import { wrapper } from '../state/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async() => {

  // console.log('is there a way to prevent this from running when we transition from /help to /...because that is what is resetting the tabs...');
  let start = await fetch('http://localhost:3010/start');
  let startJson = await start.json();
  // console.log(startJson, `--> startJson`);
  let students = await fetch('http://localhost:3010/students');
  let studentsJson = await students.json();
  // console.log(studentsJson, `--> studentsJson`);
  // let myTab = await store.getState().tabs.tabNumber;
  // let start = await fetch('http://localhost:3010/tools/VH447212');
  // let startJson = await start.json();
  let tools = await fetch('http://localhost:3010/tools/VH447212');
  let toolsJson = await tools.json();
  // console.log(toolsJson, `--> toolsJson`);
  store.dispatch({type: 'tools_props_success', payload: toolsJson});
  // console.log('guessing this is where it breaks...');
  let blocks = await fetch('http://localhost:3010/blocks');
  let blocksJson = await blocks.json();
  // console.log(blocksJson, `--> blocksJson`);
  let nestedIdsMap = blocksJson[0].itemHeaders.map(v => v.nestedItemIds);
  // console.log(nestedIdsMap, `--> nestedIdsMap`);
  let nestedIds = nestedIdsMap.filter(v => v);
  let uniqueChars = [...new Set(nestedIds.flat())];
  let blockTitle = blocksJson[0].title;
  nestedIds = uniqueChars[0];
  // console.log(nestedIds, `--> nestedIds`)
  // console.log("here??");
  store.dispatch({type: 'tabs_success_server_side', payload: {tabsData: blocksJson[0].itemHeaders, nestedId: nestedIds, blockTitle: blockTitle}});
  // console.log('how about here??')
  let urls = await store.getState().tabs.tabsData.map((datum: { id: string; }) => `http://localhost:3010/item/${datum.id}`); // return { props: store.dispatch({type: 'tabs_success', payload: blocksJson[0].itemHeaders}) }
  let requests = await urls.map((url: RequestInfo) => fetch(url)); // map every url to the promise of the fetch // console.log("oh wow! I needed to put await in from of Promise.all...that made ALL the difference...");
  // console.log(requests, `--> requests`);
  await Promise.all(requests).then(responses => responses).then(async responses => Promise.all(responses.map(r => r.json())).then(async data => { // Promise.all waits until all jobs are resolved
    console.log(data, `--> data`);
    store.dispatch({type: 'fetch_all_items', payload: data });
  })); 
})

const App: React.FC = (): ReactElement => {
  // console.log('index.tsx running?')
  const { zoom } = useTypedSelector((state) => state.zoom);
  return ( 
    <section id="pointerTest" style={{ userSelect: 'none', position: 'relative', transform: `scale(${zoom.toFixed(2)})`}}>
      <AssessmentRenderer /> 
    </section>   
  )
}  

export default App;

