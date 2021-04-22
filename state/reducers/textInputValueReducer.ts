import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  textInputEntered: any;
  globalState?: any; // eslint-disable-line
}

const initialState = {
  entered: '',
  textInputEntered: [],
  globalState: {},
};

const textInputValueReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(state, `--> state [TEXT_INPUT_VALUE]`);
  // console.log(action.type, `--> action.type`);
  switch (action.type) {
    case ActionType.TEXT_INPUT_VALUE:
      console.log(action.payload, `--> action.payload`);
      const textInputEntered = {...state, entered: action.payload/*, textInputEntered: [...state.textInputEntered, action.payload]*/};
      console.log(textInputEntered, `--> textInputEntered`);
      return textInputEntered;
    default:
      return state;
  }
};

export default textInputValueReducer;


