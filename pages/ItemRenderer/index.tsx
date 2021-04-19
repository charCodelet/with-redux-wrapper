/* eslint-disable react/prop-types */
import React, { ReactElement } from 'react';
import { WidgetMap } from '../../interfaces/renderer/WidgetMap';
import { /*Item,*/ Widget } from '../../types/src/stateMachineTypes';

// eslint-disable-next-line
const ItemRenderer = (item1: { item: Widget; embeddedSimpleItemIdMap: any }): ReactElement | null => {
  // console.log('itemRenderer');
  const { item, embeddedSimpleItemIdMap } = item1;
  console.log(item, `--> item`);
  console.log(embeddedSimpleItemIdMap, `--> embeddedSimpleItemIdMap`);
  // console.log('embeddedSimpleItemIdMap is always the same map...this is just really clumsy, but it might be hard to change without getting into Papago...');
  let itemToRender: Widget;
  // console.log(typeof WidgetMap[item.element], `--> typeof WidgetMap[`, item.element, `]`);
  // console.log(item.element, `--> item.element`);
  if (item.element && typeof WidgetMap[item.element] === 'undefined') {
    // prettier-ignore
    try {
      // console.log(embeddedSimpleItemIdMap, `--> embeddedSimpleItemIdMap`);
      itemToRender = embeddedSimpleItemIdMap.content; //  && embeddedSimpleItemIdMap.size > 0 && embeddedSimpleItemIdMap.get(item.id).content;
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

// export default ItemRenderer;

export default React.memo(ItemRenderer, (/*prevProps, nextProps*/) => {
  // console.log(prevProps, `--> prevProps`);
  // console.log(nextProps, `--> nextProps`);
  return true;
});
