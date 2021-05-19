import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  moveXY: {
    moveX: string,
    moveY: string,
  },
  coordinates: string
}

const initialState = {
  moveXY: {
    moveX: '',
    moveY: '',
  },
  coordinates: '',
};

const mouseMovementsReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  
  switch (action.type) {
    case ActionType.COLLECT_MOUSE_MOVEMENTS:
      return { 
        ...state, 
        moveXY: {
          moveX: state.moveXY.moveX + action.payload.moveXY.moveX,
          moveY: state.moveXY.moveY + action.payload.moveXY.moveY,
        },
        coordinates: state.coordinates + action.payload.coordinates
      };
    default:
      return state;
  }
};

export default mouseMovementsReducer;
