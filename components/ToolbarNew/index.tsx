import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Toolbar } from '@coreym/benchmark';

// eslint-disable-next-line
const ToolbarConnector = (tabNums: any): ReactElement | null => {
  const [num, setNum] = useState(1800 / 60);
  // const [help, setHelp] = useState(0);
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000 * 60);
    return () => clearInterval(intervalRef.current);
  }, []);
  const decreaseNum = () => setNum((prev) => prev - 1);
  const { calculator } = useTypedSelector((state) => state.calculator);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { theme } = useTypedSelector((state) => state.theme);
  const { data } = useTypedSelector((state) => state.tools);
  const { tabs } = useTypedSelector((state) => state);
  let { zoom } = useTypedSelector((state) => state.zoom);
  const { getTabNumber, getBlockNumber, fetchItem2, multipleSelect, setTheme, getScratch , changeZoom } = useActions(); // prettier-ignore
  const { id, toolbar, tools } = data;
  const progressFormula = (tabs.data.length > 0) ? (100 / tabs.data.length) * (tabs.tabNumber === 0 ? 1 : tabs.tabNumber + 1) : 0 // prettier-ignore
  const onClickZoomOut = () => {
    // console.log('zoom out');
    zoom = +zoom.toFixed(2);
    changeZoom(zoom - 0.1);
  };
  const onClickZoomIn = () => {
    // console.log('zoom in');
    zoom = +zoom.toFixed(2);
    changeZoom(zoom + 0.1);
  };
  const onClickCalculator = () => {
    if (calculator.current.style.visibility === 'hidden') {
      calculator.current.style.visibility = 'visible';
    } else {
      calculator.current.style.visibility = 'hidden';
    }
  };
  const onClickTheme = () => setTheme(theme);
  const onClickScratch = () => getScratch(!scratch);
  const nextItem = () => {
    getTabNumber(tabs.tabNumber + 1);
    getBlockNumber(tabNums.tabNums[tabs.tabNumber + 1]);
    fetchItem2(`item/${tabNums.tabNums[tabs.tabNumber + 1]}`);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
  };
  const prevItem = () => {
    getTabNumber(tabs.tabNumber - 1);
    getBlockNumber(tabNums.tabNums[tabs.tabNumber - 1]);
    fetchItem2(`item/${tabNums.tabNums[tabs.tabNumber - 1]}`);
    multipleSelect('multiple_clear', (tabs.tabNumber - 1).toString());
  };
  return (
    data && (
      <Toolbar
        id={id} // dom
        label={toolbar?.title}
        blockTitle={'Cognitive Demo Block 1'} // data
        itemTitle={tabs.blockNumber}
        language={tools?.bilingual?.language}
        progress={progressFormula}
        timeLeft={`${num} minutes`}
        isDisabled={!toolbar?.enabled}
        isHelpDisabled={tools?.help?.enabled}
        isThemeDisabled={!tools?.theme?.enabled}
        isZoomInDisabled={!tools?.zoomIn?.enabled}
        isZoomOutDisabled={/*!tools?.zoomOut?.enabled ||*/ zoom == 1.0}
        isLangDisabled={!tools?.bilingual?.enabled}
        isTTSDisabled={!tools?.readAloud?.enabled}
        isScratchDisabled={!tools?.scratchwork?.enabled}
        isPencilDisabled={false}
        isHighlighterDisabled={false}
        isEraserDisabled={false}
        isClearDisabled={false}
        isMathKeyboardDisabled={!tools?.mathKeyboard?.enabled}
        isCalculatorDisabled={!tools?.calculator?.enabled}
        isTimerDisabled={!tools?.timer?.enabled}
        isPrevDisabled={tabs.tabNumber === 0}
        isNextDisabled={tabs.tabNumber === tabs.data.length - 1}
        isHelpActive={tools?.help?.activated}
        isTTSActive={tools?.bilingual?.activated}
        isMathKeyboardActive={tools?.mathKeyboard?.activated}
        isCalculatorActive={tools?.calculator?.activated}
        isScratchActive={scratch}
        isPencilActive={scratch}
        isHighlighterActive={scratch}
        isEraserActive={scratch}
        isTimerActive={true}
        hasMathKeyboard={tools?.mathKeyboard?.visible} // hide & show buttons
        hasCalculator={tools?.calculator?.visible}
        hasTTS={tools?.readAloud?.visible}
        hasTimer={tools?.timer?.visible}
        hasProgress={tools?.progress?.visible}
        onClickCalculator={onClickCalculator}
        // onClickHelp={onClickHelp}
        onClickTheme={onClickTheme}
        onClickPrev={prevItem}
        onClickNext={nextItem}
        onClickScratch={onClickScratch}
        onClickZoomOut={onClickZoomOut}
        onClickZoomIn={onClickZoomIn}
      />
    )
  );
};

export default ToolbarConnector;
