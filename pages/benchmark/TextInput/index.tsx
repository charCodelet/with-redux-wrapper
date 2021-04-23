/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState } from 'react';
import { TextInput } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const TextInputConnector = (widget: Widget): ReactElement | null => {
  const [text, setText] = useState<String | Number>('');
  const { tabs } = useTypedSelector((state) => state);
  const { multipleSelect } = useActions();
  const handleSelect = (optionId: string) => {
    multipleSelect('text_input_value', optionId, tabs.tabNumber);
    setText(optionId); 
  }
  // console.log(entered, `--> entered`);
  return (
    <TextInput onChange={handleSelect} value={text/*entered*/} /*type={'search'}*/>
      {widget.children}
    </TextInput>
  );
};

export default TextInputConnector;
