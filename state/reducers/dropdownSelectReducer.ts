import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  selected: string;
  globalState: any; // eslint-disable-line
}

const initialState = {
  selected: '',
  globalState: {},
};

const dropdownSelectReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(state, `---------------> state [MULTIPLE_SELECTE_REDUCER]`);
  switch (action.type) {
    case ActionType.DROPDOWN_SELECT:
      console.log('DROPDOWN_SELECT');
      console.log(action.payload, `--> action.payload`);
      return state;
      // return { ...state, selected: action.payload, eliminated: state.eliminated.filter((s) => s != action.payload) }; // eslint-disable-line
    default:
      return state;
  }
};

export default dropdownSelectReducer;
