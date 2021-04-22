import React, { ReactElement, useState } from 'react';
import { Dropdown } from '@coreym/benchmark';
// import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const DropdownConnector = (widget: Widget): ReactElement | null => {
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const { dropdownSelect } = useActions();
  function handleClick() {
    // console.log('click dropdown');
    setOpen(!open);
  }
  function handleClickOutside() {
    setOpen(false);
  }

  function handleSelect(value) {
    if (value !== null && value !== undefined) {
      setOpen(false);
      setSelected(value);
      dropdownSelect('dropdown_select', value);
    }
  }
  // console.log(widget.props, `--> widget.props`);
  return (
    <Dropdown
      isOpen={open}
      selected={selected}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      onClick={handleClick}
      {...widget.props}
    >
      {widget.children}
    </Dropdown>
  );
};

export default DropdownConnector;

