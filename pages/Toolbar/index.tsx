import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Toolbar } from '@coreym/benchmark';
import { useToggle } from '../benchmark/util/hooks';
import Editor from '../Editor';

// eslint-disable-next-line


var canvas, ctx, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black";
var y = 14; // 40;
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
  const router = useRouter();
  const intervalRef = useRef(null);
  const { calculator } = useTypedSelector((state) => state.calculator);
  const { scratch } = useTypedSelector((state) => state.scratch);
  const { theme } = useTypedSelector((state) => state.theme);
  const { data } = useTypedSelector((state) => state.tools);
  const { tabs } = useTypedSelector((state) => state);
  let { zoom } = useTypedSelector((state) => state.zoom);
  const { getTabNumber, getBlockNumber, multipleSelect, setTheme, getScratch , changeZoom, showDialog, setKeyboard } = useActions(); // prettier-ignore

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

    

    // console.log(clearCanvas, `--> clearCanvas`);

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
      console.log('if(hasDrawn && !clearCanvas)');
      canvas.style.pointerEvents = 'all';
      return;
    }

    console.log("This should be called once");

    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    x = 'black';
    y = 14;

    if(scratch) {
      console.log('if( [scratch]',scratch,')');
      
      // var bindingMoveEvent = curriedFn.bind(this, 'move');
      // var bindingDownEvent = curriedFn.bind(this, 'down');
      // var bindingUpEvent = curriedFn.bind(this, 'up');

      console.log('add mouse listeners...');
      canvas.style.pointerEvents = 'all';
      canvas.addEventListener("mousemove", bindingMoveEvent, false);
      canvas.addEventListener("mousedown", bindingDownEvent, false);
      canvas.addEventListener("mouseup", bindingUpEvent, false);
      if(highlighterActive) {
        // setHighlighterActive();
        x = 'yellow';
      }
      else if(eraserActive) {
        // setEraserActive(); 
        if(x == 'black') x = 'white'
        else x = 'black';
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
      // canvas.removeEventListener("mousemove", bindingMoveEvent, false);
      // canvas.removeEventListener("mousedown", bindingDownEvent, false);
      // canvas.removeEventListener("mouseup", bindingUpEvent, false); 
    }
  }, [scratch, tabs, clearCanvas]);
  
  useEffect(() => {
    if(pencilActive) {
      console.log('run when pencil clicked');
      x = 'black';
    } 
    return () => {
      console.log("cleanup pencil");
    }
  }, [pencilActive]);

  useEffect(() => {
    if(highlighterActive) {
      console.log('run when highlighter clicked');
      x = 'yellow';
    } 
    return () => {
      console.log("cleanup highlighter");
    }
  }, [highlighterActive]);
  
  useEffect(() => {
    if(eraserActive) {
      console.log('run when eraser clicked');
      if(x == 'black') x = 'white'
      else x = 'black';
      x = 'white';
      y = 14 
    } 
    return () => {
      console.log("cleanup eraser");
    }
  }, [eraserActive]);

 

  const onClickScratch = () => {
    getScratch(!scratch);
    setClearCanvas(false);
    if(!scratch) document.body.style.cursor = "url('cursors/Cur_Draw_Scratch.cur'), auto";
    else document.body.style.cursor = 'default'
  }
  const onClickClear = () => {
    console.log('onClickClear');
    setClearCanvas(true);
    console.log(highlighterActive, `--> highlighterActive`);
    console.log(pencilActive, `--> pencilActive`);
    console.log(eraserActive, `--> eraserActive`);
    // if(highlighterActive) setHighlighterActive();
    // if(pencilActive) setPencilActive();
    // if(eraserActive) setEraserActive();
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
      if(prev == /*29.94*/ /*27*/ 0) {
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
    console.log(calculator, `--> calculator`);
    if (/*calculator.current*/document.getElementById('calculatorDiv').style.visibility === 'hidden') {
      /*calculator.current*/document.getElementById('calculatorDiv').style.visibility = 'visible';
    } else {
      /*calculator.current*/document.getElementById('calculatorDiv').style.visibility = 'hidden';
    }
  };
  const onClickTheme = () => setTheme(theme);


  const onClickHelp = () => {
    if (router.pathname == '/') {
      router.push('/help');
    } else {
      router.push('/');
    }
  };
  const onClickMathKeyboard = async () => {
    console.log("math key");
    setMathKey(!mathKey);
    setKeyboard(!mathKey);
  }
  var synth = window.speechSynthesis;
  let div = document.getElementById("scrollRef");
  let filter = function(node) {
  return node.tagName.toLowerCase() == "p" ? 
    NodeFilter.FILTER_ACCEPT :
    NodeFilter.FILTER_SKIP;
  };  

  const controller = new AbortController();
 
  useEffect(() => {
    const startTalk = (v) => {
      synth.speak(new SpeechSynthesisUtterance(v.innerText))
    }
    if(textOn) {   
      let iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, filter, false);            
      let node = iterator.nextNode();
      while (node !== null) {    
        nodes.push(node)
        node.style.border = "1px solid black";
        node.style.cursor = "pointer"
        node = iterator.nextNode();       
      }
      nodes.forEach(function(v) {
        v.addEventListener('click', () => startTalk(v),{ signal: controller.signal })
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
      console.log('done');
      controller.abort();
    })
  }, [textOn])

  const onClickTTS = (text) => {

    // console.log(textOn, `--> textOn before`);

    // setTextOn((text) => !text)
    setTextOn(!text)
    
    // console.log(textOn, `--> textOn after`);
   
    
  }
  // useEffect(() => {
  //   let editor = com.wiris.jsEditor.JsEditor.newInstance({language: "en"});

  //   if(mathKey) {
  //     editor.insertInto(document.getElementById("editorContainer"));
  //   }
  // }, [mathKey]);
  const nextItem = () => {
    console.log(tabs.tabsData[tabs.tabNumber + 1], `--> tabs`);
    getTabNumber(tabs.tabNumber + 1);
    getBlockNumber(tabs.tabsData[tabs.tabNumber + 1].id);
    multipleSelect('multiple_clear', (tabs.tabNumber + 1).toString());
    try {
      canvas.removeEventListener("mousemove", bindingMoveEvent, false);
      canvas.removeEventListener("mousedown", bindingDownEvent, false);
      canvas.removeEventListener("mouseup", bindingUpEvent, false); 
      setClearCanvas(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } catch(e) {
      console.log(e.message)
    }
    
    
    // getScratch(false);
    // console.log('and now i need to close the scratchpad and make sure the cursor is changed...');
    // console.log('NO! remember...we actually have to block out the next and prev buttons UNTIL we close the scratchpad...assume it should be the same with tabs...');
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
        isScratchDisabled={!tools?.scratchwork?.enabled || router.pathname == '/help'}
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
        isMathKeyboardDisabled={tools?.mathKeyboard?.enabled}
        isCalculatorDisabled={!tools?.calculator?.enabled || router.pathname == '/help'}
        isTimerDisabled={!tools?.timer?.enabled}
        isPrevDisabled={tabs.tabNumber === 0}
        isNextDisabled={tabs.tabNumber === tabs.data.length - 1 || scratch}
        isHelpActive={/*tools?.help?.activated*/router.pathname == '/help'}
        isTTSActive={/*tools?.bilingual?.activated*/ textOn}
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
