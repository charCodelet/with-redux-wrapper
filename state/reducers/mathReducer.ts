import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  ssrMath: string;
}

const initialState = {
  ssrMath: '',
};

const mathReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.SSR_MATH:
      console.log(action.payload, `--> action.payload`);
      return { ...state, ssrMath: action.payload };
    default:
      return state;
  }
};

export default mathReducer;
