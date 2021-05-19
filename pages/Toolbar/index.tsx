import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Toolbar } from '@coreym/benchmark';
import { useToggle } from '../benchmark/util/hooks';

// eslint-disable-next-line
var canvas: HTMLElement, ctx: { beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; strokeStyle: string; lineWidth: number; stroke: () => void; closePath: () => void; fillStyle: string; fillRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clearRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; }, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black";
var y = 4; // 14; 
let nodes = [];

const ToolbarRenderer = (): ReactElement | null => {
  const [mathKey, setMathKey] = useState(false);
  const [textOn, setTextOn] = useState(false);
  const { dialogShow } = useTypedSelector((state) => state.dialog);
  const [stopTimer, setStopTimer] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [highlighterActive, setHighlighterActive] = useToggle();
  const [pencilActive, setPencilActive] = useToggle();
  const [eraserActive, setEraserActive] = useToggle();
  const [hasDrawn, setHasDrawn] = useState(false);
  const [num, setNum] = useState(1800 / 60);
  const intervalRef = useRef(null);
  const { calculator } = useTypedSelector((state) => state);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { theme } = useTypedSelector((state) => state.theme);
  const { data } = useTypedSelector((state) => state.tools);
  const { tabs } = useTypedSelector((state) => state);
  let { zoom } = useTypedSelector((state) => state.zoom);
  const { hasVisited } = useTypedSelector((state: any) => state.hasVisited);
  let { moveXY, coordinates } = useTypedSelector((state) => state.mouseMovements);
  const { getTabNumber, getBlockNumber, multipleSelect, setTheme, getScratch , changeZoom, showDialog, setKeyboard, fetchCalculatorElement, hasVisitedHelp } = useActions(); 

  const controllerScratchPad = new AbortController();
  const controller = new AbortController();

  function draw() {
    setHasDrawn(true)
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x; 
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
  }
  var curriedFn = (res: string, e: { clientX: number; clientY: number; }) => {
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
  
  var bindingMoveEvent = curriedFn.bind(this, 'move');
  var bindingDownEvent = curriedFn.bind(this, 'down');
  var bindingUpEvent = curriedFn.bind(this, 'up');

  useEffect(() => {
    if(!scratch && !clearCanvas) {
      // console.log('if([!scratch]',scratch,'&& [!clearCanvas]',clearCanvas,')');
      try {      
        canvas.style.pointerEvents = 'none';
      } catch(e) {
        // console.log(e.message)
      }
      return;
    } 

    if(hasDrawn && !clearCanvas) {
      // console.log('if(hasDrawn && !clearCanvas)');
      canvas.style.pointerEvents = 'all';
      return;
    }

    // console.log("This should be called once");

    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    x = 'black';
    y = 4; // 14;

    if(scratch) {
      // console.log('if( [scratch]',scratch,')');
      // console.log('add mouse listeners...');
      canvas.style.pointerEvents = 'all';
      canvas.addEventListener("mousemove", bindingMoveEvent, { signal: controllerScratchPad.signal });
      canvas.addEventListener("mousedown", bindingDownEvent, { signal: controllerScratchPad.signal });
      canvas.addEventListener("mouseup", bindingUpEvent, { signal: controllerScratchPad.signal });
     
      if(highlighterActive) x = 'yellow';
      else if(eraserActive) {
        x = 'white';
        y = 14
      }
      else setPencilActive();
    }
    else {
      if(highlighterActive) setHighlighterActive();
      if(eraserActive) setEraserActive(); 
    }
    return function cleanupListener() {
      // console.log('remove mouse listeners...'); 
      controllerScratchPad.abort();   
    }
  }, [scratch, tabs, clearCanvas]);
  
  useEffect(() => {
    if(pencilActive) {
      // console.log('run when pencil clicked');
      x = 'black';
    } 
    return () => {
      // console.log("cleanup pencil");
    }
  }, [pencilActive]);

  useEffect(() => {
    if(highlighterActive) {
      // console.log('run when highlighter clicked');
      x = 'yellow';
    } 
    return () => {
      // console.log("cleanup highlighter");
    }
  }, [highlighterActive]);

  useEffect(() => {
    if(eraserActive) {
      // console.log('run when eraser clicked');
      x = 'white';
      y = 14 
    } 
    return () => {
      // console.log("cleanup eraser");
    }
  }, [eraserActive]);

  const onClickScratch = () => {
    getScratch(!scratch);
    setClearCanvas(false);
    if(!scratch) {
      document.body.style.cursor = "url('cursors/Cur_Draw_Scratch.cur'), auto";
      // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber:"${tabs.blockNumber}} Open Scratchpad)}`);
    }
    else {
      document.body.style.cursor = 'default';
      // controllerScratchPad.abort();
      // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber:"${tabs.blockNumber}} Close Scratchpad)}`);
    }
  }
  const onClickClear = () => {
    console.log('clear scratchpad');
    setClearCanvas(true);
    console.log(highlighterActive, `--> highlighterActive`);
    console.log(pencilActive, `--> pencilActive`);
    console.log(eraserActive, `--> eraserActive`);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
  }
  const onClickHighlighter = () => {
    console.log('highlighter clicked');
    document.body.style.cursor = "url('cursors/Cur_Highlighter_Scratch.cur'), auto";
    if(pencilActive) setPencilActive();
    if(eraserActive) setEraserActive();
    setHighlighterActive();
  }
  const onClickEraser = () => {
    console.log('eraser clicked');
    document.body.style.cursor = "url('cursors/Cur_Erase_Scratch.cur'), auto"; 
    document.getElementById('pointerTest').style.pointerEvents = 'none';
    document.getElementById('pointerTest').style.zIndex = '2';
    if(highlighterActive) setHighlighterActive();
    if(pencilActive) setPencilActive();
    setEraserActive();   
  }
  const onClickPencil = () => {
    console.log('pencil clicked');
    document.body.style.cursor = "url('cursors/Cur_Draw_Scratch.cur'), auto";
    if(highlighterActive) setHighlighterActive();
    if(eraserActive) setEraserActive();
    setPencilActive();
  }


















  useEffect(() => {
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
    setNum(prev => {
      if(prev == /*29.94*/ /*27*/ 0) {
        setStopTimer(true);
        setTimeout(() => { // console.log('create asynchronous function so we can stop rendering the toolbar BEFORE we update the modal...')
          showDialog(dialogShow);
        });
        clearInterval(intervalRef.current);
        return 0; 
      }
      return (prev - 1/60).toFixed(2);
    });
  }
 
  const { id, toolbar, tools } = data;
  const progressFormula = (tabs.tabsData.length > 0) ? (100 / tabs.tabsData.length) * (tabs.tabNumber === 0 ? 1 : tabs.tabNumber + 1) : 0 // prettier-ignore


  const onClickCalculator = () => {
    fetchCalculatorElement(calculator.calculator, calculator.calculatorModel, true);
    if (calculator.calculator.current.style.visibility === 'hidden') calculator.calculator.current.style.visibility = 'visible'; // document.getElementById('calculatorDiv')
    else calculator.calculator.current.style.visibility = 'hidden'; 
  };
  const onClickZoomOut = () => changeZoom(+zoom.toFixed(2) - 0.1);
  const onClickZoomIn = () => changeZoom(+zoom.toFixed(2) + 0.1);
  const onClickTheme = () => setTheme(theme);
  const onClickHelp = () => {
    if (!hasVisited) hasVisitedHelp(true);
    else hasVisitedHelp(false);
  };
  const onClickMathKeyboard = async () => {
    setMathKey(!mathKey);
    setKeyboard(!mathKey);
  }
  
  var synth = window.speechSynthesis;
  let div = document.getElementById("scrollRef");
  let filter = function(node: { tagName: string }) {
    return node.tagName.toLowerCase() == "p" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  };  

  
 
  useEffect(() => {
    const startTalk = (v: { innerText: string; }) => {
      synth.speak(new SpeechSynthesisUtterance(v.innerText))
    }
    if(textOn) {   
      let iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, filter, false); // 4th parameter was false         
      let node = iterator.nextNode();
      while (node !== null) {    
        nodes.push(node)
        node.style.border = "1px solid black";
        node.style.cursor = "pointer"
        node = iterator.nextNode();       
      }
      nodes.forEach(function(v) {
        v.addEventListener('click', () => startTalk(v), { signal: controller.signal })
      })
    } 
    else {
      nodes.forEach(v => {
        v.style.border = "none";
        v.style.cursor = "default";       
      });
      synth.cancel();
    }
    return (() => {
      controller.abort();
    })
  }, [textOn])

  const onClickTTS = (text: boolean) => {
    console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} TextToSpeech TextToSpeech Mode ${!text == true ? 'On' : 'Off'}`);
    setTextOn(!text)
  }
  const nextItem = () => {
    getTabNumber(tabs.tabNumber + 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber + 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
    if(mathKey) {
      setKeyboard(!mathKey);
      setMathKey(!mathKey);
    }
    setClearCanvas(true);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const prevItem = () => {
    getTabNumber(tabs.tabNumber - 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber - 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber - 1).toString());
    if(mathKey) {
      setKeyboard(!mathKey);
      setMathKey(!mathKey);
    }
  };
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
        isHelpDisabled={!tools?.help?.enabled}
        isThemeDisabled={!tools?.theme?.enabled}
        isZoomInDisabled={zoom == 1.3}
        isZoomOutDisabled={zoom == 1.0}
        isLangDisabled={!tools?.bilingual?.enabled}
        isTTSDisabled={!tools?.readAloud?.enabled}
        isScratchDisabled={!tools?.scratchwork?.enabled || hasVisited}
        isEraserDisabled={false}
        isHighlighterDisabled={false}
        isPencilDisabled={false}
        onClickClear={onClickClear}
        


        onClickPencil={onClickPencil}
        isPencilActive={pencilActive}



        onClickHighlighter={onClickHighlighter}
        isHighlighterActive={highlighterActive}



        onClickEraser={onClickEraser}     
        isEraserActive={eraserActive}



        isClearDisabled={false}
        isMathKeyboardDisabled={tools?.mathKeyboard?.enabled}
        isCalculatorDisabled={!tools?.calculator?.enabled || hasVisited}
        isTimerDisabled={!tools?.timer?.enabled}
        isPrevDisabled={tabs.tabNumber === 0}
        isNextDisabled={tabs.tabNumber === tabs.data.length - 1 || scratch}
        isHelpActive={hasVisited}
        isTTSActive={textOn}
        isMathKeyboardActive={tools?.mathKeyboard?.activated}
        isCalculatorActive={tools?.calculator?.activated}
        isScratchActive={scratch}
        isTimerActive={true}
        hasMathKeyboard={!tools?.mathKeyboard?.visible} // hide & show buttons
        hasCalculator={tools?.calculator?.visible}
        hasTTS={tools?.readAloud?.visible}
        hasTimer={tools?.timer?.visible}
        hasProgress={tools?.progress?.visible}
        onClickTTS={() => onClickTTS(textOn)}
        onClickMathKeyboard={onClickMathKeyboard}
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
