/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState } from 'react';
import { TextInput } from '@coreym/benchmark';
import { Widget } from '@enaep-ng/types';

export const TextInputConnector = (widget: Widget): ReactElement | null => {
  const [text, setText] = useState('');
  const handleSelect = (optionId: string | number) => setText(optionId.toString());
  return (
    <TextInput onChange={handleSelect} value={text} type={'search'}>
      {widget.children}
    </TextInput>
  );
};

export default TextInputConnector;
