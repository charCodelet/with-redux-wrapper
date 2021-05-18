import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';

const TabsRenderer = (): ReactElement | null => {
  const { tabs } = useTypedSelector((state: any) => state);
  const { hasVisited } = useTypedSelector((state: any) => state.hasVisited);
  const { getTabNumber, getBlockNumber, multipleSelect, setKeyboard } = useActions();

  const handleSelect = (optionId: number) => {
    document.getElementById('can').getContext('2d').clearRect(0, 0, 800, 800);
    getBlockNumber(tabs.tabsData[optionId].id);
    getTabNumber(optionId);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
    
    setKeyboard(false);
  };
  // console.log(tabs.tabNumber, `--> tabs.tabNumber`);
  // tabs.tabNumber = 8;
  return (
    tabs.data &&  (
      <Tabs align={'right'} style={{display: 'block'}} onChange={handleSelect}>
        <TabList sx={{opacity: hasVisited ? '.5' : '1'}}>
          {tabs.tabsData.slice(0, 15).map((v: any, i: number) => <Tab 
          isDisabled={hasVisited ? true : false} 
          style={{pointerEvents: hasVisited ? 'none' : 'all'}}
          tabIndex={i === tabs.tabNumber ? 0 : -1} 
          aria-selected={i === tabs.tabNumber} 
          key={tabs.tabNumber}>
            {v.sequence + 1 }
            </Tab>)}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
