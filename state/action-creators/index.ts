import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import { Action } from '../actions';

export const fetchStart = (term: string) => {
  // eslint-disable-next-line
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_START,
    });
    try {
      // eslint-disable-next-line
      const { data } = await axios.get(`http://localhost:3010/${term}`);
      // eslint-disable-next-line
      const start = data[0];
      dispatch({
        type: ActionType.FETCH_START_SUCCESS,
        payload: start,
      });
    } catch (err) {
      dispatch({
        type: ActionType.FETCH_START_ERROR,
        payload: err.message,
      });
    }
  };
};

export const createLaunch = (term: string) => {
  // eslint-disable-next-line
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.TOOLS_PROPS_FETCH,
    });
    try {
      // eslint-disable-next-line
      const { data } = await axios.get(`http://localhost:3010/${term}`);
      // eslint-disable-next-line
      const tools = data; //.tools;
      dispatch({
        type: ActionType.TOOLS_PROPS_SUCCESS,
        payload: tools,
      });
    } catch (err) {
      dispatch({
        type: ActionType.TOOLS_PROPS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const fetchItem2 = (term: string) => {
  // eslint-disable-next-line
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_ITEM2,
    });
    try {
      // eslint-disable-next-line
      const { data } = await axios.get(`http://localhost:3010/${term}`);
      // eslint-disable-next-line
      const item2 = data;
      // console.log(item2, `--> item2`);
      dispatch({
        type: ActionType.FETCH_ITEM_SUCCESS2,
        payload: item2,
      });
    } catch (err) {
      dispatch({
        type: ActionType.FETCH_ITEM_ERROR2,
        payload: err.message,
      });
    }
  };
};

export const fetchItem = (term: string) => {
  // eslint-disable-next-line
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_ITEM,
    });
    try {
      // eslint-disable-next-line
      const { data } = await axios.get(`http://localhost:3010/${term}`);
      // eslint-disable-next-line
      const item = data;
      dispatch({
        type: ActionType.FETCH_ITEM_SUCCESS,
        payload: item,
      });
    } catch (err) {
      dispatch({
        type: ActionType.FETCH_ITEM_ERROR,
        payload: err.message,
      });
    }
  };
};



export const fetchTabs = (term: string) => {
  // eslint-disable-next-line
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.TABS_FETCH,
    });
    try {
      // eslint-disable-next-line
      const { data } = await axios.get(`http://localhost:3010/${term}`);
      // eslint-disable-next-line
      const tabsData = data[0].itemHeaders
      dispatch({
        type: ActionType.TABS_SUCCESS,
        payload: tabsData,
      });
    } catch (err) {
      dispatch({
        type: ActionType.TABS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const getTabNumber = (tab: number) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.TAB_NUMBER,
      payload: tab,
    });
  };
};

export const getBlockNumber = (blockNum: string) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BLOCK_NUMBER,
      payload: blockNum,
    });
  };
};

// eslint-disable-next-line
export const multipleSelect = (action: string, optionId?: string, tabNumber?: number) => {
  // console.log(action, `--> action`);
  switch (action) {
    case 'dropdown_select':
      return (dispatch: Dispatch<Action>/*, getState: () => any*/) => {
        dispatch({
          type: ActionType.DROPDOWN_SELECT,
          payload: {
            optionId,
            tabNumber
          }
        });
        // console.log(getState().multipleSelectChoices);
      }; 
    case 'text_input_value':
      return (dispatch: Dispatch<Action>/*, getState: () => any*/) => {
        dispatch({
          type: ActionType.TEXT_INPUT_VALUE,
          payload: {
            optionId,
            tabNumber
          }
        });
        // console.log(getState().multipleSelectChoices);
      }; 
    case 'multiple_select':
      // eslint-disable-next-line
    return (dispatch: Dispatch<Action>/*, getState: () => any*/) => {
        dispatch({
          type: ActionType.MULTIPLE_SELECT,
          payload: {
            optionId,
            tabNumber
          }
        });
        // console.log(getState().multipleSelectChoices);
      };
    case 'multiple_eliminate':
      // eslint-disable-next-line
    return (dispatch: Dispatch<Action>/*, getState: () => any*/) => {
        dispatch({
          type: ActionType.MULTIPLE_ELIMINATE,
          payload: {
            optionId,
            tabNumber
          }
        });
        // console.log(getState().multipleSelectChoices);
      };
    case 'multiple_clear':
      // eslint-disable-next-line
    return (dispatch: Dispatch<Action>) => {
        dispatch({
          type: ActionType.MULTIPLE_CLEAR,
          payload: optionId,
        });
      };
  }
};

// eslint-disable-next-line
export const singleSelect = (action: string, optionId?: string) => {
  // console.log(action, `--> action`);
  switch (action) {
    case 'single_select':
      // eslint-disable-next-line
    return (dispatch: Dispatch<Action>/*, getState: () => any*/) => {
        dispatch({
          type: ActionType.SINGLE_SELECT,
          payload: optionId,
        });
        // console.log(getState().multipleSelectChoices);
      };
    case 'single_eliminate':
      // eslint-disable-next-line
    return (dispatch: Dispatch<Action>/*, getState: () => any*/) => {
        dispatch({
          type: ActionType.SINGLE_ELIMINATE,
          payload: optionId,
        });
        // console.log(getState().singleSelectChoices);
      };
    case 'single_clear':
      // eslint-disable-next-line
    return (dispatch: Dispatch<Action>) => {
        dispatch({
          type: ActionType.SINGLE_CLEAR,
          payload: optionId,
        });
      };
  }
};

// eslint-disable-next-line
export const dropdownSelect = (action: string, value?: string) => {
  // console.log(action, `--> action`);
  return (dispatch: Dispatch<Action>) => {
      dispatch({
        type: ActionType.DROPDOWN_SELECT,
        payload: value,
      });
  };
};

export const setTheme = (theme: string) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_THEME,
      payload: theme,
    });
  };
};

export const getScratch = (scratch: boolean) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.GET_SCRATCH,
      payload: scratch,
    });
  };
};

export const changeZoom = (zoom: number) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CHANGE_ZOOM,
      payload: zoom,
    });
  };
};

export const setKeyboard = (setKey: boolean) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_KEYBOARD,
      payload: setKey,
    });
  };
};

export const showDialog = (dialog: boolean) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.DIALOG_SHOW,
      payload: dialog,
    });
  };
};

// eslint-disable-next-line
export const fetchCalculatorElement = (element: any) => {
  // eslint-disable-next-line
return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_CALCULATOR_ELEMENT,
      payload: element,
    });
  };
};

// eslint-disable-next-line
export const textInputValue = (text: string | number) => {
  // console.log(text, `--> text`);
  // eslint-disable-next-line
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.TEXT_INPUT_VALUE,
      payload: text,
    });
  };
};

