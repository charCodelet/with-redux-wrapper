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
  // todo: remove local state
  const [click, setClick] = useState(0);
  const [flag, setFlag] = useState(false);
  const [origHeight, setOrigHeight] = useState(0); // prettier-ignore
  const [isBottom, setIsBottom] = useState(false);
  // const [isGone, setIsGone] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);
  // const [hasToggled, setHasToggled] = useState(false);
  let panelInitHeight = 0;
  let scrollInitHeight = 0;
  useLayoutEffect(() => {
    if (scrollRef?.current?.clientHeight && panelRef?.current?.clientHeight) {
      panelInitHeight = panelRef.current.clientHeight;
      scrollInitHeight = scrollRef.current.clientHeight;
      // console.log('Panel Height: ', panelInitHeight);
      // console.log('Scroll Height: ', scrollInitHeight);
      setOrigHeight(document.getElementById('test').clientHeight);
      if (scrollInitHeight > panelInitHeight) {
        setIsOverflown(true);
      } else {
        setIsOverflown(false);
      }
    }
  }, [forwardedRef.current && forwardedRef.current.clientHeight /*document.getElementById('test') && document.getElementById('test').clientHeight*/ ]); // prettier-ignore
  // console.log(forwardedRef, `--> forwardedRef`);
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
      setIsBottom(true);
    } else if (el.scrollHeight - el.scrollTop == origHeight && click > 0) {
      setClick(2);
    } else if (el.scrollHeight - el.scrollTop <= el.clientHeight && click == 0) {
      setIsBottom(true);
      setClick(1);
      setFlag(true);
    } else if (el.scrollHeight - el.scrollTop > el.clientHeight && flag) {
      setIsBottom(true);
    } else if (el.scrollHeight - el.scrollTop > el.clientHeight && !flag) {
      setIsBottom(false);
    } else {
      // console.log('else');
    }

    // if (hasToggled && el.scrollTop < toggleThreshold) {
    //   console.log('**********************************');
    //   console.groupCollapsed('if( &&', el.scrollTop, '<', toggleThreshold,')'); // prettier-ignore
    //   // setIsGone(true);
    //   setClick(2);
    //   console.groupEnd();
    // }
  }
  function handleClick() {
    // console.log('handleClick');
    setClick(click + 1);
    setFlag(true);
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: isBottom ? 'start' : 'end',
      });
    }
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
