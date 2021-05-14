import React, { ReactElement } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import AssessmentRenderer from './Assessment';
import path from 'path';
// import fs from 'fs/promises';
// import { readFile } from 'fs/promises';
import jsonata from 'jsonata';
// import fs from 'fs';
import fs from 'fs/promises';
import https from 'https';
import zlib from 'zlib';
// var promises_1 = require("fs").promises;
// import useSWR from "swr";
import { wrapper } from '../state/store';

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  console.log("When do you run???");
  const doServerSideTransformation = async () => {
    const filePath = path.join(process.cwd(), 'mock-json-server','db.json'); 
    const data = await fs.readFile(filePath, 'utf8');
    var expression = jsonata("$replace('ssssssss', '!@#ItemTabNumber0')");
    // var expression = jsonata("$replace('!@#ItemTabNumber0', 'ssssssss')");
    // var expression = jsonata("$replace('posgdfbvvcnhgjfddxzgfhd', 'vcbvcvcbvc')");
    var result = expression.evaluate(data);  
    fs.writeFile(filePath, result, 'utf8');
    console.log("after write...");
  }
  
  // await doServerSideTransformation(); 

  let start = await fetch('http://localhost:3010/start');
  let startJson = await start.json();
  // console.log(startJson, `--> startJson`);

  let students = await fetch('http://localhost:3010/students');
  let studentsJson = await students.json();
  // console.log(studentsJson, `--> studentsJson`);

//   function getGzipped(url, callback) {
//     // buffer to store the streamed decompression
//     var buffer = [];

//     https.get(url, function(res) {
//         // pipe the response into the gunzip to decompress
//         var gunzip = zlib.createGunzip();            
//         res.pipe(gunzip);

//         gunzip.on('data', function(data) {
//             // decompression chunk ready, add it to the buffer
//             console.log(data.toString(), `--> data to string`)
//             buffer.push(data.toString())

//         }).on("end", function() {
//             // response and decompression complete, join the buffer and return
//             callback(null, buffer.join("")); 

//         }).on("error", function(e) {
//           console.log('error')
//             callback(e);
//         })
//     }).on('error', function(e) {
//         callback(e)
//     });
// }

// getGzipped('https://npd-review.naep.ed.gov/api/eiv/item/VH504849', function(err, data) {
//   if(err) console.log(err)
//   console.log(data, `--> data`);
// });



  // let myTab = await store.getState().tabs.tabNumber;
  // let start = await fetch('http://localhost:3010/tools/VH447212');
  // let startJson = await start.json();
  let tools = await fetch('http://localhost:3010/tools/VH447212');
  let toolsJson = await tools.json();
  store.dispatch({type: 'tools_props_success', payload: toolsJson});
  let blocks = await fetch('http://localhost:3010/blocks');
  let blocksJson = await blocks.json();
  // console.log(blocksJson, `--> blocksJson`);
  let nestedIdsMap = blocksJson[0].itemHeaders.map(v => v.nestedItemIds);
  let nestedIds = nestedIdsMap.filter(v => v);
  let uniqueChars = [...new Set(nestedIds.flat())];
  let blockTitle = blocksJson[0].title;
  nestedIds = uniqueChars[0];
// console.log(nestedIds, `--> nestedIds`)

  

  store.dispatch({type: 'tabs_success_server_side', payload: {tabsData: blocksJson[0].itemHeaders, nestedId: nestedIds, blockTitle: blockTitle}});
  let urls = await store.getState().tabs.tabsData.map((datum: { id: string; }) => `http://localhost:3010/item/${datum.id}`); // return { props: store.dispatch({type: 'tabs_success', payload: blocksJson[0].itemHeaders}) }
  let requests = await urls.map((url: RequestInfo) => fetch(url)); // map every url to the promise of the fetch // console.log("oh wow! I needed to put await in from of Promise.all...that made ALL the difference...");
  
  await Promise.all(requests).then(responses => responses).then(async responses => Promise.all(responses.map(r => r.json())).then(async data => { // Promise.all waits until all jobs are resolved
    store.dispatch({type: 'fetch_all_items', payload: data });
  })); 
})



const App: React.FC = (): ReactElement => {
  const { zoom } = useTypedSelector((state) => state.zoom);
  return ( 
    <>
      <section id="pointerTest" style={{ userSelect: 'none', position: 'relative', transform: `scale(${zoom.toFixed(2)})`}}>
        <AssessmentRenderer /> 
      </section>   
    </>
  )
}  

export default App;

