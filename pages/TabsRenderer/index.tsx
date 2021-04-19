import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';
// import { Link } from 'next/link';

// eslint-disable-next-line
const TabsRenderer = (): ReactElement | null => {
  const { tabs } = useTypedSelector((state) => state);
  const { /*fetchItem2,*/ getTabNumber /*, getBlockNumber, multipleSelect, singleSelect*/ } = useActions();
  const handleSelect = (optionId: number) => {
    getTabNumber(optionId);
    // getBlockNumber(tabs.tabsData[optionId].id);
    // console.log(tabs.tabsData[optionId].id, `--> tabs.tabsData[`,optionId,`].id`);
    // console.log(`item/${tabs.tabsData[optionId].id}`);
    // if (optionId < tabs.tabsData.length - 1) {
    //   // fetchItem2(`item/${tabs.tabsData[optionId].id}`);
    // } else {
    //   // fetchItem2(`item/BlockRev`);
    // }
    // multipleSelect('multiple_clear', tabs.tabNumber.toString());
    // singleSelect('single_clear', tabs.tabNumber.toString());
  };
  // console.log(tabs, `--> tabs`);
  return (
    tabs.data && (
      <Tabs
        align={'right'}
        style={{display: 'block'}}
        onChange={handleSelect}
      >
        <TabList>
          {tabs.tabsData.map((v: any, i: number) => {
            return <Tab tabIndex={i === tabs.tabNumber ? 0 : -1} aria-selected={i === tabs.tabNumber} key={tabs.tabNumber}>{v.sequence || v.sequence == 0 ? v.sequence + 1 : "Block"}</Tab>; // prettier-ignore
          })}
        </TabList>
      </Tabs>
    )
  );
};

export default TabsRenderer;
