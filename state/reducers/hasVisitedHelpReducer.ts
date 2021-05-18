import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  hasVisited: boolean;
}

const initialState = {
  hasVisited: false,
};

const hasVisitedHelpReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  
  switch (action.type) {
    case ActionType.HAS_VISITED:
      console.log(action.payload, `--> action.payload`)
      return { ...state, hasVisited: action.payload };
    default:
      return state;
  }
};

export default hasVisitedHelpReducer;
