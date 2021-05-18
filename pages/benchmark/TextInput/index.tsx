import React, { ReactElement, useEffect, useState } from 'react';
import { TextInput } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const TextInputConnector = (widget: Widget): ReactElement | null => {
  const [text, setText] = useState<String | Number>('');
  const { tabs, multipleSelectChoices } = useTypedSelector((state) => state);
  const { multipleSelect } = useActions();
  let reduxText = multipleSelectChoices.entered[tabs.tabNumber];

  useEffect(() => {
    let xTop = document.getElementById("yabba").getBoundingClientRect().x;
    let yTop = document.getElementById("yabba").getBoundingClientRect().y;
    document.getElementById('editorContainer').style.transform = `translate(${xTop}px, ${yTop}px)`;
    document.getElementById('editorContainer').style.zIndex = '1';
    document.getElementById('editorContainer').style.visibility = 'visible';
    document.getElementById('editorContainer').style.backgroundColor = '#ebfbe5';
    document.getElementById('editorContainer').style.outline = '1px dashed #008117';
    document.getElementById('editorContainer').style.outlineOffset = '-3px';
    document.getElementsByClassName('wrs_formulaDisplay')[0].style.backgroundColor = "transparent";
    return () => {
      document.getElementById('editorContainer').style.zIndex = '0';
    }
  },[])
  
  const handleSelect = (optionId: string) => {
    console.log("multipleSelect('text_input_value',",optionId,",",tabs.tabNumber,")")
    multipleSelect('text_input_value', optionId, tabs.tabNumber); 
  };
  return (
        <TextInput id='yabba' onChange={handleSelect} type={'search'} >
          {widget.children}
        </TextInput>  
  );
};

export default TextInputConnector;



