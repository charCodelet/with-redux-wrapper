import React from 'react';
import { Global, css } from '@emotion/react';

export default () => {
  // CSS RESET
  let global = css`
    html,
    body {
      height: 100%;
      margin: 0;

      /** 
       * "One very visible effect is optimizeLegibility,
       * which enables ligatures (ff, fi, fl, etc.) in text
       * smaller than 20px for some fonts (for example,
       * Microsoft's Calibri, Candara, Constantia, and
       * Corbel, or the DejaVu font family)."
       * https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering
       *
      */
      text-rendering: optimizelegibility;
    }
    /**
     * Form elements don't inherit font settings.
     * https://stackoverflow.com/questions/26140050/
     */
    input,
    select,
    textarea,
    button {
      font-family: inherit;
      font-size: inherit;
    }
  `;
  return <Global styles={global} />;
};
