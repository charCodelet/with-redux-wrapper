import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  // eslint-disable-next-line
  fetchAllItems?: any;
}

const initialState = {
  fetchAllItems: []
};

const fetchAllReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(state, `--> state`);
  switch (action.type) {
    case ActionType.FETCH_ALL_ITEMS:
      // console.log('this will run after I click on the help button a second time...');
      // console.log('too late to attempt this now...but i think i have to somehow either 1) prevent this from running (preferable) or if it must run, manipulate the data so that it...actually that will not work...')
      return { ...state, fetchAllItems: action.payload };
    default:
      return state;
  }
};

export default fetchAllReducer;
