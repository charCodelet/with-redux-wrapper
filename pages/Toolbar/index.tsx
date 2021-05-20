import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Toolbar } from '@coreym/benchmark';
import { useToggle } from '../benchmark/util/hooks';

/* ScratchPad Init Variables */
let canvas: HTMLElement, ctx: { beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; strokeStyle: string; lineWidth: number; stroke: () => void; closePath: () => void; fillStyle: string; fillRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clearRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; }, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;
let x = "black";
let y = 4; 

/* TTS (Text-To-Speech) Init Variable */
let nodes = [];

const ToolbarRenderer = (): ReactElement | null => {
  
  /* useState */
  const [textOn, setTextOn] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [num, setNum] = useState(1800 / 60);

  /* useToggle */
  const [highlighterActive, setHighlighterActive] = useToggle();
  const [pencilActive, setPencilActive] = useToggle();
  const [eraserActive, setEraserActive] = useToggle();

  /* useRef */
  const intervalRef = useRef(null);

  /* useTypedSelector */
  const { dialogShow } = useTypedSelector((state) => state.dialog);
  const { getCanvas } = useTypedSelector((state: any) => state.saveCanvas);
  const { calculator } = useTypedSelector((state) => state);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { theme } = useTypedSelector((state) => state.theme);
  const { isKeyboardSet } = useTypedSelector((state) => state.isKeyboardSet);
  const { id, toolbar, tools } = useTypedSelector((state) => state.tools.data);
  const { tabs } = useTypedSelector((state) => state);
  const { zoom } = useTypedSelector((state) => state.zoom);
  const { hasVisited } = useTypedSelector((state: any) => state.hasVisited);
  const { coordinates, batchedCoords } = useTypedSelector((state) => state.mouseMovements);

  /* useActions */
  const { getTabNumber, getBlockNumber, multipleSelect, setTheme, getScratch , changeZoom, showDialog, setKeyboard, fetchCalculatorElement, hasVisitedHelp } = useActions(); 
  
  /* ScratchPad Start */
  const draw = () => {
    setHasDrawn(true)
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x; 
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
  }
  const curriedFn = (res: string, e: { clientX: number; clientY: number; }) => {
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

  /* ScratchPad Global Variables */
  const controllerScratchPad = new AbortController();
  var bindingMoveEvent = curriedFn.bind(this, 'move');
  var bindingDownEvent = curriedFn.bind(this, 'down');
  var bindingUpEvent = curriedFn.bind(this, 'up');

  useEffect(() => {
    if(!scratch && !clearCanvas) {
      try {      
        canvas.style.pointerEvents = 'none';
      } catch(e) {
        // console.log(e.message)
      }
      return;
    } 

    if(hasDrawn && !clearCanvas) {
      canvas.style.pointerEvents = 'all';
      return;
    }

    canvas = getCanvas; //document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    x = 'black';
    y = 4; 

    if(scratch) {
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
      controllerScratchPad.abort();   
    }
  }, [scratch, tabs, clearCanvas]);
  
  useEffect(() => {
    if(pencilActive) {
      x = 'black';
    } 
    return () => {
      // console.log("cleanup pencil");
    }
  }, [pencilActive]);

  useEffect(() => {
    if(highlighterActive) {
      x = 'yellow';
    } 
    return () => {
      // console.log("cleanup highlighter");
    }
  }, [highlighterActive]);

  useEffect(() => {
    if(eraserActive) {
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
      console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber:"${tabs.blockNumber}} Open Scratchpad)}`);
    }
    else {
      document.body.style.cursor = 'default';
      console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber:"${tabs.blockNumber}} Close Scratchpad)}`);
    }
  }
  const onClickClear = () => {
    setClearCanvas(true);
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
  }
  const onClickHighlighter = () => {
    document.body.style.cursor = "url('cursors/Cur_Highlighter_Scratch.cur'), auto";
    if(pencilActive) setPencilActive();
    if(eraserActive) setEraserActive();
    setHighlighterActive();
  }
  const onClickEraser = () => {
    document.body.style.cursor = "url('cursors/Cur_Erase_Scratch.cur'), auto"; 
    document.getElementById('pointerTest').style.pointerEvents = 'none';
    document.getElementById('pointerTest').style.zIndex = '2';
    if(highlighterActive) setHighlighterActive();
    if(pencilActive) setPencilActive();
    setEraserActive();   
  }
  const onClickPencil = () => {
    document.body.style.cursor = "url('cursors/Cur_Draw_Scratch.cur'), auto";
    if(highlighterActive) setHighlighterActive();
    if(eraserActive) setEraserActive();
    setPencilActive();
  }
  /* ScratchPad End */

  /* Timer Start */
  useEffect(() => {
    if(stopTimer) {
      showDialog(!dialogShow);
      console.log('pretty sure this prolly forces the user to the next question? if so, will adjust...');
    } 
  }, []);
  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, +(1000 * 60 / 60).toFixed(2));
    return () => {
      clearInterval(intervalRef.current);
      setNum(30);
    }
  }, [tabs]);
  const decreaseNum = () => {

    setNum(prev => {
      if(prev == 0) {
        setStopTimer(true);
        setTimeout(() => showDialog(dialogShow));
        clearInterval(intervalRef.current);
        return 0; 
      }
      return +(prev - 1/120).toFixed(2);
    });
  }
  /* Timer End */

  /* Calculator Start */
  const onClickCalculator = () => {
    console.log(batchedCoords, `--> batchedCoords`);
    fetchCalculatorElement(calculator.calculator, calculator.calculatorModel, true);
    if (calculator.calculator.current.style.visibility === 'hidden') {
      calculator.calculator.current.style.visibility = 'visible'; // document.getElementById('calculatorDiv')
      console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Open Calculator TI${calculator.calculatorModel})}`);
    }
    else {
      calculator.calculator.current.style.visibility = 'hidden'; 
      console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Close Calculator TI${calculator.calculatorModel})}`);
    }
  };
  /* Calculator End */

  /* Zoom Out Start */
  const onClickZoomOut = () => changeZoom(+zoom.toFixed(2) - 0.1);
  /* Zoom Out End */

  /* Zoom In Start */
  const onClickZoomIn = () => changeZoom(+zoom.toFixed(2) + 0.1);
  /* Zoom In End */

  /* Theme Start */
  const onClickTheme = () => setTheme(theme);
  /* Theme End */

  /* Help Screen Start */
  const onClickHelp = () => {
    if (!hasVisited) {
      hasVisitedHelp(true);
      console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Visited Help Screen`);
    }
    else {
      hasVisitedHelp(false);
      console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.blockNumber}} Left Help Screen`);
    }
  };
  /* Help Screen End */

  /* Math Keyboard Start */
  const onClickMathKeyboard = async () => {
    // setMathKey(!mathKey);
    setKeyboard(!isKeyboardSet);
  }
  /* Math Keyboard End */

  /* Speech Start */
  /* Speech Global Variables */
  const controller = new AbortController();
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
  /* Speech End */

  /* Next Item Start */
  const nextItem = () => {
    getTabNumber(tabs.tabNumber + 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber + 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
    
    if(isKeyboardSet) {
      setKeyboard(!isKeyboardSet);
    }
    setClearCanvas(true);
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };
  /* Next Item End */

  /* Previous Item Start */
  const prevItem = () => {
    getTabNumber(tabs.tabNumber - 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber - 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber - 1).toString());
    console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":${tabs.tabsData[tabs.tabNumber - 1].id}} On Question ${tabs.tabNumber})}`);
    if(isKeyboardSet) {
      setKeyboard(!isKeyboardSet);
    }
    setClearCanvas(true);
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };
  /* Previous Item End */

  return (
    toolbar && 
      <Toolbar
        
        // General Information / Metadata Concerns 
        id={id} 
        label={toolbar?.title}
        blockTitle={tabs?.blockTitle} 
        itemTitle={tabs.blockNumber}

        // Language Concerns (not yet implemented)
        language={tools?.bilingual?.language}
        isLangDisabled={!tools?.bilingual?.enabled}
  
        // Zoom Concerns
        isZoomOutDisabled={zoom == 1.0}
        isZoomInDisabled={zoom == 1.3}
        onClickZoomOut={onClickZoomOut}
        onClickZoomIn={onClickZoomIn}
        
        // ScratchPad Concerns 
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
        isScratchActive={scratch}
        onClickScratch={onClickScratch}

        // Keyboard Concerns 
        isMathKeyboardDisabled={tools?.mathKeyboard?.enabled || hasVisited}
        isMathKeyboardActive={tools?.mathKeyboard?.activated}
        onClickMathKeyboard={onClickMathKeyboard}
        hasMathKeyboard={!tools?.mathKeyboard?.visible} // hide & show buttons

        // Calculator Concerns 
        isCalculatorDisabled={!tools?.calculator?.enabled || hasVisited}
        isCalculatorActive={tools?.calculator?.activated}
        onClickCalculator={onClickCalculator}
        hasCalculator={tools?.calculator?.visible}

        // Timer Concerns 
        timeLeft={`${num} minutes`}
        isDisabled={!toolbar?.enabled}
        isTimerDisabled={!tools?.timer?.enabled}
        hasTimer={tools?.timer?.visible}
        isTimerActive={true}

        // TTS (Text-To-Speech) Concerns
        hasTTS={tools?.readAloud?.visible}
        onClickTTS={() => onClickTTS(textOn)}
        isTTSActive={textOn}
        isTTSDisabled={!tools?.readAloud?.enabled}

        // Help Concerns 
        isHelpActive={hasVisited}
        onClickHelp={onClickHelp}
        isHelpDisabled={!tools?.help?.enabled}

        // Theme Concerns 
        onClickTheme={onClickTheme}
        isThemeDisabled={!tools?.theme?.enabled}

        // Next and Previous Button Concerns
        isPrevDisabled={tabs.tabNumber === 0}
        isNextDisabled={tabs.tabNumber === tabs.data.length - 1 || scratch}
        onClickPrev={prevItem}
        onClickNext={nextItem}
        
        // Progress Bar Concerns
        hasProgress={tools?.progress?.visible}
        progress={(tabs.tabsData.length > 0) ? (100 / tabs.tabsData.length) * (tabs.tabNumber === 0 ? 1 : tabs.tabNumber + 1) : 0}

      />
    );
};

export default ToolbarRenderer;
