import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Toolbar } from '@coreym/benchmark';

// eslint-disable-next-line
const ToolbarRenderer = (tabNums: any): ReactElement | null => {
  const [num, setNum] = useState(1800 / 60);
  const router = useRouter();
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
  const progressFormula = (tabs.tabsData.length > 0) ? (100 / tabs.tabsData.length) * (tabs.tabNumber === 0 ? 1 : tabs.tabNumber + 1) : 0 // prettier-ignore
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
  var canvas: HTMLElement; 
  var ctx: { beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; strokeStyle: string; lineWidth: number; stroke: () => void; closePath: () => void; fillStyle: string; fillRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; };
  var flag = false;
  var prevX = 0;
  var currX = 0;
  var prevY = 0;  
  var currY = 0;
  var w: number;
  var h: number;
  var dot_flag = false;
  
  var x = "black";
  var y = 2;
  const onClickClear = () => {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("can").style.display = "none";
  }
  const onClickEraser = () => {
    switch ("white") {
      case "yellow":
          x = "yellow";
          break;
      case "white":
          x = "white";
          break;
  }
  if (x == "white") y = 14;
  else y = 2;
   
  }
  const onClickPencil = () => {
    const draw = () => {
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = x;
      ctx.lineWidth = y;
      ctx.stroke();
      ctx.closePath();
    }
    const findxy = (res: string, e: MouseEvent) => {
      if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        flag = true;
        dot_flag = true;
        if (dot_flag) {
          ctx.beginPath();
          ctx.fillStyle = x;
          ctx.fillRect(currX, currY, 2, 2);
          ctx.closePath();
          dot_flag = false;
        }
      }
      if (res == 'up' || res == "out") {
        flag = false;
      }
      if (res == 'move') {
        if (flag) {
          prevX = currX;
          prevY = currY;
          currX = e.clientX - canvas.offsetLeft;
          currY = e.clientY - canvas.offsetTop;
          draw();
        }
      }
    }
    canvas = document.getElementById('can');
    ctx = canvas?.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; //canvas.width; // window.innerWidth;
    canvas.height = window.innerHeight; //canvas.height; // window.innerHeight;
    canvas.addEventListener("mousemove", (e) => findxy('move', e));
    canvas.addEventListener("mousedown", (e) => findxy('down', e));
    canvas.addEventListener("mouseup", (e) => findxy('up', e));
    canvas.addEventListener("mouseout", (e) => findxy('out', e));
  }
  const onClickScratch = () => {
    getScratch(!scratch) 
  };
  const onClickHelp = () => {
    console.log(router.pathname, `--> router.pathname`);
    if (router.pathname == '/') {
      router.push('/help');
    } else {
      router.push('/');
    }
  };
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
  // console.log(tabs, `--> tabs toolbar`);
  // console.log(tools, `--> tools toolbar`);
  // console.log(toolbar, `--> toolbar toolbar`);
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
        isZoomOutDisabled={zoom == 1.0}
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
        onClickClear={onClickClear}
        onClickEraser={onClickEraser}
        onClickPencil={onClickPencil}
        onClickCalculator={onClickCalculator}
        onClickHelp={onClickHelp}
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

export default ToolbarRenderer;
