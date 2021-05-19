import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  getKeyboard: any;
}

const initialState = {
  getKeyboard: {},
};

const saveKeyboardReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(action.payload, `--> action.payload`)
  switch (action.type) {
    case ActionType.SAVE_KEYBOARD:
      console.log(action.payload, `--> action.payload keyboard`)
      return { ...state, getKeyboard: action.payload };
    default:
      return state;
  }
};

export default saveKeyboardReducer;
