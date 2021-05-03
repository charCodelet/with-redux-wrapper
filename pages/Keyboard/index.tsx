import React, { ReactElement, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

const Keyboard = (): ReactElement => { 
  const keys = ['1','2','3','4','5','6','7','8','9','0','backspace'];
  const keysSecond = ['comma','divide','equal','fraction','gt','lt','minus','mixed','multiply','parenthesisclose','parenthesisopen','period','plus'];
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const { multipleSelect } = useActions();
  const { tabs, multipleSelectChoices } = useTypedSelector((state) => state);

  // var triggerEvent = function triggerEvent(el, type) {
  //   var e = document.createEvent('HTMLEvents');
  //   e.initEvent(type, false, true);
  //   el.dispatchEvent(e);
  // };

  // const handleTrigger = () => {
  //   var someLink = document.querySelector("button[title='Fraction (Ctrl+/)']"   /*"button[title='Less-than or equal to']"*/  /*"button[title='Root']"*/);
  //   triggerEvent(someLink, 'click');
  // }
  // let reduxText = multipleSelectChoices.entered[tabs.tabNumber];
  const handleWirisNumber = (optionId) => {
    if(optionId.includes('undefined')) {
      optionId = optionId.slice(9);
    }
    let d1 = document.querySelector('.wrs_container');
    d1.insertAdjacentHTML('beforebegin', `<span class="wrs_notItalic wrs_notBold wrs_font_inherit" style="color: rgb(0, 0, 0); position: absolute; left: 0px; top: 2px; z-index: 2; font-size: 16px;">${optionId}</span>`);
    // multipleSelect('text_input_value', optionId, tabs.tabNumber);
  }

  const handleNumber = (optionId) => {
    if(optionId.includes('undefined')) {
      optionId = optionId.slice(9);
    }
    console.log(optionId, `--> optionId`);
    var input = document.querySelector('.wrs_container'); // '.wrs_formulaDisplay' /*'#yabba'*/
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, optionId);
    var ev2 = new Event('change', { bubbles: true});
    input.dispatchEvent(ev2);
    console.log("multipleSelect('text_input_value',",optionId,",",tabs.tabNumber,")")
    multipleSelect('text_input_value', optionId, tabs.tabNumber);
  }
  

  useEffect(() => {
    const keyboard = document.getElementById('sec');
    if(isKeyboardSet) {
      keyboard.classList.remove("close");
    }
    else {
      keyboard.classList.add("close");
    }
  }, [isKeyboardSet]);
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
              key={v} 
              src={`http://localhost:4000/keyboard/${v}.png`} 
              id={`${v}`} 
              onClick={() => handleWirisNumber(v) /*() => handleNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)*/}
            />
          )
        })}
      </div>
      <div>
        {keysSecond.map(v => {
          return (
            <img 
              style={{width: '5%'}} 
              key={v} 
              src={`http://localhost:4000/keyboard/${v}.png`} 
              onClick={/*handleTrigger*/() => handleWirisNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)}           
            />
          )
        })}
      </div>
    </section>
  )
}

export default Keyboard;