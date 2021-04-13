import React, { ReactElement, useState } from 'react';
import { getActiveDialogItem$ } from '@enaep-ng/student-assessment-store';
import { useRxJsSelector } from '../../hooks/stateMachineHooks';
import { DialogName, Item } from '@enaep-ng/types/src';
import ItemRenderer from '../ItemRenderer';
const DialogRenderer = (props: { activeDialogName: DialogName }): ReactElement | null => {
  console.log('DialogRenderer');
  const [activeDialogItem, setActiveDialogItem] = useState<Item>();
  useRxJsSelector<Item>(getActiveDialogItem$, setActiveDialogItem);
  if (activeDialogItem) {
    if (props && props.activeDialogName !== DialogName.None) {
      activeDialogItem.content.props.isOpen = true;
    } else {
      activeDialogItem.content.props.isOpen = false;
    }
    return <ItemRenderer item={activeDialogItem.content} embeddedSimpleItemIdMap={undefined}></ItemRenderer>;
  } else {
    return null;
  }
};

export default DialogRenderer;
