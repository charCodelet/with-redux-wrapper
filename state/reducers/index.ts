import { combineReducers } from 'redux';
import tabsReducer from './tabsReducer';
import toolsReducer from './toolsReducer';
import itemsReducer from './itemsReducer';
import itemsReducer2 from './itemsReducer2';
import startReducer from './startReducer';
import multipleSelect from './multipleSelectReducer';
import singleSelect from './singleSelectReducer';
import setThemeReducer from './setThemeReducer';
import getScratchReducer from './getScratchReducer';
import changeZoomReducer from './changeZoomReducer';
import fetchCalculatorElementReducer from './fetchCalculatorElementReducer';

const reducers = combineReducers({
  tools: toolsReducer,
  tabs: tabsReducer,
  item: itemsReducer,
  item2: itemsReducer2,
  start: startReducer,
  multipleSelectChoices: multipleSelect,
  singleSelectChoices: singleSelect,
  theme: setThemeReducer,
  scratch: getScratchReducer,
  zoom: changeZoomReducer,
  calculator: fetchCalculatorElementReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
