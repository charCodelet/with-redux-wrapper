// @ts-nocheck // eslint-disable-line
import React, { ReactElement, useEffect, useRef } from 'react';
import { useActions } from '../../hooks/useActions';
import interact from 'interactjs';

// eslint-disable-next-line
declare const window: any;
const Calculator = (): ReactElement => {
  const { fetchCalculatorElement } = useActions();
  // eslint-disable-next-line
  const TI30XSDefaultConfiguration: any = {
    elementId: 'calculatorDiv',
    ROMLocation: '../../ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/roms/ti30mv.h84state',
    FaceplateLocation: '../../ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/images/TI30XS_touch.svg',
    FaceplateMobileLocation: '../../ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/images/TI30XS_touch.svg',
    KeyMappingFile: '',
    KeyHistBufferLength: '100000',
    DisplayMode: 'Classic',
    AngleMode: 'RAD',
  };
  const ref = useRef(null);
  useEffect(() => {
    window.TI30.prototype.constructor(TI30XSDefaultConfiguration);
    fetchCalculatorElement(ref);
  }, []);
  // eslint-disable-next-line
  interact('.calculatorDiv').draggable({
      restrict: {
        // restriction: 'parent',
        elementRect: { left: 0, top: 0, right: 1, bottom: 1 }
      },
      onmove: (event) => { // prettier-ignore
      const target = event.target; // prettier-ignore
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx; // prettier-ignore
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy; // prettier-ignore
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`; // prettier-ignore
      target.setAttribute('data-x', '' + x); // prettier-ignore
      target.setAttribute('data-y', '' + y); // prettier-ignore
    }
  }); // prettier-ignore
  return <div className='calculatorDiv' ref={ref} id='calculatorDiv' style={{width: "210px", height: "316px", visibility: "hidden"}}></div> // prettier-ignore
};

export default Calculator;
