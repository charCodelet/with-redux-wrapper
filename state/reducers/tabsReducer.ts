import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  loading?: boolean;
  error?: string | null;
  data?: any; // eslint-disable-line
  tabNumber?: number;
  blockNumber: string;
}

const initialState = {
  loading: false,
  error: null,
  data: [],
  tabNumber: 0,
  blockNumber: 'VH447212',
};

const tabsReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(state, `---------------> state [TABS_REDUCER]`);
  switch (action.type) {
    case ActionType.TABS_FETCH:
      return { ...state, loading: true, error: null, data: [] };
    case ActionType.TABS_SUCCESS:
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
