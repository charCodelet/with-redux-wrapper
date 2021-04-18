import React, { ReactElement, useEffect } from 'react';
import { Flex } from '@coreym/benchmark';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import LoadingIndicator from '../../pages/shared/LoadingIndicator';

// components
import ItemRenderer from '../ItemRenderer';

// interfaces
import { Item } from '../../types/src/stateMachineTypes';

const NewAssessment = (): ReactElement => {
  // console.log(props.tabNums, `--> props`);
  const { item, item2, tabs } = useTypedSelector((state) => state);
  const { fetchItem, fetchItem2 } = useActions();
  useEffect(() => {
    fetchItem('item/VH447209');
    fetchItem2('item/VH447212');
  }, []);
  // console.log(tabs, `--> tabs`);
  const itemContent = item.data;
  const itemContent2 = item2.data2;
  const getEmbeddedSimpleItemsMap = new Map<string, Item>();
  [tabs && tabs.data[0] && tabs.data[0].nestedItemIds[0]].map((sid: string) => getEmbeddedSimpleItemsMap.set(sid, itemContent)); // prettier-ignore
  if (
    tabs &&
    tabs.data[0] &&
    tabs.data[0].nestedItemIds[0] &&
    itemContent2 &&
    itemContent2.content &&
    itemContent &&
    itemContent.content
  ) {
    return (
      <>
      <Flex
        sx={{
          label: 'AppContainer',
          minHeight: 0,
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Flex justify="center" px={6} py={4}>
          {itemContent2.content ? (
            <ItemRenderer item={itemContent2.content} embeddedSimpleItemIdMap={getEmbeddedSimpleItemsMap} />
          ) : null}
        </Flex>
      </Flex>
      </>
    );
  } else {
    return <LoadingIndicator />;
  }
};

export default NewAssessment;
