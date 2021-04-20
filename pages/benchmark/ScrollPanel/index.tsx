import React, { ReactElement, useRef, useState, useEffect, useLayoutEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Box, ScrollButton } from '@coreym/benchmark';
import * as styles from './ScrollPanels.styles';

// eslint-disable-next-line
const ScrollPanel = React.forwardRef((props: any, forwardedRef: any): ReactElement | null => {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { height: panelHeight = 0 } = useResizeObserver<HTMLDivElement>({ ref: panelRef });
  const { height: scrollHeight = 0 } = useResizeObserver<HTMLDivElement>({ ref: scrollRef });
  const [click, setClick] = useState(0);
  const [flag, setFlag] = useState(false);
  const [origHeight, setOrigHeight] = useState(0); // prettier-ignore
  const [isBottom, setIsBottom] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);
  let panelInitHeight = 0;
  let scrollInitHeight = 0;
  useLayoutEffect(() => {
    if (scrollRef?.current?.clientHeight && panelRef?.current?.clientHeight) {
      panelInitHeight = panelRef.current.clientHeight;
      scrollInitHeight = scrollRef.current.clientHeight;
      // console.log('Panel Height: ', panelInitHeight);
      // console.log('Scroll Height: ', scrollInitHeight);
      setOrigHeight(/*document.getElementById('scrollWrapper')*/ /*forwardedRef &&*/ forwardedRef?.current?.clientHeight);
      if (scrollInitHeight > panelInitHeight) {
        setIsOverflown(true);
      } else {
        setIsOverflown(false);
      } 
    }
    // return function cleanup() {
    //   setClick(0);
    // };  
  }, [/*forwardedRef && forwardedRef.current &&*/ forwardedRef?.current?.clientHeight/*document.getElementById('scrollWrapper') && document.getElementById('scrollWrapper').clientHeight*/]);
  useEffect(() => {
    if (scrollHeight > panelHeight) {
      setIsOverflown(true);
    } else {
      setIsOverflown(false);
    }
    return function cleanup() {
      setClick(0);
    };
  }, [panelHeight, scrollHeight]);
  function handleScroll(event) {
    const el = event.target;
    if (click == 2) {
      // console.log("if(",click,"== 2)");
      setIsBottom(false);
    } else if (el.scrollHeight - el.scrollTop == origHeight && click > 0) {
      // console.log("else if 1(",el.scrollHeight - el.scrollTop," == ",origHeight," && ",click," > 0");
      setClick(2);
    } else if (el.scrollHeight - el.scrollTop <= el.clientHeight && click == 0) {
      // console.log("else if 2(",el.scrollHeight - el.scrollTop," <= ",el.clientHeight," && ",click," == 0");
      setIsBottom(true);
      setClick(1);
      setFlag(true);
    } else if (el.scrollHeight - el.scrollTop > el.clientHeight && flag) {
      // console.log("else if 3(",el.scrollHeight - el.scrollTop," > ",el.clientHeight," && ",flag);
      setIsBottom(true);
    } else if (el.scrollHeight - el.scrollTop > el.clientHeight && !flag) {
      // console.log("else if 4(",el.scrollHeight - el.scrollTop," > ",el.clientHeight," && ",!flag);
      setIsBottom(false);
    } 

  }
  function handleClick() {
    // console.log('handleClick');
    setClick(click + 1);
    setFlag(true);
    // console.log(isBottom, `--> isBottom`);
    scrollRef.current.scrollIntoView({
      behavior: 'smooth',
      block: isBottom ? 'start' : 'end',
    });   
  }
  return (
    <Box position="absolute" {...props}>
      {/* prettier-ignore */}
      <Box
        onScroll={handleScroll}
        overflowY="auto"
        height="100%"
        sx={styles.scrollpanel}
        ref={panelRef}
      >
        <div ref={scrollRef}>{props.children}</div>
      </Box>
      <Box
        sx={{
          visibility: props.hasIndicator && isOverflown && click < 2 ? 'visible' : 'hidden',
          opacity: props.hasIndicator && isOverflown && click < 2 ? '1' : '0',
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
  );
});

export default ScrollPanel;
