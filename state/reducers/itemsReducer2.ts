import { ActionType } from '../action-types';
import { Action } from '../actions';
// import { Block } from '../../../../types/src/commonTypes';

export interface RepositoriesState {
  loading: boolean;
  error: string | null;
  // eslint-disable-next-line
  data2: any;
}

const initialState = {
  loading: false,
  error: null,
  data2: [],
};

const itemsReducer2 = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.FETCH_ITEM2:
      return { loading: true, error: null, data2: [] };
    case ActionType.FETCH_ITEM_SUCCESS2:
      return { loading: false, error: null, data2: action.payload };
    case ActionType.FETCH_ITEM_ERROR2:
      return { loading: false, error: action.payload, data2: [] };
    default:
      return state;
  }
};

export default itemsReducer2;
