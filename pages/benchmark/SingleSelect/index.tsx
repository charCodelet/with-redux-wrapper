import React, { ReactElement } from 'react';
import { SingleSelect } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const SingleSelectConnector = (widget: Widget): ReactElement | null => {
  // console.log('SingleSelectConnector');
  const { selected, eliminated } = useTypedSelector((state) => state.singleSelectChoices);
  // console.log(selected, `--> selected`);
  // console.log(eliminated, `--> eliminated`);
  const { singleSelect } = useActions();
  const handleSelect = (optionId: string) => {
    singleSelect('single_select', optionId);
  };
  const handleEliminate = (optionId: string) => {
    singleSelect('single_eliminate', optionId);
  };
  const handleClear = () => {
    singleSelect('single_clear');
  };
  return (
    <SingleSelect
      onClear={handleClear}
      onChange={handleSelect}
      onEliminate={handleEliminate}
      selected={selected}
      eliminated={eliminated}
      {...widget.props}
    >
      {widget.children}
    </SingleSelect>
  );
};
export default SingleSelectConnector;
