import React, { ReactElement, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

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
    ['period','.'],
    ['comma',','],
    ['lparen','('],
    ['rparen',')'],
    ['colon', ':'],
    ['almostequal','&#x2248;'],
    ['percent','%'],
    ['backspace','backspace'],
  ];
  const keysSecond = [
    ['add','+'],
    ['minus','-'],
    ['multiply','&#xD7;'],
    ['divide','&#xF7;'],
    ['plusminus','&#xB1;'],
    ['equal','='],
    ['notequal','&#x2260;'],
    ['approxequal','&#x2245;'],
    ['gt','&gt;'],
    ['gtequal','&ge;'],
    ['lt','&lt;'],
    ['ltequal','&le;'],
    ['fraction','fraction'],
    ['tilde','~'],
    ['degree','&#xB0;'],
    ['pi','#x3C0;'],
    ['perpendicular','&#x2194;'],
  ]; 
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const { getWiris } = useTypedSelector((state) => state.getWiris);
  const { tabs } = useTypedSelector((state) => state);
  const { multipleSelect, setKeyboard } = useActions();
  var triggerEvent = function triggerEvent(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  };
  const handleTrigger = x => {
    if(keys.flat().includes(x)) {
      let model = getWiris.getEditorModel();
      // let xTop = document.getElementById("yabba").getBoundingClientRect().x;
      // let yTop = document.getElementById("yabba").getBoundingClientRect().y;
      // document.getElementById('editorContainer').style.transform = `translateX(${xTop}px)`;
      // document.getElementById('editorContainer').style.transform = `translateY(${yTop}px)`;
      let caretPosition = model.getCaret();
      if(x === 'backspace') {
        model.getFormulaModel().delete(-1);
        model.dispatchEvents();
      }  
      else {
        model.insertMathML('<math><mn>' + x + '</mn></math>', 1);
        model.setCaret(caretPosition + 1, 0);
        multipleSelect('text_input_value', x, tabs.tabNumber);
      }
      // multipleSelect('text_input_value', x, tabs.tabNumber);
    } else if(keysSecond.flat().includes(x)) {
      let model = getWiris.getEditorModel();
      if(x === 'fraction') {
        model.insertMathML('<math><mn><mfrac><mrow/><mrow/></mfrac></mn></math>', 1);
        getWiris.action(x);
      } else {
        model.insertMathML('<math><mn>' + x + '</mn></math>', 1);
      }
    } 
    else  {
      alert('no run')
      triggerEvent(document.querySelector(`button[title='${x}']`), 'click');
    }
  }
  useEffect(() => {
    const keyboard = document.getElementById('sec');
    if(tabs.tabNumber === 3) {
      // ref.current.editor.insertInto(document.getElementById("editorContainer"));
      // document.getElementsByClassName('wrs_handWrapper')[0].remove();           
    }
    if(isKeyboardSet) {
      keyboard.classList.remove("close");
      // ref.current.editor.insertInto(document.getElementById("editorContainer"));
      // document.getElementsByClassName('wrs_toolbar')[0].remove();
      // document.getElementsByClassName('wrs_handWrapper')[0].remove();          
     
       
    }
    else {
      keyboard.classList.add("close");
    }
  }, [isKeyboardSet, tabs]);
  return (
    <section id='sec' className={'slider close'}>
      <img 
        style={{width: '5%'}} 
        src={`http://localhost:4000/keyboard/closeButton.png`} 
        onClick={() =>  setKeyboard(false)}
      />
      <div style={{position: 'absolute', top: '4vh', display: 'flex', justifyContent: 'space-evenly'}}>
         {keys.map(v => {
          return (
            <img 
              style={{width: v[0] === 'backspace' ? '6%' : '3%'}} 
              key={v[0]} 
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              id={`${v[0]}`} 
              onClick={() => handleTrigger(v[1])}               
            />
          )
        })}
      </div>
      <div style={{position: 'absolute', top: '12vh', display: 'flex', justifyContent: 'space-evenly'}}>      
        {keysSecond.map(v => {     
          return (
            <img 
              style={{width: '3%'}} 
              key={v[0]}              
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              id={`${v[0]}`} 
              onClick={() => handleTrigger(v[1])}                              
            />
          )
        })}
      </div>
    </section>
  )
}

export default Keyboard;