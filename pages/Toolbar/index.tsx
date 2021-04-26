import React, { ReactElement, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Toolbar } from '@coreym/benchmark';
import { useToggle } from '../benchmark/util/hooks';

// eslint-disable-next-line


var canvas, ctx, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black";
var y = 14; // 40;

const ToolbarRenderer = (): ReactElement | null => {
  const { dialogShow } = useTypedSelector((state) => state.dialog);
  const [stopTimer, setStopTimer] = useState(false);
  const [highlighterActive, setHighlighterActive] = useToggle();
  const [pencilActive, setPencilActive] = useToggle();
  const [eraserActive, setEraserActive] = useToggle();
  const [notSelf, setNotSelf] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [num, setNum] = useState(1800 / 60);
  const router = useRouter();
  const intervalRef = useRef(null);
  const { calculator } = useTypedSelector((state) => state.calculator);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { theme } = useTypedSelector((state) => state.theme);
  const { data } = useTypedSelector((state) => state.tools);
  const { tabs } = useTypedSelector((state) => state);
  let { zoom } = useTypedSelector((state) => state.zoom);
  const { getTabNumber, getBlockNumber, multipleSelect, setTheme, getScratch , changeZoom, showDialog } = useActions(); // prettier-ignore


  useEffect(() => {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; //canvas.width; 
    canvas.height = window.innerHeight; //canvas.height; 
    x = 'black';
    y = 14;
    function draw() {
      setHasDrawn(true);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = x; 
      ctx.lineWidth = y;
      ctx.stroke();
      ctx.closePath();
    }
    var curriedFn = (res, e) => {
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
          setHasDrawn(true);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currX, currY);
          ctx.strokeStyle = x; 
          ctx.lineWidth = y;
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    if(scratch) {
      console.log('if(',scratch);
      var bindingMoveEvent = curriedFn.bind(this, 'move');
      var bindingDownEvent = curriedFn.bind(this, 'down');
      var bindingUpEvent = curriedFn.bind(this, 'up');
      canvas.addEventListener("mousemove", bindingMoveEvent, false);
      canvas.addEventListener("mousedown", bindingDownEvent, false);
      canvas.addEventListener("mouseup", bindingUpEvent, false);
      // canvas.addEventListener("mousemove", curriedFn('move'), true);
      // canvas.addEventListener("mousedown", curriedFn('down'));
      // canvas.addEventListener("mouseup", curriedFn('up'));
    }
   
    return function cleanupListener() {
      console.log('remove mousemove listeners...');
      canvas.removeEventListener("mousemove", bindingMoveEvent, false);
      canvas.removeEventListener("mousedown", bindingDownEvent, false);
      canvas.removeEventListener("mouseup", bindingUpEvent, false);
      // canvas.removeEventListener('mousemove', curriedFn('move'), true)
      // canvas.removeEventListener('mousedown', curriedFn('down'), false)
      // canvas.removeEventListener('mouseup', curriedFn('up'), false)
    }
  }, [scratch]);
  
  // useEffect(() => {
  //   console.log('run when scratch clicked');
  //   return () => {
  //     console.log("cleanup scratch");
  //   }
  // }, [scratch]);
  // useEffect(() => {
  //   console.log('run when pencil clicked');
  //   return () => {
  //     console.log("cleanup pencil");
  //   }
  // }, [pencilActive]);
  // useEffect(() => {
  //   console.log('run when highlighter clicked');
  //   return () => {
  //     console.log("cleanup highlighter");
  //   }
  // }, [highlighterActive]);
  // useEffect(() => {
  //   console.log('run when eraser clicked');
  //   return () => {
  //     console.log("cleanup eraser");
  //   }
  // }, [eraserActive]);

  useEffect(() => {
    // console.log('useEffect called with no dependencies');
    if(stopTimer) {
      console.log('if( [stopTimer]',stopTimer,')');
        showDialog(!dialogShow);
    } 
  }, []);
  useEffect(() => {
    // console.log('useEffect called with tabs as dependency');
    intervalRef.current = setInterval(decreaseNum, (1000 * 60 / 60).toFixed(2));
    return () => {
      // console.log('clearing interval for timer');
      clearInterval(intervalRef.current);
      setNum(30);
    }
  }, [tabs]);
  const decreaseNum = () => {
    // console.log('decreaseNum called');
    setNum(prev => {
      if(prev == /*27*/0) {
        // console.log('if(',prev,' == 27)');
        setStopTimer(true);
        setTimeout(() => {
          // console.log('create asynchronous function so we can stop rendering the toolbar BEFORE we update the modal...')
          showDialog(dialogShow);
        });
        clearInterval(intervalRef.current);
        return 0; 
      }
      // console.log('else(',prev,'==',(prev - 1/60).toFixed(2))
      return (prev - 1/60).toFixed(2);
    });
  }


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










  const onClickScratch = () => {
    getScratch(!scratch);
    // setPencilActive(); 
    // onClickPencil();
  };
  const onClickClear = () => document.getElementById("can").style.display = "none";
  const onClickHighlighter = () => {
    document.body.style.cursor = "url('cursors/Cur_Highlighter_Scratch.cur'), auto"; 
    setNotSelf(true);
    if(highlighterActive) {
      console.log('if( [highlighterActive]',highlighterActive,`)`)
      return;
    }
    else {
      console.log('else( [!highlighterActive]',highlighterActive,`)`)
      setHighlighterActive();
      if(pencilActive) {
        console.log('if( [pencilActive]',pencilActive,`)`)
        setPencilActive();
      } else if(eraserActive) {
        console.log('else if( [eraserActive]',eraserActive,`)`)
        setEraserActive(); 
      }
      x = 'yellow';
    }
  }
  const onClickEraser = () => {
    document.body.style.cursor = "url('cursors/Cur_Erase_Scratch.cur'), auto"; 
    // canvas.style.pointerEvents = 'none';
    document.getElementById('pointerTest').style.pointerEvents = 'none';
    document.getElementById('pointerTest').style.zIndex = '2';
    if(eraserActive) {
      console.log('if( [eraserActive]',eraserActive,`)`)
      return;
    }
    else {
      console.log('else( [!eraserActive]',eraserActive,`)`)
      setEraserActive();
      if(highlighterActive) {
        console.log('if( [highlighterActive]',highlighterActive,`)`)
        setHighlighterActive();
      } else if(pencilActive) {
        console.log('else if( [pencilActive]',pencilActive,`)`)
        setPencilActive(); 
      }
      if(x == 'black') {
        console.log('if( [x]',x,`== black)`)
        x = 'white'
      } else {
        console.log('else( [x]',x,`!= black)`)
        x = 'black';
      }
      x = 'white';
      y = 14 // 40;
    }
  }
  const onClickPencil = () => {
    document.body.style.cursor = "url('cursors/Cur_Draw_Scratch.cur'), auto"; 
    // setNotSelf(true);
    if(pencilActive && scratch && !notSelf) {
      console.log('if( [pencilActive]',pencilActive,'&& [scratch]',scratch,'&& [notSelf]',notSelf,')');
        canvas.style.pointerEvents = 'none';
        document.body.style.cursor = 'default';
        return;
    }
    else if(pencilActive || notSelf) {
      console.log('else if( [pencilActive]',pencilActive,'|| [notSelf]',notSelf,')');
      setPencilActive();
      x = 'black';
      console.log('return');
      if(highlighterActive) {
        console.log('if( [highlighterActive]',highlighterActive,`)`)
        setHighlighterActive();
      } else if(eraserActive) {
        console.log('else if( [eraserActive]',eraserActive,`)`)
        setEraserActive(); 
      }
      return;
    } 
    else if(hasDrawn) {
      console.log('else if(hasDrawn)');
      canvas.style.pointerEvents = 'all';
      console.log(pencilActive, `--> pencilActive`);
      console.log(`\n\n\n`);
      // document.body.style.cursor = 'default'; // new
      return;
    }
    else {
      console.log('else( [pencilActive]',pencilActive,', [scratch]',scratch,', [notSelf]',notSelf,')');
      document.body.style.cursor = "url('cursors/Cur_Draw_Scratch.cur'), auto"; 
      setPencilActive();
      if(highlighterActive) {
        console.log('if( [highlighterActive]',highlighterActive,`)`)
        setHighlighterActive();
      } else if(eraserActive) {
        console.log('else if( [eraserActive]',eraserActive,`)`)
        setEraserActive(); 
      }
    }
    
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; //canvas.width; 
    canvas.height = window.innerHeight; //canvas.height; 
    x = 'black';
    y = 14;
   

    canvas.addEventListener("mousemove", function (e) {findxy('move', e)}, false);
    canvas.addEventListener("mousedown", function (e) {findxy('down', e)}, false);
    canvas.addEventListener("mouseup", function (e) {findxy('up', e)}, false);
    // canvas.addEventListener("mouseout", function (e) {findxy('out', e)}, false);

    function draw() {
      console.log(x, `----> x`);
      setHasDrawn(true);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = x; 
      ctx.lineWidth = y;
      ctx.stroke();
      ctx.closePath();
    }
    function findxy(res, e) {
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

  };










  const onClickHelp = () => {
    if (router.pathname == '/') {
      router.push('/help');
    } else {
      router.push('/');
    }
  };
  const nextItem = () => {
    console.log(tabs.tabsData[tabs.tabNumber + 1], `--> tabs`);
    getTabNumber(tabs.tabNumber + 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber + 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
  };
  const prevItem = () => {
    getTabNumber(tabs.tabNumber - 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber - 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber - 1).toString());
  };
  // console.log(tabs, `--> tabs toolbar`);
  // console.log(tools, `--> tools toolbar`);
  // console.log(toolbar, `--> toolbar toolbar`);
  // const setHighlighterActive = () => {
  //   return false;
  // }
  return (
    data && (
      <Toolbar
        id={id} 
        label={toolbar?.title}
        blockTitle={tabs?.blockTitle} 
        itemTitle={tabs.blockNumber}
        language={tools?.bilingual?.language}
        progress={progressFormula}
        timeLeft={`${num} minutes`}
        isDisabled={!toolbar?.enabled}
        isHelpDisabled={tools?.help?.enabled}
        isThemeDisabled={!tools?.theme?.enabled}
        isZoomInDisabled={/*!tools?.zoomIn?.enabled*/zoom == 1.3}
        isZoomOutDisabled={zoom == 1.0}
        isLangDisabled={!tools?.bilingual?.enabled}
        isTTSDisabled={!tools?.readAloud?.enabled}
        isScratchDisabled={!tools?.scratchwork?.enabled}
        isEraserDisabled={false}
        isHighlighterDisabled={false}
        isPencilDisabled={false}
        onClickClear={onClickClear}
        


        onClickPencil={onClickPencil}
        isPencilActive={pencilActive}



        onClickHighlighter={onClickHighlighter}
        isHighlighterActive={highlighterActive /*tools?.highlighter?.active*/}



        onClickEraser={onClickEraser}     
        isEraserActive={eraserActive}



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
       
        
        isTimerActive={true}
        hasMathKeyboard={tools?.mathKeyboard?.visible} // hide & show buttons
        hasCalculator={tools?.calculator?.visible}
        hasTTS={tools?.readAloud?.visible}
        hasTimer={tools?.timer?.visible}
        hasProgress={tools?.progress?.visible}
       
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
