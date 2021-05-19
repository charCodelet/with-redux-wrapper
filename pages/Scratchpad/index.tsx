import React, { ReactElement, useEffect, useRef } from 'react';
import { useActions } from '../../hooks/useActions';

const Scratchpad = (): ReactElement => {
  const { saveCanvas } = useActions();
  const ref = useRef(null);
  useEffect(() => {
    saveCanvas(/*canvasReference*/ref.current);
  }, []);
  return (
    <canvas ref={ref} id="can" style={{display: "none", position: "absolute", top: '0'}}/>
  )
  // const canvasReference = <canvas ref={ref} id="can" style={{display: "none", position: "absolute", top: '0'}}/>;
  // // saveCanvas(canvasReference);
  // return canvasReference
}

export default Scratchpad;
