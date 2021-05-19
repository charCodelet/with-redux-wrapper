import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  loading?: boolean;
  error?: string | null;
  data?: any; // eslint-disable-line
  tabNumber?: number;
  blockNumber: string;
  tabsData?: any;
  nestedId?: any;
  ref?: any;
  blockTitle?: any;
  // fetchAllItems?: any;
}

const initialState = {
  loading: false,
  error: null,
  data: [],
  tabNumber: 0,
  blockNumber: 'VH447212',
  blockTitle: '',
  // fetchAllItems: [],
  // tabsData: "",
};

const tabsReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.TABS_FETCH:
      return { ...state, loading: true, error: null, data: [] };
    case ActionType.TABS_SUCCESS_SERVER_SIDE:
      // console.log(action.payload, `--> action.payload TABS_SUCCESS_SERVER_SIDE`);
      // console.log(action.payload.tabsData, `--> action.payload.tabsData`);
      // console.log(action.payload.nestedId, `--> action.payload.nestedId`);
      return { ...state, tabNumber: state.tabNumber, loading: false, error: null, tabsData: [...action.payload.tabsData, {id: action.payload.nestedId}], nestedId: action.payload.nestedId, blockTitle: action.payload.blockTitle };
    // case 'fetch_all_items':
    //   console.log(action.payload, `--> action.payload fetch_all_items`);
    //   return { ...state, fetchAllItems: action.payload };
    case ActionType.TABS_SUCCESS:
      // console.log(action.payload, `--> action.payload`);
      return { ...state, loading: false, error: null, data: action.payload };
    case ActionType.TABS_ERROR:
      return { ...state, loading: false, error: action.payload, data: [] };
    case ActionType.TAB_NUMBER:
      return { ...state, tabNumber: action.payload };
    case ActionType.BLOCK_NUMBER:
      // console.log(state, `--> state BLOCK_NUMBER`);
      const blockState = { ...state, blockNumber: action.payload } // eslint-disable-line
      // console.log(blockState, `--> blockState`);
      return blockState;
    default:
      // console.log(state, `--> state BLOCK_NUMBER DEFAULT`);
      return state;
  }
};

export default tabsReducer;
