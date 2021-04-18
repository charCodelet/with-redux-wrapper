import React, { ReactElement, useEffect } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { GlobalProvider, themes /*, Box*/ } from '@coreym/benchmark';
import {SSRProvider} from '@react-aria/ssr'
// import ToolbarRenderer from './Toolbar';
import TabsRenderer from './TabsRenderer';
import AssessmentRenderer from './Assessment';
import { useActions } from '../hooks/useActions';
// import useSWR from "swr";
import { wrapper } from '../state/store';

// export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
//   return fetch('http://localhost:3010/blocks')
//   .then(response => response.json())
//   .then(data => {
//     store.dispatch({type: 'tabs_success', payload: data[0].itemHeaders});  // I think what's happening here is that since we ARE NOT returning props, this function acts differenly from the built it one...and it lets us get the 'props' from the traditionap mapStateToProps / useSelector method(s)...
//   })
// })

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  let blocks = await fetch('http://localhost:3010/blocks');
  let blocksJson = await blocks.json();
  store.dispatch({type: 'tabs_success', payload: blocksJson[0].itemHeaders})
  let urls = store.getState().tabs.data.map(datum => `http://localhost:3010/item/${datum.id}`);

 
  // return {
  //   props: store.dispatch({type: 'tabs_success', payload: blocksJson[0].itemHeaders})
  // }

  // let urls = [
  //   'http://localhost:3010/blocks',
  //   'http://localhost:3010/item/VH447209',
  //   'http://localhost:3010/item/VH447212',
  //   'http://localhost:3010/item/VH098389',
  //   'http://localhost:3010/item/VH133664',
  //   'http://localhost:3010/item/VH134067',
  //   'http://localhost:3010/item/VH134362',
  //   'http://localhost:3010/item/VH134478',
  //   'http://localhost:3010/item/VH098763',
  //   'http://localhost:3010/item/VH269552',
  //   'http://localhost:3010/item/VH359937',
  //   'http://localhost:3010/item/VR243898',
  //   'http://localhost:3010/item/VR272379',
  //   'http://localhost:3010/item/VR272424',
  //   'http://localhost:3010/item/VH271292', 
  // ];
  let requests = urls.map(url => fetch(url)); // map every url to the promise of the fetch
  Promise.all(requests).then(responses => responses).then(responses => Promise.all(responses.map(r => r.json())).then(data => { // Promise.all waits until all jobs are resolved
    console.log(data, `--> data`);
  })); 
})


const App: React.FC = (): ReactElement => {
  const { /*createLaunch, fetchTabs, fetchStart*/ } = useActions();
  const { theme } = useTypedSelector((state) => state.theme);
  const { tabs } = useTypedSelector((state) => state);
  // const { data, error } = useSWR('tools/VH447212', createLaunch);
  // console.log(data, `--> data`);
  // console.log(error, `--> error`);
  useEffect(() => {
    // fetchStart('start');
    // fetchTabs('blocks');
    // createLaunch('tools/VH447212');
  }, []);

  const obj = {};
  tabs && tabs.data.map((v: { sequence: string | number; id: any }) => (obj[v.sequence] = v.id));

  return (  
    <SSRProvider>   
      <GlobalProvider theme={themes[theme]}>
        {/* <ToolbarRenderer tabNums={obj} /> */}
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

