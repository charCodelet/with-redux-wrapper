import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab } from '@coreym/benchmark';
import { useActions } from '../../hooks/useActions';
// import * as styles from './TabRenderer.styles';
// import './tabStyles.css'; // Import regular stylesheet

const TabsRenderer = (): ReactElement | null => {
  const router = useRouter();
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
    tabs.data && /*!scratch &&*/ (
      <Tabs align={'right'} style={{display: 'block'}} onChange={handleSelect}>
        <TabList sx={{opacity: router.pathname == '/help' ? '.5' : '1'}}>
          {tabs.tabsData.slice(0, 15).map((v: any, i: number) => <Tab 
          isDisabled={router.pathname == '/help' ? true : false} 
          style={{pointerEvents: router.pathname == '/help' ? 'none' : 'all'}}
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
