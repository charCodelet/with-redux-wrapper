import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  isKeyboardSet: boolean;
}

const initialState = {
  isKeyboardSet: false,
};

const setKeyboardReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.SET_KEYBOARD:
      return { ...state, isKeyboardSet: action.payload };
    default:
      return state;
  }
};

export default setKeyboardReducer;
