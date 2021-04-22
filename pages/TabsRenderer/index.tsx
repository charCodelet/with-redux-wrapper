import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';

const TabsRenderer = (): ReactElement | null => {
  const { tabs } = useTypedSelector((state: any) => state);
  const { getTabNumber, getBlockNumber, multipleSelect } = useActions();
  const handleSelect = (optionId: number) => {
    // console.log(tabs, `--> tabs`);
    getBlockNumber(tabs.tabsData[optionId].id);
    getTabNumber(optionId);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
  };
  return (
    tabs.data && (
      <Tabs align={'right'} style={{display: 'block'}} onChange={handleSelect}>
        <TabList>
          {tabs.tabsData.slice(0, 15).map((v: any, i: number) => <Tab tabIndex={i === tabs.tabNumber ? 0 : -1} aria-selected={i === tabs.tabNumber} key={tabs.tabNumber}>{v.sequence + 1 }</Tab>)}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
