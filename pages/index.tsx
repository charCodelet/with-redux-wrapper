import React, { ReactElement, useState, useEffect, useCallback, useRef } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useActions } from '../hooks/useActions';
import AssessmentRenderer from './Assessment';
import { wrapper } from '../state/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async() => {
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


// const [isVisible, setVisibility] = useState(false)

  // const onKeyDown = useCallback((event) => { console.log(event) }, [])

  // handleToggle((isVisible) => {
  //   if (isVisible) window.addEventListener('keydown', onKeyDown)
  //   else window.removeEventListener('keydown', onKeyDown)
  // })

  // return (
  //   <button onClick={() => setVisibility(!isVisible)}>Click me!</button>
  // )

let arrX: any = [];
let arrY: any = [];
let arrXY: any = [];

const App: React.FC = (): ReactElement => {
  // console.log('index.tsx running?');
  // const dispatch = useDispatch()
  const { 
    // collectMouseMovements, // this did not work so well -- too much data to process in real time, as a result, the timer was being slowed, however slightly. Thus, I opted to batch...
    collectMouseMovementsInBatch 
  } = useActions(); 
  const [isVisible, setVisibility] = useState(false)
  const { zoom } = useTypedSelector(state => state.zoom);
  const { tabs } = useTypedSelector(state => state);
  const ref = useRef(null);

  const sendBatchedCoords = () => {
    collectMouseMovementsInBatch(arrXY);
    arrXY = [];
    arrX = [];
    arrY = [];
  }
  const onMouseMove = useCallback(e => { 
    // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Mouse X: ${e.pageX}, Mouse Y: ${e.pageY})}`);
    arrX.push(e.pageX);
    arrY.push(e.pageY);
    arrXY = arrX.concat(arrY);
  }, []);
  // const onMouseMove = (e) => { 
  //   // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Mouse X: ${e.pageX}, Mouse Y: ${e.pageY})}`);
  //   arrX.push(e.pageX);
  //   arrY.push(e.pageY);
  //   arrXY = arrX.concat(arrY);
  // };
  useEffect(() => {
    if (isVisible) ref.current.addEventListener('mousemove', onMouseMove)
    else ref.current.removeEventListener('mousemove', onMouseMove)
  }, [isVisible])
  return ( 
    <section 
      ref={ref}
      id="pointerTest" 
      onMouseLeave={() => {
        setVisibility(!isVisible)
        sendBatchedCoords()
      }}
      onMouseEnter={() => setVisibility(!isVisible)}
      style={{ userSelect: 'none', position: 'relative', transform: `scale(${zoom.toFixed(2)})`}}
    >
      <AssessmentRenderer /> 
    </section>   
  )
}  

export default App;

