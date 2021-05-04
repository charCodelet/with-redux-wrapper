import React, { useEffect } from 'react';
// import parse from "html-react-parser";
// import { wrapper } from '../../../state/store';
import katex from 'katex';
// import dynamic from "next/dynamic";
// import { useTypedSelector } from '../../../hooks/useTypedSelector';
// import MathJax from 'react-mathjax-preview'
import MathMl2LaTeX from 'mathml2latex';
// import MathComponent from './MathComponent';
// const MathComponent = React.lazy(() => import('./MathComponent'));
// const MathComponent = dynamic(() => import("./MathComponent"), { ssr: false });
// const Mathml2latex = require('mathml-to-latex');

export default function Math({children}) {
  let datum = MathMl2LaTeX.convert(`${children}`);
  console.log(datum, `--> datum`);
  children = katex.renderToString(datum, {throwOnError: false,});
  return (
    <div dangerouslySetInnerHTML={{ __html: children }}></div>
  )

 
}
