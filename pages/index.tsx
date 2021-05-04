import React, { ReactElement } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import katex from 'katex';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';
import {SSRProvider} from '@react-aria/ssr';
import AssessmentRenderer from './Assessment';
// import useSWR from "swr";
import { wrapper } from '../state/store';


export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  const Mathml2latex = require('mathml-to-latex');
  console.log(Mathml2latex, `--Mathml2latex`)
  // let tester = {
  //   props: {
  //     loadedProduct: katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}", {
  //       throwOnError: true,
  //       // output: 'html',     
  //     }),
  //   }
  // }
  // console.log(tester, `--> tester`);
  let start = await fetch('http://localhost:3010/tools/VH447212');
  let startJson = await start.json();
  console.log(startJson, `--> startJson`);
  let tools = await fetch('http://localhost:3010/tools/VH447212');
  let toolsJson = await tools.json();
  store.dispatch({type: 'tools_props_success', payload: toolsJson});
  let blocks = await fetch('http://localhost:3010/blocks');
  let blocksJson = await blocks.json();
  console.log(blocksJson, `--> blocksJson`);
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
  let datum;
  await Promise.all(requests).then(responses => responses).then(async responses => Promise.all(responses.map(r => r.json())).then(async data => { // Promise.all waits until all jobs are resolved
    console.log(data, `--> data`);
    datum = data[3].content.children[0].children[0].children[0].children[1].children[0].children[0];
    // datum = data[2].content.children[0].children[0].children[0].children[0].children[1].children[0];
    // datum = data[2].content.children[0].children[0].children[1].children[0].children[2].children[0];//.children[2];
    console.log(datum, `----> datum`);
    store.dispatch({type: 'fetch_all_items', payload: data });
  })); 
  // console.log(datum, `--> datum`);
  datum = Mathml2latex.convert(datum);
  let ssrMathRef = {
    props: {
      loadedProduct: katex.renderToString(`${datum}`, {throwOnError: true/*, output: "mathml"*/}),
    }
  }
  store.dispatch({type: 'ssr-math', payload: ssrMathRef.props.loadedProduct });
  return ssrMathRef;
})

const App: React.FC = (props: any): ReactElement => {
  const { zoom } = useTypedSelector((state) => state.zoom);
  const { loadedProduct } = props;
  return ( 
    <SSRProvider>
      {/* <div dangerouslySetInnerHTML={{ __html: loadedProduct }}></div>        */}
      <section id="pointerTest" style={{ userSelect: 'none', /*overflowY: 'hidden',*/ position: 'relative', transform: `scale(${zoom.toFixed(2)})`}}>
        <AssessmentRenderer /> 
      </section>   
    </SSRProvider>
  )
}  

export default App;

