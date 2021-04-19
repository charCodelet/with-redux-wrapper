import { createStore , applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunk from 'redux-thunk';
import tabsReducer from './reducers/tabsReducer';
import toolsReducer from './reducers/toolsReducer';
import itemsReducer from './reducers/itemsReducer';
import itemsReducer2 from './reducers/itemsReducer2';
import startReducer from './reducers/startReducer';
import multipleSelect from './reducers/multipleSelectReducer';
import singleSelect from './reducers/singleSelectReducer';
import setThemeReducer from './reducers/setThemeReducer';
import getScratchReducer from './reducers/getScratchReducer';
import changeZoomReducer from './reducers/changeZoomReducer';
import fetchCalculatorElementReducer from './reducers/fetchCalculatorElementReducer';
import fetchAllReducer from './reducers/fetchAllReducer';

const combinedReducer = combineReducers({
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
  fetchAllItems: fetchAllReducer,
});


const reducer = (state, action) => {
  // console.log(state, `--> state`);
  // console.log(action, `--> action`);
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

const initStore = () => {
  return createStore(reducer, {}, applyMiddleware(thunk))
}

export const wrapper = createWrapper(initStore)