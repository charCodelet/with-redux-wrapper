import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';

const TabsRenderer = (): ReactElement | null => {
  const { tabs } = useTypedSelector((state: any) => state);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { getTabNumber, getBlockNumber, multipleSelect } = useActions();
  const handleSelect = (optionId: number) => {
    // console.log(tabs, `--> tabs`);
    // document.getElementById("can").remove();
    document.getElementById('can').getContext('2d').clearRect(0, 0, 800, 800);
    getBlockNumber(tabs.tabsData[optionId].id);
    getTabNumber(optionId);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
  };
  console.log(scratch, `--> scratch`)
  return (
    tabs.data && !scratch && (
      <Tabs align={'right'} style={{display: 'block'}} onChange={handleSelect}>
        <TabList>
          {tabs.tabsData.slice(0, 15).map((v: any, i: number) => <Tab tabIndex={i === tabs.tabNumber ? 0 : -1} aria-selected={i === tabs.tabNumber} key={tabs.tabNumber}>{v.sequence + 1 }</Tab>)}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
