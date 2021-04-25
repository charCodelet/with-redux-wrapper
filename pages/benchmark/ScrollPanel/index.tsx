import React, { ReactElement, useRef, useState, useEffect, useLayoutEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { ThemeProvider, Box, ScrollButton } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import * as styles from './ScrollPanels.styles';

const ScrollPanel = React.forwardRef((props: any, forwardedRef: any): ReactElement | null => {
  let { zoom } = useTypedSelector((state) => state.zoom);
  // if(document.getElementById('panelRef')) {
  //   let atBottom = document.getElementById('panelRef').scrollHeight - Math.abs(document.getElementById('panelRef').scrollTop) === document.getElementById('panelRef').clientHeight;
  //   console.log(document.getElementById('panelRef').scrollHeight, `--> document.getElementById('panelRef').scrollHeight`);
  //   console.log(document.getElementById('scrollRef').scrollHeight, `--> document.getElementById('panelRef').scrollRef`);
  //   console.log(Math.abs(document.getElementById('panelRef').scrollTop), `--> Math.abs(document.getElementById('panelRef').scrollTop)`);
  //   console.log(document.getElementById('panelRef').clientHeight, `--> document.getElementById('panelRef').clientHeight`);
  //   console.log(atBottom, `--> atBottom`);
  // }
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  let { height: panelHeight = 0 } = useResizeObserver<HTMLDivElement>({ ref: panelRef });
  let { height: scrollHeight = 0 } = useResizeObserver<HTMLDivElement>({ ref: scrollRef });
  const [click, setClick] = useState(0);
  const [flag, setFlag] = useState(false);
  const [origHeight, setOrigHeight] = useState(0); // prettier-ignore
  const [isBottom, setIsBottom] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);
  let panelInitHeight = 0;
  let scrollInitHeight = 0;
  panelHeight = panelHeight * 1 / zoom;
  useLayoutEffect(() => {
    // console.log('%cuseLayoutEffect','font-weight:bold');
    if (scrollRef?.current?.clientHeight && panelRef?.current?.clientHeight) {
      // console.log('if( [scrollRef?.current?.clientHeight]',scrollRef?.current?.clientHeight,'&& [panelRef?.current?.clientHeight]',panelRef?.current?.clientHeight,')');
      panelInitHeight = panelRef.current.clientHeight;
      scrollInitHeight = scrollRef.current.clientHeight;
      // console.log('Panel Height: ', panelInitHeight);
      // console.log('Scroll Height: ', scrollInitHeight);
      setOrigHeight(scrollRef?.current?.clientHeight);
    }
  }, [forwardedRef?.current?.clientHeight]);
  useEffect(() => {
    // console.log('%cuseEffect','font-weight:bold');
    // console.log(panelRef.current.clientHeight, `--> panelRef.current.clientHeight`);
    // console.log(scrollRef.current.clientHeight, `--> scrollRef.current.clientHeight`);
    // console.log(document.getElementById('scrollRef').clientHeight, `--> document.getElementById('scrollRef').clientHeight`);
    console.log(document.getElementById('panelRef').scrollHeight, `--> document.getElementById('panelRef').scrollHeight)`);
    // console.log(scrollRef?.current?.clientHeight, `--> scrollRef?.current?.clientHeight`);
    setOrigHeight(
      /*scrollRef?.current?.clientHeight*/ 
      /*document.getElementById('scrollRef').clientHeight*/
      document.getElementById('panelRef').scrollHeight
    );

    if (scrollHeight > panelHeight) {
      // console.log('if( [scrollHeight]',scrollHeight,' > [panelHeight]',panelHeight);
      // console.log('setIsOverflown is set to true - BUTTON VISIBLE');
      setIsOverflown(true);
    } else {
      // console.log('else ([scrollHeight]',scrollHeight,' <= [panelHeight]',panelHeight);
      // console.log('setIsOverflown is set to false - BUTTON HIDDEN');
      setIsOverflown(false);
    }
    return function cleanup() {
      setClick(0);
      setIsBottom(false);
    };
  }, [panelHeight, scrollHeight]);
  function handleScroll(event) {
    console.log(origHeight, `--> origHeight`);
    // console.log(document.getElementById('scrollRef').clientHeight, `--> document.getElementById('scrollRef').clientHeight`);
    // console.log(document.getElementById('panelRef').scrollHeight, `--> document.getElementById('panelRef').scrollHeight)`);
    // console.log(scrollRef?.current?.clientHeight, `--> scrollRef?.current?.clientHeight`);
    const el = event.target;
    if (click == 2) {
      console.log("if(",click,"== 2)");
      console.log("button disappears from second click of button...");
      // setIsBottom(true);
    } 
    else if (/*el.scrollHeight*/document.getElementById('panelRef').scrollHeight - el.scrollTop == origHeight && click > 0) {
      console.log("else if 1( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",el.scrollHeight - el.scrollTop," == [origHeight]",origHeight," && ",click," > 0");
      console.log("button disappears from manual scroll up...");
      setClick(2);
    } 
    else if (/*el.scrollHeight*/document.getElementById('panelRef').scrollHeight - el.scrollTop <= el.clientHeight && click == 0) {
      console.log("else if 2( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," <= [el.clientHeight]",el.clientHeight," && ",click," == 0");
      console.log("button inverts from manual scroll down...");
      setIsBottom(true);
      setClick(1);
      setFlag(true);
    } 
    else if (/*el.scrollHeight*/document.getElementById('panelRef').scrollHeight - el.scrollTop > el.clientHeight && flag) {
      console.log("else if 3( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," > [el.clientHeight]",el.clientHeight," && flag");
      console.log("button inverts from first click of button...");
      setIsBottom(true);
    } 
    else if (/*el.scrollHeight*/document.getElementById('panelRef').scrollHeight - el.scrollTop > el.clientHeight && flag == false) {
      console.log("else if 4( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," > [el.clientHeight]",el.clientHeight," && !flag");
      console.log("button does not move...");
      setIsBottom(false);
    } 
    else if (/*el.scrollHeight*/document.getElementById('panelRef').scrollHeight - el.scrollTop >= el.clientHeight && flag) {
      console.log("else if 5( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," >= [el.clientHeight]",el.clientHeight," && flag");
      console.log('This state is sort of unaccounted for...');
    }
    else {
      console.log("HHHHHHHHHHHHHHHH")
    }

  }
  function handleClick(e) {
    // setClick(click + 1);
    // setFlag(true);
    
    // useful code stuff...
    // let atBottom = document.getElementById('panelRef').scrollHeight - Math.abs(document.getElementById('panelRef').scrollTop) === document.getElementById('panelRef').clientHeight;
    // let outside = document.getElementById("scrollWrapper");
    // let item = document.getElementById('scrollRef') // what we want to scroll to
    // let wrapper = document.getElementById('panelRef') // the wrapper we will scroll inside
    // let count = item.offsetTop - wrapper.scrollTop - 34 // xx = any extra distance from top ex. 60 


    console.log(scrollHeight, `--> scrollHeight`);
    console.log(panelHeight, `--> panelHeight`);
    let difference = click == 1 ? -(scrollHeight - panelHeight) : scrollHeight - panelHeight;
    // if(click == 1) {
    //   console.log('if click == 1',click);
    //   difference = -(scrollHeight - panelHeight);
    // }
    // else if(click == 0) {
    //   console.log('else click == 0',click);
    // }
    // else {
    //   alert('this should never happen...');
    // }
    panelRef.current.scrollBy({top: difference, left: 0, behavior: 'smooth'})

    // if(click == 1) {
    //   setIsBottom(false)
    // } else if(click == 2) {
    //   setIsBottom(true)
    // }


  }
  
  return (
    <ThemeProvider>
      <Box position="absolute" {...props}>
        <Box
          onScroll={handleScroll}
          overflowY="auto"
          overflowX="hidden"
          height="100%"
          sx={styles.scrollpanel}
          ref={panelRef}
          id="panelRef"
        >
          <aside id="scrollRef" ref={scrollRef}>{props.children}</aside>
        </Box>
        <Box 
          id="trans"
          sx={{
            visibility: isOverflown && click < 2 ? 'visible' : 'hidden',
            opacity: isOverflown && click < 2 ? '1' : '0',
            transition: 'visibility 1000ms linear 0s, opacity 1000ms',
          }}
        >
          <ScrollButton
            onClick={handleClick}
            direction={isBottom ? 'up' : 'down'}
            position="absolute"
            opacity=".85"
            bottom="1em"
            right="2em"
            transition="opacity 4s"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
});

export default ScrollPanel;
