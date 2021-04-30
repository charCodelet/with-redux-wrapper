import React, { ReactElement, useState, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

const Keyboard = (): ReactElement => { 
  const keys = ['1','2','3','4','5','6','7','8','9','0','backspace'];
  const keysSecond = ['comma','divide','equal','fraction','gt','lt','minus','mixed','multiply','parenthesisclose','parenthesisopen','period','plus'];
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const { multipleSelect } = useActions();
  const { tabs, multipleSelectChoices } = useTypedSelector((state) => state);
  var triggerEvent = function triggerEvent(el, type) {
    alert(33)
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  };

  const handleTrigger = () => {
    alert(99)
    var someLink = document.querySelector("button[title='Root']");
    triggerEvent(someLink, 'click');
  }
  const handleNumber = (optionId) => {
    console.log(optionId, `--> optionId!!!!!!!!!!!!!!!!!`);
    // var someLink = document.querySelector("#yabba");
    // triggerEvent(someLink, 'click');
    // let reduxText = multipleSelectChoices.entered[tabs.tabNumber];
    // console.log(reduxText, `--> reduxText asdfsafdsafdsafdsafdsafdsafdsafdsfsdafsda`)
    var input = document.querySelector('#yabba');
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, optionId);
    var ev2 = new Event('change', { bubbles: true});
    input.dispatchEvent(ev2);

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!multipleSelect('text_input_value',",optionId,",",tabs.tabNumber,")")
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
              onClick={() => handleNumber(multipleSelectChoices.entered[tabs.tabNumber] + v)}
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
              onClick={handleTrigger}           
            />
          )
        })}
      </div>
    </section>
  )
}

export default Keyboard;