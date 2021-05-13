/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState } from 'react';
import { TextInput } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';
import MathMl2LaTeX from 'mathml2latex';
import katex from 'katex';
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


  const handleSelect = (optionId: string) => {
    console.log('CHANGE EVENT')
    // console.log(optionId, `--> optionId in textinput`)
    // console.log(intervalRef?.current, `--> intervalRef.current`)
    // optionId = "1&#x2044;2"
    console.log("multipleSelect('text_input_value',",optionId,",",tabs.tabNumber,")")
    multipleSelect('text_input_value', optionId, tabs.tabNumber);
    // setText(optionId); 
  };
  return (
      <div>
        <div id="here" style={{position: "absolute"}}></div>
        <TextInput id='yabba' onChange={handleSelect} value={/*reduxText*/''} /*type={'search'}*/ >
          {widget.children}
        </TextInput>  
      </div>
  );
};

export default TextInputConnector;



