/* eslint-disable react/prop-types */
import React, { ReactElement } from 'react';
import { WidgetMap } from '../../interfaces/renderer/WidgetMap';
import { Item, Widget } from '../../types/src/stateMachineTypes';

// eslint-disable-next-line
const ItemRenderer = (item1: { item: Widget; embeddedSimpleItemIdMap: Map<string, Item> }): ReactElement | null => {
  // console.log('itemRenderer');
  const { item, embeddedSimpleItemIdMap } = item1;
  // console.log(item, `--> item`);
  // console.log(embeddedSimpleItemIdMap, `--> embeddedSimpleItemIdMap`);
  let itemToRender: Widget;
  // console.log(typeof WidgetMap[item.element], `--> typeof WidgetMap[`, item.element, `]`);
  // console.log(item.element, `--> item.element`);
  if (item.element && typeof WidgetMap[item.element] === 'undefined') {
    // prettier-ignore
    try {
      // console.log(embeddedSimpleItemIdMap, `--> embeddedSimpleItemIdMap`);
      itemToRender = embeddedSimpleItemIdMap && embeddedSimpleItemIdMap.size > 0 && embeddedSimpleItemIdMap.get(item.id).content;
      // console.log(itemToRender, `--> itemToRender`);
    } catch(e) {
      console.log(e.message);
    }
  } else {
    itemToRender = item;
  }
  // console.log(itemToRender, `--> itemToRender`);
  let { element, props } = itemToRender;
  const { children } = itemToRender;
  //Removed check for incoming Placeholder from papago
  if (!element || typeof WidgetMap[element] === 'undefined') {
    const incomingElement = element;
    element = 'Placeholder';
    console.warn(incomingElement + ' not found in WidgetMap used by ADE Renderer.');
    console.warn(item.element + ' not found in WidgetMap used by ADE Renderer.');
    alert(33);
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
    // prettier-ignore
    children && children.length && children.map((child) => { 
        // console.log(child, `--> child`);
        return typeof child === 'string' ? `${child}` : ItemRenderer({ item: child, embeddedSimpleItemIdMap: embeddedSimpleItemIdMap })
      }),
  );
};

export default React.memo(ItemRenderer, (/*prevProps, nextProps*/) => {
  // console.log(prevProps, `--> prevProps`);
  // console.log(nextProps, `--> nextProps`);
  return true;
});
