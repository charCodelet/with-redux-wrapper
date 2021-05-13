import React, { ReactElement } from 'react';
import { Flex } from '@coreym/benchmark';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import ItemRenderer from '../ItemRenderer';

const  NewAssessment = (): ReactElement => { 
  const { fetchAllItems, tabs } = useTypedSelector((state: any) => state);
  const itemContent = fetchAllItems.fetchAllItems[tabs.tabNumber]; 
  const itemContent2 = fetchAllItems.fetchAllItems[15/*fetchAllItems.fetchAllItems.length - 1*/]; 

  // const treeValues = []; // make a variable for tree values     
  // function traverseDFS(root) {
  //   if (!root.children) {
  //     return false;
  //   } 
  //   let current = root.children; // current values always starts at root
  //   current.forEach(v => {
  //     if(v.children) {
  //       console.log(v.children);
  //       // console.log(p.replace('dog', 'monkey'));
  //       // v.children.
  //       treeValues.push(v.children);
  //       traverseDFS(v)
  //     }
  //   })
  //   return treeValues;
  // }
  // const allChildren = traverseDFS(itemContent2.content);
  // console.log(treeValues);


  // console.log(itemContent2, `--> itemContent2`);
  return (
    <>
    <Flex
      sx={{label: 'AppContainer', minHeight: 0, flexDirection: 'column', overflow: 'hidden'}}>
      <Flex justify="center" px={6} py={4}>      
          {itemContent ? (
              <ItemRenderer item={itemContent.content} embeddedSimpleItemIdMap={itemContent2} tabNumber={tabs.tabNumber} />         
          ) : null}      
      </Flex>
    </Flex>
    </>
  );
};

export default NewAssessment;
