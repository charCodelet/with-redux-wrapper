import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';

// eslint-disable-next-line
const TabsRenderer = (tabNums: any): ReactElement | null => {
  const { tabs } = useTypedSelector((state) => state);
  const { fetchItem2, getTabNumber, getBlockNumber, multipleSelect, singleSelect } = useActions();
  const handleSelect = (optionId: number) => {
    getTabNumber(optionId);
    getBlockNumber(tabNums.tabNums[optionId]);
    if (optionId < tabs.data.length - 1) {
      fetchItem2(`item/${tabNums.tabNums[optionId]}`);
    } else {
      fetchItem2(`item/BlockRev`);
    }
    multipleSelect('multiple_clear', tabs.tabNumber.toString());
    singleSelect('single_clear', tabs.tabNumber.toString());
  };
  return (
    tabs.data && (
      <Tabs
        align={'right'}
        style={{display: 'block'}}
        onChange={handleSelect}
      >
        <TabList>
          {/* eslint-disable-next-line*/}
          {tabs.data.map((v: any, i: number) => {
            return <Tab tabIndex={i === tabs.tabNumber ? 0 : -1} aria-selected={i === tabs.tabNumber} key={tabs.tabNumber}>{v.sequence + 1}</Tab>; // prettier-ignore
          })}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
