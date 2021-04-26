import React, { ReactElement, useRef, useState, useEffect, useLayoutEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { ThemeProvider, Box, ScrollButton } from '@coreym/benchmark';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import * as styles from './ScrollPanels.styles';

const ScrollPanel = React.forwardRef((props: any, forwardedRef: any): ReactElement | null => {
  let { zoom } = useTypedSelector((state) => state.zoom);
  
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
    // console.log(document.getElementById('panelRef').scrollHeight, `--> document.getElementById('panelRef').scrollHeight)`);
    setOrigHeight(document.getElementById('panelRef').scrollHeight);
    if(scrollHeight > 0 && panelHeight > 0) {
      if (scrollHeight > panelHeight) {
        // console.log('if( [scrollHeight]',scrollHeight,' > [panelHeight]',panelHeight);
        // console.log('setIsOverflown is set to true - BUTTON VISIBLE');
        setIsOverflown(true);
      } else {
        // console.log('else ([scrollHeight]',scrollHeight,' <= [panelHeight]',panelHeight);
        // console.log('setIsOverflown is set to false - BUTTON HIDDEN');
        setIsOverflown(false);
      }
  }
    return function cleanup() {
      setClick(0);
      setIsBottom(false);
    };
  }, [panelHeight, scrollHeight]);
  function handleScroll(event) {
    const el = event.target;
    if (document.getElementById('panelRef').scrollHeight - el.scrollTop == origHeight && click > 0) { // was el.scrollHeight...
      console.log("if( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",el.scrollHeight - el.scrollTop," == [origHeight]",origHeight," && ",click," > 0");
      setClick(2);
    } 
    else if (document.getElementById('panelRef').scrollHeight - el.scrollTop <= el.clientHeight && click == 0) {
      console.log("else if 1( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," <= [el.clientHeight]",el.clientHeight," && ",click," == 0");
      setIsBottom(true);
      setClick(1);
      setFlag(true);
    } 
    else if (document.getElementById('panelRef').scrollHeight - el.scrollTop > el.clientHeight && flag) {
      console.log('this is what hits when we scroll down after zooming AFTER going to a new tab...problem is it sets to bottom too quickly; we need to figure out way to only set to bottom UPON scrolling to bottom...');
      console.log("else if 2( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," > [el.clientHeight]",el.clientHeight," && flag");
      setIsBottom(true);
    } 
    else if (document.getElementById('panelRef').scrollHeight - el.scrollTop > el.clientHeight && flag == false) {
      console.log("else if 3( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," > [el.clientHeight]",el.clientHeight," && !flag");
      setIsBottom(false);
    } 
    else if (document.getElementById('panelRef').scrollHeight - el.scrollTop >= el.clientHeight && flag) {
      console.log("else if 4( [document.getElementById('panelRef').scrollHeight - el.scrollTop]",document.getElementById('panelRef').scrollHeight - el.scrollTop," >= [el.clientHeight]",el.clientHeight," && flag");
    }
  }
  function handleClick(e) {
    let difference = click == 1 ? -(scrollHeight - panelHeight) : scrollHeight - panelHeight;
    console.log(difference, `--> difference`);
    panelRef.current.scrollBy({top: difference, behavior: 'smooth'});
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
