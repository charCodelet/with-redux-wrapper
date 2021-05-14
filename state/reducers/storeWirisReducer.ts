import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  getWiris: any;
}

const initialState = {
  getWiris: {},
};

const storeWirisReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  
  switch (action.type) {
    case ActionType.STORE_WIRIS:
      return { ...state, getWiris: action.payload };
    default:
      return state;
  }
};

export default storeWirisReducer;
