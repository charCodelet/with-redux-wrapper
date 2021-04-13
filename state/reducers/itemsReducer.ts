import { ActionType } from '../action-types';
import { Action } from '../actions';
// import { Block } from '../../../../types/src/commonTypes';

export interface RepositoriesState {
  loading: boolean;
  error: string | null;
  // eslint-disable-next-line
  data: any;
}

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const itemsReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.FETCH_ITEM:
      return { loading: true, error: null, data: [] };
    case ActionType.FETCH_ITEM_SUCCESS:
      return { loading: false, error: null, data: action.payload };
    case ActionType.FETCH_ITEM_ERROR:
      return { loading: false, error: action.payload, data: [] };
    default:
      return state;
  }
};

export default itemsReducer;
