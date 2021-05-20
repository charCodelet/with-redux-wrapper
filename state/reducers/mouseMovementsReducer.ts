import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  moveXY: {
    moveX: string,
    moveY: string,
  },
  coordinates: string,
  batchedCoords: [],
}

const initialState = {
  moveXY: {
    moveX: '',
    moveY: '',
  },
  coordinates: '',
  batchedCoords: [],
};

const mouseMovementsReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  
  switch (action.type) {
    case ActionType.COLLECT_MOUSE_MOVEMENTS_IN_BATCH:
      return {
        ...state, 
        batchedCoords: action.payload
      }
    case ActionType.COLLECT_MOUSE_MOVEMENTS:
      let mouseMoves = { 
        ...state, 
        moveXY: {
          moveX: state.moveXY.moveX + action.payload.moveXY.moveX,
          moveY: state.moveXY.moveY + action.payload.moveXY.moveY,
        },
        coordinates: state.coordinates + action.payload.coordinates
      };
      // console.log(mouseMoves.coordinates, `--> mouseMoves.coordinates`);
      return mouseMoves;
    default:
      return state;
  }
};

export default mouseMovementsReducer;
