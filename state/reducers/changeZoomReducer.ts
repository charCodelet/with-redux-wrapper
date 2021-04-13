import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  zoom: number;
}

const initialState = {
  zoom: 1,
};

const changeZoomReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.CHANGE_ZOOM:
      return { ...state, zoom: action.payload };
    default:
      return state;
  }
};

export default changeZoomReducer;
