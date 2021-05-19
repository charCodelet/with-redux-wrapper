import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  getCanvas: any;
}

const initialState = {
  getCanvas: {},
};

const saveCanvasReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(action.payload, `--> action.payload`)
  switch (action.type) {
    case ActionType.SAVE_CANVAS:
      return { ...state, getCanvas: action.payload };
    default:
      return state;
  }
};

export default saveCanvasReducer;
