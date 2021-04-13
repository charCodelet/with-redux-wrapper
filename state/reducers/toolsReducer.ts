import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  loading: boolean;
  error: string | null;
  data: any; // eslint-disable-line
}

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const toolsReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.TOOLS_PROPS_FETCH:
      return { loading: true, error: null, data: [] };
    case ActionType.TOOLS_PROPS_SUCCESS:
      return { loading: false, error: null, data: action.payload };
    case ActionType.TOOLS_PROPS_ERROR:
      return { loading: false, error: action.payload, data: [] };
    default:
      return state;
  }
};

export default toolsReducer;
