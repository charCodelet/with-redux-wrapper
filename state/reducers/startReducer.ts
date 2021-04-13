import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  loading: boolean;
  error: string | null;
  data: string[];
}

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const startReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.FETCH_START:
      return { loading: true, error: null, data: [] };
    case ActionType.FETCH_START_SUCCESS:
      return { loading: false, error: null, data: action.payload };
    case ActionType.FETCH_START_ERROR:
      return { loading: false, error: action.payload, data: [] };
    default:
      return state;
  }
};

export default startReducer;
