import React, { ReactElement } from 'react';
import { Flex } from '@coreym/benchmark';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import ItemRenderer from '../ItemRenderer';
import Help from '../Help';

const  NewAssessment = (): ReactElement => { 
  const { fetchAllItems, tabs } = useTypedSelector((state: any) => state);
  const { hasVisited } = useTypedSelector((state: any) => state.hasVisited);
  const itemContent = fetchAllItems.fetchAllItems[tabs.tabNumber]; 
  const itemContent2 = fetchAllItems.fetchAllItems[15 /*fetchAllItems.fetchAllItems.length - 1*/]; 
  return (
    <>
    <Flex
      sx={{label: 'AppContainer', minHeight: 0, flexDirection: 'column', overflow: 'hidden'}}>
      <Flex justify="center" px={6} py={4}>      
          {itemContent && !hasVisited ? (
              <ItemRenderer item={itemContent.content} embeddedSimpleItemIdMap={itemContent2} tabNumber={tabs.tabNumber} />         
          ) : <Help />}      
      </Flex>
    </Flex>
    </>
  );
};

export default NewAssessment;
