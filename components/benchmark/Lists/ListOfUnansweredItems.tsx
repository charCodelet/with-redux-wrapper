import React, { ReactElement, useState } from 'react';
import { WidgetMap } from '../../../interfaces/renderer/WidgetMap';

import { getIsAnsweredForAllItems$ } from '@enaep-ng/student-assessment-store';
import { useRxJsSelector } from '../../../hooks/stateMachineHooks';
import { ItemHeader } from '@enaep-ng/types';

const ListOfUnansweredItemsConnector = (): ReactElement | null => {
  console.log('ListOfUnansweredItemsConnector');
  const [isAnsweredForAllItems, setIsAnsweredForAllItems] = useState<
    { itemHeader: ItemHeader; responseCount: number; isAnswered: boolean }[]
  >();

  useRxJsSelector<{ itemHeader: ItemHeader; responseCount: number; isAnswered: boolean }[]>(
    getIsAnsweredForAllItems$,
    setIsAnsweredForAllItems,
  );
  if (isAnsweredForAllItems && isAnsweredForAllItems.length > 0) {
    return (
      <WidgetMap.List>
        {isAnsweredForAllItems.map(({ itemHeader, isAnswered }) => {
          if (!isAnswered && itemHeader.id !== 'BlockRev' && itemHeader.id !== 'ThankYou') {
            return (
              <WidgetMap.ListItem key={itemHeader.sequence}> Question {itemHeader.sequence + 1}</WidgetMap.ListItem>
            );
          }
        })}
      </WidgetMap.List>
    );
  } else {
    return null;
  }
};
export default ListOfUnansweredItemsConnector;
