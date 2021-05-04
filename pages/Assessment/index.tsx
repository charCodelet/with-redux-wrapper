import React, { ReactElement, useState } from 'react';
import { Flex } from '@coreym/benchmark';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import ItemRenderer from '../ItemRenderer';

const  NewAssessment = (): ReactElement => { 
  const { fetchAllItems, tabs } = useTypedSelector((state: any) => state);
  const { mathSSR } = useTypedSelector((state) => state);
  // useEffect(() => {
  //   if((tabs.tabNumber + 1) == 4) {
  //     console.log(mathSSR, `--> mathSSR`);
  //   }
  // },[tabs])
  // console.log(fetchAllItems.fetchAllItems, `--> fetchAllItems.fetchAllItems`);
  // console.log(tabs.tabNumber, `--> tabs.tabNumber`);
  const itemContent = fetchAllItems.fetchAllItems[tabs.tabNumber]; 
  const itemContent2 = fetchAllItems.fetchAllItems[15/*fetchAllItems.fetchAllItems.length - 1*/]; 
  // console.log(itemContent.content, `--> itemContent.content`);
  // console.log(itemContent2, `--> itemContent2`)
  return (
    <>
    <Flex
      sx={{label: 'AppContainer', minHeight: 0, flexDirection: 'column', overflow: 'hidden'}}>
      <Flex justify="center" px={6} py={4}>      
          {itemContent ? (
              <ItemRenderer item={itemContent.content} embeddedSimpleItemIdMap={itemContent2} tabNumber={tabs.tabNumber} mathSSR={(tabs.tabNumber + 1) == 4 ? mathSSR : null} />         
          ) : null}      
      </Flex>
    </Flex>
    </>
  );
};

export default NewAssessment;
