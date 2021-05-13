/* eslint-disable react/prop-types */
import React, { ReactElement } from 'react';
import { WidgetMap } from '../../interfaces/renderer/WidgetMap';
import {  Widget } from '../../types/src/stateMachineTypes';

// eslint-disable-next-line
const ItemRenderer = (item1: { item: Widget; embeddedSimpleItemIdMap: any; tabNumber: any; }): ReactElement | null => {
  const { item, embeddedSimpleItemIdMap, tabNumber } = item1;
  let itemToRender: Widget;
  if (item.element && typeof WidgetMap[item.element] === 'undefined') {
    try {
      itemToRender = embeddedSimpleItemIdMap.content; 
    } catch(e) {
      console.log(e.message);
    }
  } else {
    itemToRender = item;
  }

  let { element, props } = itemToRender;
  const { children } = itemToRender;

  if (!element || typeof WidgetMap[element] === 'undefined') {
    const incomingElement = element;
    element = 'Placeholder';
    console.warn(incomingElement + ' not found in WidgetMap used by ADE Renderer.');
    console.warn(item.element + ' not found in WidgetMap used by ADE Renderer.');
    if (!props) {
      props = { height: '30px', label: incomingElement }; // Added height, in case it is not passed, so as to render a rect for Placeholder
    } else {
      if (!props.height) {
        props.height = '30px';
        props.label = incomingElement;
      }
    }
  }
  
  return React.createElement(
    WidgetMap[element],
    { ...item, ...props, key: Math.random() * 100 },
    children && children.length && children.map((child) => { 
      return typeof child == 'string' ? `${child}` : ItemRenderer({ item: child, embeddedSimpleItemIdMap, tabNumber })
      }),
  );
};

// export default ItemRenderer;

export default React.memo(ItemRenderer, (prevProps, nextProps) => {
  // console.log(prevProps.tabNumber, '==', nextProps.tabNumber);
  return prevProps.tabNumber == nextProps.tabNumber;
});

