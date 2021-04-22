import React, { ReactElement } from 'react';
import { MultipleSelect } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const MultipleSelectConnector = (widget: Widget): ReactElement | null => {
  // selectors
  const { selected, eliminated } = useTypedSelector((state) => state.multipleSelectChoices);
  // console.log(selected, `--> selected`);
  // console.log(eliminated, `--> eliminated`);

  const { multipleSelect } = useActions();
  const handleSelect = (optionId: string) => {
    multipleSelect('multiple_select', optionId);
  };
  const handleEliminate = (optionId: string) => {
    multipleSelect('multiple_eliminate', optionId);
  };
  const handleClear = () => {
    multipleSelect('multiple_clear');
  };

  return (
    <MultipleSelect
      style={{backgroundColor: 'red !important'}}
      onClear={handleClear}
      onChange={handleSelect}
      onEliminate={handleEliminate}
      selected={selected}
      eliminated={eliminated}
      {...widget.props}
    >
      {widget.children}
    </MultipleSelect>
  );
};
export default MultipleSelectConnector;
