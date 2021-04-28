import React, { ReactElement } from 'react';
import { Zones } from '@coreym/benchmark';
import { Widget } from '../../../types/src/stateMachineTypes/Widget';

export const ZonesConnector = (widget: Widget): ReactElement | null => {
  const handleSelect = (e, optionId: string | number) => {
    console.log(e)
    console.log(optionId);
  };
  const handleClear = () => {
    console.log('clear');
  };
  return (
    <Zones // prettier-ignore
      onClear={handleClear}
      onChange={handleSelect}
      selected={true}
      {...widget.props}
    >
      {widget.children}
    </Zones>
  );
};

export default ZonesConnector;
