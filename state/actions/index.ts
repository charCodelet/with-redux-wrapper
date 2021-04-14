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
  payload: string;
}

interface MultipleEliminateAction {
  type: ActionType.MULTIPLE_ELIMINATE;
  payload: string;
}

interface MultipleClearAction {
  type: ActionType.MULTIPLE_CLEAR;
  payload: string;
}

interface SingleSelectAction {
  type: ActionType.SINGLE_SELECT;
  payload: string;
}

interface  SingleEliminateAction {
  type: ActionType.SINGLE_ELIMINATE;
  payload: string;
}

interface  SingleClearAction {
  type: ActionType.SINGLE_CLEAR;
  payload: string;
}

interface  SetThemeAction {
  type: ActionType.SET_THEME;
  payload: string;
}

interface  GetScratchAction {
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



export type Action =
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
  | SingleSelectAction
  | SingleEliminateAction
  | SingleClearAction
  | SetThemeAction
  | GetScratchAction
  | ChangeZoomAction
  | FetchCalculatorAction
