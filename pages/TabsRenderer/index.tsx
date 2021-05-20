import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';

const TabsRenderer = (): ReactElement | null => {
  const { tabs } = useTypedSelector((state: any) => state);
  const { getCanvas } = useTypedSelector((state: any) => state.saveCanvas);
  const { hasVisited } = useTypedSelector((state: any) => state.hasVisited);
  const { isKeyboardSet } = useTypedSelector((state: any) => state.isKeyboardSet);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { getTabNumber, getBlockNumber, multipleSelect, setKeyboard } = useActions();

  const handleSelect = (optionId: number) => {
    getCanvas.getContext('2d').clearRect(0, 0, 800, 800); 
    getBlockNumber(tabs.tabsData[optionId].id);
    getTabNumber(optionId);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
    console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.tabsData[optionId].id}} Clicked on Tab ${optionId + 1})}`);
    if(isKeyboardSet) {
      setKeyboard(!isKeyboardSet);
    }
  };
  return (
    tabs.data &&  (
      <Tabs align={'right'} onChange={handleSelect}>
        <TabList 
          sx={{opacity: hasVisited || scratch ? '.5' : '1'}}
        >
          {tabs.tabsData.slice(0, 15).map((v: any, i: number) => 
          <Tab 
            isDisabled={hasVisited || scratch ? true : false} 
            style={{pointerEvents: hasVisited || scratch ? 'none' : 'all'}}
            tabIndex={i === tabs.tabNumber ? 0 : -1} 
            aria-selected={i === tabs.tabNumber} 
            key={tabs.tabNumber}
          >
            {v.sequence + 1 }
          </Tab>)}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
