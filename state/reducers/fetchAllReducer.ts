import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  // eslint-disable-next-line
  fetchAllItems?: any;
}

const initialState = {
  fetchAllItems: []
};

const fetchAllReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.FETCH_ALL_ITEMS:
      return { ...state, fetchAllItems: action.payload };
    default:
      return state;
  }
};

export default fetchAllReducer;
