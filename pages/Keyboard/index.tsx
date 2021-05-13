import React, { ReactElement, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const Keyboard = (): ReactElement => { 

  const keys = [
    ['1','1'],
    ['2','2'],
    ['3','3'],
    ['4','4'],
    ['5','5'],
    ['6','6'],
    ['7','7'],
    ['8','8'],
    ['9','9'],
    ['0','0'],
    ['comma','backspace'],
    ['period','.'],
    ['lparen','('],
    ['rparen',')'],
    ['gt','&gt;']

    
  ]; 
  const keysSecond = [
    ['add','Plus sign'], // button[title='Root'] button[title='Bevelled fraction']
    ['divide','Division sign'],
    ['equal','Equals sign'],
    ['fraction','Fraction (Ctrl+/)'],
    ['gt','Greater-than sign'],
    ['lt','Less-than sign'],
    ['minus','Minus sign'],
    ['multiply','Multiplication sign'],
    // ['lparen','('],
    // ['rparen',')'],
    // ['period','.'],
    // ['comma',',']
  ];
  const ref = useRef({editor: com.wiris.jsEditor.JsEditor.newInstance({language: "en"})}); 
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const { tabs } = useTypedSelector((state) => state);
  var triggerEvent = function triggerEvent(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  };
  const handleTrigger = x => {
    if(keys.flat().includes(x)) {
      const model = ref.current.editor.getEditorModel();
      if(x === 'backspace') model.getFormulaModel().delete(-1);
      else model.insertMathML('<math><mn>' + x + '</mn></math>', 1);
      // multipleSelect('text_input_value', x, tabs.tabNumber);
      // return;
    } else {
      triggerEvent(document.querySelector(`button[title='${x}']`), 'click');
    }
  }
  useEffect(() => {
    const keyboard = document.getElementById('sec');
    if(tabs.tabNumber === 3) {
      ref.current.editor.insertInto(document.getElementById("editorContainer"));
      // document.getElementsByClassName('wrs_handWrapper')[0].remove();           
    }
    if(isKeyboardSet) {
      keyboard.classList.remove("close");
      // ref.current.editor.insertInto(document.getElementById("editorContainer"));
      document.getElementsByClassName('wrs_toolbar')[0].remove();
      document.getElementsByClassName('wrs_handWrapper')[0].remove();          
     
       
    }
    else {
      keyboard.classList.add("close");
    }
  }, [isKeyboardSet, tabs]);
  return (
    <section id='sec' className={'slider close'}>
      <img 
        style={{width: '5%'}} 
        src={`http://localhost:4000/keyboard/CloseButton_Normal.png`} 
      />
      <div>
         {keys.map(v => {
          return (
            <img 
              style={{width: '5%'}} 
              key={v[0]} 
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              id={`${v[0]}`} 
              onClick={() => handleTrigger(v[1])}               
            />
          )
        })}
      </div>
      {/* <div>      
        {keysSecond.map(v => {     
          return (
            <img 
              style={{width: '5%'}} 
              key={v[0]}              
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              onClick={() => handleTrigger(v[1])}                              
            />
          )
        })}
      </div> */}
    </section>
  )
}

export default Keyboard;