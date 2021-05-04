import { ActionType } from '../action-types';

interface FetchStartAction {
  type: ActionType.FETCH_START;
}

interface FetchStartSuccessAction {
  type: ActionType.FETCH_START_SUCCESS;
  payload: string[];
}

interface FetchStartErrorAction {
  type: ActionType.FETCH_START_ERROR;
  payload: string;
}

interface ToolsPropsAction {
  type: ActionType.TOOLS_PROPS_FETCH;
}

interface ToolsPropsSuccessAction {
  type: ActionType.TOOLS_PROPS_SUCCESS;
  payload: string[];
}

interface ToolsPropsErrorAction {
  type: ActionType.TOOLS_PROPS_ERROR;
  payload: string;
}

interface TabsFetchAction {
  type: ActionType.TABS_FETCH;
}

interface TabsSuccessAction {
  type: ActionType.TABS_SUCCESS;
  payload: any;
}

interface TabsSuccessServerSideAction {
  type: ActionType.TABS_SUCCESS_SERVER_SIDE;
  payload: {
    tabsData: any,
    nestedId: string,
    blockTitle: string,
  }
}

interface TabsErrorAction {
  type: ActionType.TABS_ERROR;
  payload: string;
}

interface TabsNumber {
  type: ActionType.TAB_NUMBER;
  payload: number;
}

interface BlockNumber {
  type: ActionType.BLOCK_NUMBER;
  payload: string;
}


interface FetchItemAction {
  type: ActionType.FETCH_ITEM;
}

interface FetchItemSuccessAction {
  type: ActionType.FETCH_ITEM_SUCCESS;
  payload: any;
}

interface FetchItemErrorAction {
  type: ActionType.FETCH_ITEM_ERROR;
  payload: string;
}

interface FetchItemAction2 {
  type: ActionType.FETCH_ITEM2;
}

interface FetchItemSuccessAction2 {
  type: ActionType.FETCH_ITEM_SUCCESS2;
  payload: any;
}

interface FetchItemErrorAction2 {
  type: ActionType.FETCH_ITEM_ERROR2;
  payload: string;
}

interface MultipleSelectAction {
  type: ActionType.MULTIPLE_SELECT;
  payload: {
    optionId: string,
    tabNumber: number
  }
}

interface MultipleEliminateAction {
  type: ActionType.MULTIPLE_ELIMINATE;
  payload: {
    optionId: string,
    tabNumber: number | string
  }
}

interface MultipleClearAction {
  type: ActionType.MULTIPLE_CLEAR;
  payload: string;
}

interface  SetThemeAction {
  type: ActionType.SET_THEME;
  payload: string;
}

interface GetScratchAction {
  type: ActionType.GET_SCRATCH;
  payload: boolean;
}

interface ChangeZoomAction {
  type: ActionType.CHANGE_ZOOM;
  payload: number;
}

interface FetchCalculatorAction {
  type: ActionType.FETCH_CALCULATOR_ELEMENT;
  payload: any;
}

interface FetchAllItemsAction {
  type: 'fetch_all_items';
  payload: any;
}

interface DropdownSelectAction {
  type: ActionType.DROPDOWN_SELECT;
  payload: {
    optionId: string,
    tabNumber: number | string
  }
}

interface TextInputValueAction {
  type: ActionType.TEXT_INPUT_VALUE,
  payload: {
    optionId: string,
    tabNumber: number | string
  }
}

interface DialogAction {
  type: ActionType.DIALOG_SHOW;
  payload: boolean;
}

interface SetKeyboardAction {
  type: ActionType.SET_KEYBOARD;
  payload: boolean;
}

interface SetSSRMathAction {
  type: ActionType.SSR_MATH;
  payload: string;
}

export type Action =
  | FetchAllItemsAction 
  | FetchStartAction
  | FetchStartSuccessAction
  | FetchStartErrorAction
  | ToolsPropsAction
  | ToolsPropsSuccessAction
  | ToolsPropsErrorAction
  | TabsFetchAction
  | TabsSuccessAction
  | TabsErrorAction
  | FetchItemAction
  | FetchItemSuccessAction
  | FetchItemErrorAction
  | FetchItemAction2
  | FetchItemSuccessAction2
  | FetchItemErrorAction2
  | TabsNumber
  | BlockNumber
  | MultipleSelectAction
  | MultipleEliminateAction
  | MultipleClearAction
  | SetThemeAction
  | GetScratchAction
  | ChangeZoomAction
  | FetchCalculatorAction
  | TabsSuccessServerSideAction
  | DropdownSelectAction
  | TextInputValueAction
  | DialogAction
  | SetKeyboardAction
  | SetSSRMathAction
 