import React from 'react';
import katex from 'katex';
import MathMl2LaTeX from 'mathml2latex';

export default function Math({children}) {
  return <span id='mathElement' dangerouslySetInnerHTML={{ __html: katex.renderToString(MathMl2LaTeX.convert(`${children}`), {throwOnError: false})}}></span>
}
