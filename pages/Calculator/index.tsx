// @ts-nocheck // eslint-disable-line
import React, { ReactElement, useEffect, useRef } from 'react';
import { useActions } from '../../hooks/useActions';
import interact from 'interactjs';

declare const window: any;
const Calculator = (props: any): ReactElement => {
  const { fetchCalculatorElement } = useActions();
  const TIConfiguration: any = {
    elementId: 'calculatorDiv',
    ROMLocation: `../../ti-calculator/TI-${props.model}_HTML5_EMULATOR-2.0.0.65-prd/roms/ti${props.model3}.h84state`,
    FaceplateLocation: `../../ti-calculator/TI-${props.model}_HTML5_EMULATOR-2.0.0.65-prd/images/TI${props.model2}_touch.svg`,
    KeyMappingFile: '',
    KeyHistBufferLength: '100000',
    DisplayMode: 'Classic',
    AngleMode: 'RAD',
  };
  const ref = useRef(null);
  useEffect(() => {
    console.log(props.model, `--> props.model`)
    if(props.model == '30MV') window.TI30.prototype.constructor(TIConfiguration);
    else window.TI108.prototype.constructor(TIConfiguration);
    fetchCalculatorElement(ref);
  }, []);
  interact('.calculatorDiv').draggable({
      restrict: {
        // restriction: 'parent', // this makes it so you can only go in the x direction...
        elementRect: { left: 0, top: 0, right: 1, bottom: 1 }
      },
      onmove: (event) => { 
      const target = event.target; 
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx; 
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', '' + x); 
      target.setAttribute('data-y', '' + y); 
    }
  }); 
  return <div className='calculatorDiv' ref={ref} id='calculatorDiv' style={{position: "absolute", width: "210px", height: "316px", visibility: "hidden"}}></div> 
};

export default Calculator;
