import React, { ReactElement, useEffect } from 'react';
import { Flex } from '../../node_modules/@coreym/benchmark';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
// import LoadingIndicator from '../../components/shared/LoadingIndicator';

// components
import ItemRenderer from '../ItemRenderer';

// interfaces
import { Item } from '../../types/src/stateMachineTypes/Widget';

const NewAssessment = (): ReactElement => {
  const { item, item2, tabs } = useTypedSelector((state) => state);
  const { /*fetchItem, fetchItem2,*/ fetchStart } = useActions();
  useEffect(() => {
    console.log('called once');
    fetchStart('start');
    // fetchItem('item/VH447209');
    // fetchItem2('item/VH447212');
  }, [item, item2, tabs]);
  const itemContent = item.data;
  const itemContent2 = item2.data2;
  // console.log(tabs && tabs.data[0] && tabs.data[0].simpleItemIdsInComplexItem[0], `--> tabs.data[0].simpleItemIdsInComplexItem[0]`); // prettier-ignore
  const getEmbeddedSimpleItemsMap = new Map<string, Item>();
  [tabs && tabs.data[0] && tabs.data[0].simpleItemIdsInComplexItem[0]].map((sid: string) => getEmbeddedSimpleItemsMap.set(sid, itemContent)); // prettier-ignore
  // console.log(itemContent2.content, `--> itemContent2.content`);
  // console.log(getEmbeddedSimpleItemsMap, `--> getEmbeddedSimpleItemsMap`);
  if (
    tabs &&
    tabs.data[0] &&
    tabs.data[0].simpleItemIdsInComplexItem[0] &&
    itemContent2 &&
    itemContent2.content &&
    itemContent &&
    itemContent.content
  ) {
    return (
      <Flex
        sx={{
          label: 'AppContainer',
          minHeight: 0,
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* <Flex justify="center" px={6} py={4}> */}
        {itemContent2.content ? (
          <ItemRenderer item={itemContent2.content} embeddedSimpleItemIdMap={getEmbeddedSimpleItemsMap} />
        ) : null}
        {/* </Flex> */}
      </Flex>
    );
  } else {
    return null;
  }
};

export default NewAssessment;
