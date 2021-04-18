import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';
// import { Link } from 'next/link';

// eslint-disable-next-line
const TabsRenderer = (): ReactElement | null => {
  const { tabs } = useTypedSelector((state) => state);
  const { fetchItem2, getTabNumber, /*getBlockNumber,*/ multipleSelect, singleSelect } = useActions();
  const handleSelect = (optionId: number) => {
    getTabNumber(optionId);
    // getBlockNumber(tabNums.tabNums[optionId]);
    if (optionId < tabs.data.length - 1) {
      // fetchItem2(`item/${tabNums.tabNums[optionId]}`);
    } else {
      fetchItem2(`item/BlockRev`);
    }
    multipleSelect('multiple_clear', tabs.tabNumber.toString());
    singleSelect('single_clear', tabs.tabNumber.toString());
  };
  // console.log(tabs, `--> tabs`);
  // console.log(tabNums, `--> tabNums`);
  // console.log(Object.values(tabNums.tabNums));
  return (
    tabs.data && (
      <Tabs
        align={'right'}
        style={{display: 'block'}}
        onChange={handleSelect}
      >
        <TabList>
          {/* eslint-disable-next-line*/}
          {tabs.data /*Object.values(tabNums.tabNums)*/.map((v: any, i: number) => {
            // console.log(v, `--> v`);
            return <Tab tabIndex={i === tabs.tabNumber ? 0 : -1} aria-selected={i === tabs.tabNumber} key={tabs.tabNumber}>{v.sequence + 1}</Tab>; // prettier-ignore
          })}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
