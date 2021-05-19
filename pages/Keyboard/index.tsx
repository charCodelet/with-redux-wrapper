import React, { ReactElement, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { topRowKeys, secondRowKeys } from './keys';

const Keyboard = (): ReactElement => { 
  const ref = useRef(null);
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const { getWiris } = useTypedSelector((state) => state.getWiris);
  const { tabs } = useTypedSelector((state) => state);
  // const { getKeyboard } = useTypedSelector((state) => state.saveKeyboard); // keep this just in case, but as of now, there is no need to cache the keyboard instance...
  const { multipleSelect, setKeyboard /*, saveKeyboard*/ } = useActions();

  const handleTrigger = (x: string) => {
    let model = getWiris.getEditorModel();
    if(topRowKeys.flat().includes(x)) {
      let caretPosition = model.getCaret();
      if(x === 'backspace') {
        model.getFormulaModel().delete(-1);
        model.dispatchEvents();
        console.log('hmmm...not sure if I actually want to "erase" from redux...could be valuable information for The Man...');
      }  
      else {
        model.insertMathML('<math><mn>' + x + '</mn></math>', 1);
        model.setCaret(caretPosition + 1, 0);
        multipleSelect('text_input_value', x, tabs.tabNumber);
      }
    } 
    else if(secondRowKeys.flat().includes(x)) {
      if(x === 'fraction') {
        model.insertMathML('<math><mn><mfrac><mrow/><mrow/></mfrac></mn></math>', 1);
        getWiris.action(x);
      } else {
        model.insertMathML('<math><mn>' + x + '</mn></math>', 1);
      }
    } 
  }
  useEffect(() => {
    if(isKeyboardSet) ref.current.classList.remove("close");             
    else ref.current.classList.add("close");
  }, [isKeyboardSet, tabs]);
  return (
    <section ref={ref} id='sec' className={'slider close'}>
      <img 
        style={{width: '5%'}} 
        src={`http://localhost:4000/keyboard/closeButton.png`} 
        onClick={() => setKeyboard(false)}
      />
      <div style={{position: 'absolute', top: '4vh', display: 'flex', justifyContent: 'space-evenly'}}>
         {topRowKeys.map(v => {
          return (
            <img 
              style={{width: v[0] === 'backspace' ? '6%' : '3%'}} 
              key={v[0]} 
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              // id={`${v[0]}`} 
              onClick={() => handleTrigger(v[1])}               
            />
          )
        })}
      </div>
      <div style={{position: 'absolute', top: '12vh', display: 'flex', justifyContent: 'space-evenly'}}>      
        {secondRowKeys.map(v => {     
          return (
            <img 
              style={{width: '3%'}} 
              key={v[0]}              
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              // id={`${v[0]}`} 
              onClick={() => handleTrigger(v[1])}                              
            />
          )
        })}
      </div>
    </section>
  )
}

export default Keyboard;