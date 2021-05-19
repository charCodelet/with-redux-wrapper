// @ts-nocheck // eslint-disable-line
import React, { ReactElement, useEffect, useRef } from 'react';
import { useActions } from '../../hooks/useActions';
import interact from 'interactjs';

declare const window: any;
const Calculator = (props: any): ReactElement => {
  const { fetchCalculatorElement } = useActions();
  const ref = useRef(null);
  const TIConfiguration: any = {
    elementId: 'calculatorDiv',
    ROMLocation: `../../ti-calculator/TI-${props.model}_HTML5_EMULATOR-2.0.0.65-prd/roms/ti${props.model3}.h84state`,
    FaceplateLocation: `../../ti-calculator/TI-${props.model}_HTML5_EMULATOR-2.0.0.65-prd/images/TI${props.model2}_touch.svg`,
    KeyMappingFile: '',
    KeyHistBufferLength: '100000',
    DisplayMode: 'Classic',
    AngleMode: 'RAD',
  };
  
  useEffect(() => { 
    if(props.model == '30MV') window.TI30.prototype.constructor(TIConfiguration);
    else window.TI108.prototype.constructor(TIConfiguration);
    fetchCalculatorElement(ref, props.model);
    interact('.calculatorDiv').draggable({
      restrict: {
        // restriction: 'parent', // this makes it so you can only go in the x direction...
        elementRect: { left: 1, top: 1, right: 1, bottom: 1 }
      },
      onmove: ({target, stopPropagation, preventDefault, dx, dy}) => {
        // console.log('MOVE');
        stopPropagation();
        preventDefault();
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + (dx);
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + (dy);
        target.style.transform = `translate(${x}px, ${y}px)`; // translate the element
        target.setAttribute('data-x', x);  // update the posiion attributes
        target.setAttribute('data-y', y);  // update the posiion attributes
      }
    }); 
    // return () => {
    //   console.log("need to kill the calculator...weird stuff happens after I click on help...I think it is doing a new instance or something...")
    // }
  }, [/*ref*/]);
  return <div className='calculatorDiv' ref={ref} id='calculatorDiv' style={{position: "absolute", width: "210px", height: "316px", visibility: "hidden"}}></div> 
};

export default Calculator;
