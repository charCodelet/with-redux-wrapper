import React, { useEffect } from 'react';
// import parse from "html-react-parser";
// import { wrapper } from '../../../state/store';
// import katex from 'katex';
// import dynamic from "next/dynamic";
// import MathJax from 'react-mathjax-preview'
// import MathComponent from './MathComponent';
const MathComponent = React.lazy(() => import('./MathComponent'));
// const MathComponent = dynamic(() => import("./MathComponent"), { ssr: false });

export default function Math({children}) {
  // children = katex.renderToString(`${children}`, {
  //   throwOnError: true,
  //   output: 'mathml'
  // });
  // console.log(children, `--> children`);

  // useEffect(() => {
  //   children = katex.renderToString(`${children}`, {
  //     throwOnError: true,
  //     output: 'mathml'
  //   });
  // },[])
  // return <MathJax math={children}/>
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MathComponent mathml={`${children}`} display={false} />
    </React.Suspense>
  )
}
