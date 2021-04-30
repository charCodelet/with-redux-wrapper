/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, useCallback, useRef } from 'react';
import { TextInput } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';
// import dynamic from 'next/dynamic';
// import Editor from '../../Editor';

// const Editor = dynamic(() => import("../../Editor"), { ssr: false });
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const TextInputConnector = (widget: Widget): ReactElement | null => {
  const [text, setText] = useState<String | Number>('');
  const { tabs, multipleSelectChoices } = useTypedSelector((state) => state);
  const { multipleSelect } = useActions();
  let reduxText = multipleSelectChoices.entered[tabs.tabNumber];
  // console.log(reduxText, `--> multipleSelectChoices.entered[tabs.tabNumber]`);

  // useCallback(() => {
  //   console.log('Clicked!');
  // }, []);
  // const genericCb = React.useCallback((param) => () => someFunction(param), [])

  
  // const handleSelect = useCallback((optionId: string) => {
  //   console.log(optionId, `--> optionId in textinput`)
  //   // multipleSelect('text_input_value', optionId, tabs.tabNumber);
  //   setText(optionId); 
  // },[reduxText]);
  const intervalRef = useRef();
  const handleSelect = (optionId: string) => {
    // console.log('CHANGE EVENT')
    // console.log(optionId, `--> optionId in textinput`)
    intervalRef.current = optionId;
    // console.log(intervalRef?.current, `--> intervalRef.current`)
    console.log("multipleSelect('text_input_value',",optionId,",",tabs.tabNumber,")")
    multipleSelect('text_input_value', optionId, tabs.tabNumber);
    setText(optionId); 
  };
  // const handleSelect2 = (optionId: string) => {
  //   console.log('INPUT EVENT')
  //   console.log(optionId, `--> optionId in textinput INPUT`)
  //   multipleSelect('text_input_value', optionId.target.value, tabs.tabNumber);
  //   setText(optionId); 
  // }
  return (
    <>
      {/* <Editor /> */}
      <TextInput id='yabba' onChange={handleSelect} /*onInput={handleSelect2}*/ value={text} /*type={'search'}*/ >
        {widget.children}
      </TextInput>  
    </>
  );
};

export default TextInputConnector;



