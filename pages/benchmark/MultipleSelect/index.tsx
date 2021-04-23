import React, { ReactElement } from 'react';
import { MultipleSelect } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const MultipleSelectConnector = (widget: Widget): ReactElement | null => {
  // selectors
  const { selected, eliminated, globalState } = useTypedSelector((state) => state.multipleSelectChoices);
  const { tabs } = useTypedSelector((state) => state);
  // console.log(selected, `--> selected`);
  // console.log(eliminated, `--> eliminated`);
  // console.log(tabs.tabNumber, `--> tabs.tabNumber`);
  // console.log(globalState, `--> globalState`);
  // console.log(globalState.selected, `--> globalState.selected`);
  // console.log(globalState.selected[tabs.tabNumber], `--> globalState.selected[`+tabs.tabNumber+`]`);
  const { multipleSelect } = useActions();
  const handleSelect = (optionId: string) => {
    multipleSelect('multiple_select', optionId, tabs.tabNumber);
  };
  const handleEliminate = (optionId: string) => {
    multipleSelect('multiple_eliminate', optionId, tabs.tabNumber);
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
      selected={selected /*globalState.selected[tabs.tabNumber]*/}
      eliminated={eliminated /*globalState.eliminated[tabs.tabNumber]*/}
      {...widget.props}
    >
      {widget.children}
    </MultipleSelect>
  );
};
export default MultipleSelectConnector;
