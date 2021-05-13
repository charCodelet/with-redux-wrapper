import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import katex from 'katex';
import MathMl2LaTeX from 'mathml2latex';

const Keyboard = (): ReactElement => { 


  const ref = useRef({
    editor: com.wiris.jsEditor.JsEditor.newInstance({language: "en"})
  }); 

  useEffect(() => {
    ref.current.editor.insertInto(document.getElementById("editorContainer"));
  },[])
  
  // let editor = com.wiris.jsEditor.JsEditor.newInstance({language: "en"});

  // const model = editor.getEditorModel();
  // console.log(model, `--> model`);
  // model.insertMathML('<math><mn>' + 5 + '</mn></math>', 1);
  // if(mathKey) {
    // editor.insertInto(document.getElementById("editorContainer"));
  // }
 

  // const keys = ['1','2','3','4','5','6','7','8','9','0','backspace']; 
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
    [',',','],
    ['.','.']
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
    ['lparen','('],
    ['rparen',')'],
    ['period','.'],
    ['comma',',']
  ];
  // const keysSecond = [
  //   ['add','+'],
  //   ['multiply','x'],
  //   ['minus','-'],
  //   ['divide','÷'],
  //   ['gt','>'],
  //   ['lt','<'],
  //   ['lparen','('],
  //   ['rparen',')'],
  //   ['period','.'],
  //   ['comma',','],
  //   ['fraction','Fraction (Ctrl+/)'],
  // ]; 
  // const keysSecond = ['\\div','\\times', '\\minus', '\\add', '\\gt', '\\lt', '\\lparen', '\\rparen', `\\frac{1}{2}`]; // 
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const [toTheLeft, setToTheLeft] = useState(0);
  const { multipleSelect } = useActions();
  const { tabs, multipleSelectChoices } = useTypedSelector((state) => state);

  var triggerEvent = function triggerEvent(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  };
  const handleTrigger = x => {
    let hiddenInput = document.getElementsByClassName('wrs_focusElement')[0];
    if(keys.flat().includes(x)) {

      const model = ref.current.editor.getEditorModel();
      model.insertMathML('<math><mn>' + x + '</mn></math>', 1);
      // triggerEvent(document.querySelector(`button[title='Plus sign']`), 'click');
return;
      // let listItem = document.querySelector('.wrs_container > .wrs_metrics + span');
      let listItem = document.querySelector('.wrs_container > .wrs_metrics');
      listItem.insertAdjacentHTML('afterend', `<span class="wrs_notItalic wrs_notBold wrs_font_inherit" style="color: rgb(0, 0, 0); position: absolute; left: ${toTheLeft}px; top: 2px; z-index: 2; font-size: 16px;">4</span>`);
      listItem = document.querySelector('.wrs_container > .wrs_metrics + span')
      const newItem = document.createElement('span');
      newItem.setAttribute("class", "wrs_notItalic wrs_notBold wrs_font_inherit");
      newItem.setAttribute("style", "color: rgb(0, 0, 0); position: absolute; left: 0px; top: 2px; z-index: 2; font-size: 16px;");
      newItem.innerHTML = '4';

      listItem.parentNode.replaceChild(newItem, listItem);

      multipleSelect('text_input_value', x, tabs.tabNumber);
      // setToTheLeft(toTheLeft => toTheLeft + 9);
      // hiddenInput.addEventListener('focus', e => {
      //   console.log(e.target);
      //   document.querySelector('.wrs_container > div.wrs_underlineCaret.wrs_dark').style.left = `${toTheLeft}px !important`;
      //   document.querySelector('.wrs_container > div.wrs_underlineCaret.wrs_dark').style.color = `red !important`;
      // })
      return; 





      // console.log(x, `--> x`);
      let d1 = document.querySelector('.wrs_container > .wrs_metrics');
      d1.insertAdjacentHTML('afterend', `<span class="wrs_notItalic wrs_notBold wrs_font_inherit" style="color: rgb(0, 0, 0); position: absolute; left: ${toTheLeft}px; top: 2px; z-index: 2; font-size: 16px;">${x}</span>`);
      // <span class="wrs_notItalic wrs_notBold wrs_font_inherit" style="color: rgb(0, 0, 0); position: absolute; left: 9px; top: 2px; z-index: 2; font-size: 16px;>3</span>
      try {
        // console.log(com.wiris.js.JsFormulaDisplay);
        // com.wiris.js.JsFormulaDisplay.caretPositionChanged();
      } catch(e) {

      }
      
      // var element = document.querySelector('.wrs_underlineCaret');
      // console.log(document.querySelector('.wrs_underlineCaret'));
      // var out = "";
      // var elementStyle = element.style;
      // var computedStyle = window.getComputedStyle(element, null);
      // console.log(computedStyle, `--> computedStyle`);

      // for (const prop in elementStyle) {
      //   if (elementStyle.hasOwnProperty(prop)) {
      //     out += "  " + prop + " = '" + elementStyle[prop] + "' > '" + computedStyle[prop] + "'\n";
      //   }
      // }
      // console.log(out)

      
      // console.log(toTheLeft, `--> toTheLeft`);
      document.querySelector('.wrs_container > div.wrs_underlineCaret.wrs_dark').style.left = `${toTheLeft}px !important`;
      try {
        document.querySelector('.wrs_inverseCaret').remove();
        document.querySelector('.wrs_caret.wrs_dark').remove();
      } catch(e) {

      }
      
      // document.querySelector('.wrs_inverseCaret').style.left = `${toTheLeft}px !important`;
      // document.querySelector('.wrs_caret.wrs_dark').style.left = `${toTheLeft}px !important`;
      

      multipleSelect('text_input_value', x, tabs.tabNumber);
      setToTheLeft(toTheLeft => toTheLeft + 9);
      hiddenInput.addEventListener('focus', e => {
        console.log(e.target);
        document.querySelector('.wrs_container > div.wrs_underlineCaret.wrs_dark').style.left = `${toTheLeft}px !important`;
        document.querySelector('.wrs_container > div.wrs_underlineCaret.wrs_dark').style.color = `red !important`;
      })
    } else {

    

      triggerEvent(document.querySelector(`button[title='${x}']`), 'click');
    }
    
  }
  
  const handleWirisNumber = (optionId) => {
    
    if(optionId.includes('undefined')) {
      optionId = optionId.slice(9);
    }
    if(optionId.includes("Fraction (Ctrl+/)")) {
      console.log(optionId, `--> optionId`);
      handleTrigger("Fraction (Ctrl+/)")
    }
    else {
      let d1 = document.querySelector('.wrs_container');
      d1.insertAdjacentHTML('afterbegin', `<span class="wrs_notItalic wrs_notBold wrs_font_inherit" style="color: rgb(0, 0, 0); position: absolute; left: 0px; top: 2px; z-index: 2; font-size: 16px;">${optionId}</span>`);
      multipleSelect('text_input_value', optionId, tabs.tabNumber);
    } 
  }
  const handleKatex = (optionId) => {
    if(optionId.includes('undefined')) {
      optionId = optionId.slice(9);
    }
    const regex = /\\[minus|add]+/gim;
    if(optionId.includes('minus')) {
      optionId = optionId.replace(regex, '-');
    }
    else if(optionId.includes('add')) {
      optionId = optionId.replace(regex, '+');
    }
    
    katex.render(optionId, document.querySelector('#here'), { // "c = \\pm\\sqrt{a^2 + b^2}"
        throwOnError: false
    });
    // return;
    // optionId = katex.renderToString(optionId, { // "c = \\pm\\sqrt{a^2 + b^2}"
    //   throwOnError: false,
    //   output: 'html'
    // });
    var input = document.querySelector('#yabba'); // '.wrs_formulaDisplay' '.wrs_container' /*'#yabba'*/
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, optionId);
    var ev2 = new Event('input', { bubbles: true});
    input.dispatchEvent(ev2);
    multipleSelect('text_input_value', MathMl2LaTeX.convert(`${optionId}`), tabs.tabNumber);
  }
  const handleNumber = (optionId) => {
    if(optionId.includes('undefined')) {
      optionId = optionId.slice(9);
    }
    console.log(optionId, `--> optionId`);
    var input = document.querySelector('#yabba'); // '.wrs_formulaDisplay' '.wrs_container' /*'#yabba'*/
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, optionId);
    var ev2 = new Event('change', { bubbles: true});
    input.dispatchEvent(ev2);
    console.log("multipleSelect('text_input_value',",optionId,",",tabs.tabNumber,")")
    // multipleSelect('text_input_value', optionId, tabs.tabNumber);
  }
  useEffect(() => {
    const keyboard = document.getElementById('sec');
    if(isKeyboardSet) keyboard.classList.remove("close");
    else keyboard.classList.add("close");
  }, [isKeyboardSet]);
  return (
    <section id='sec' className={'slider close'}>
      <img 
        style={{width: '5%'}} 
        src={`http://localhost:4000/keyboard/CloseButton_Normal.png`} 
      />
      <div>
        {/* {keys.map(v => {
          return (
            <img 
              style={{width: '5%'}} 
              key={v} 
              src={`http://localhost:4000/keyboard/${v}.png`} 
              id={`${v}`} 
              onClick={handleTrigger}    
              // onClick={() => handleWirisNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)}
              // onClick={() => handleNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)}
            />
          )
        })} */}
         {keys.map(v => {
          return (
            <img 
              style={{width: '5%'}} 
              key={v[0]} 
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              id={`${v[0]}`} 
              onClick={() => handleTrigger(v[1])}     
              // onClick={() => handleWirisNumber(multipleSelectChoices.entered[tabs.tabNumber] + v[1])}
              // onClick={() => handleNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)}
            />
          )
        })}
      </div>
      <div>
        {/* {keysSecond.map(v => {
          // console.log(v.slice(1))
          return (
            <img 
              style={{width: '5%'}} 
              key={v[0]} 
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              // onClick={handleTrigger}     
              onClick={() => handleWirisNumber(multipleSelectChoices.entered[tabs.tabNumber] + v[1])}     
              // onClick={() => handleKatex(multipleSelectChoices.entered[tabs.tabNumber] + `${v}`)}                 
            />
          )
        })} */}
        {keysSecond.map(v => {
          // console.log(v.slice(1))
          return (
            <img 
              style={{width: '5%'}} 
              key={v[0]} 
              // src={`http://localhost:4000/keyboard/${v.slice(1)}.png`} 
              src={`http://localhost:4000/keyboard/${v[0]}.png`} 
              onClick={() => handleTrigger(v[1])}     
              // onClick={() => handleWirisNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)}     
              // onClick={() => handleKatex(multipleSelectChoices.entered[tabs.tabNumber] + `${v}`)}                 
            />
          )
        })}
      </div>
    </section>
  )
}

export default Keyboard;