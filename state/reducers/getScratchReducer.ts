import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  scratch: boolean;
}

const initialState = {
  scratch: false,
};

const getScratchReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.GET_SCRATCH:
      return { ...state, scratch: action.payload };
    default:
      return state;
  }
};

export default getScratchReducer;
