import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  selected: string;
  eliminated: string[];
  // globalState: any; // eslint-disable-line
  globalStateSingle: any; // eslint-disable-line
}

const initialState = {
  selected: '',
  eliminated: [],
  globalState: {},
  globalStateSingle: {},
};

const singleSelectReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(state, `---------------> state [MULTIPLE_SELECTE_REDUCER]`);
  switch (action.type) {
    case ActionType.SINGLE_SELECT:
      // console.log('SINGLE_SELECT');
      // console.log(state, `--> state`);
      return { ...state, selected: action.payload, eliminated: state.eliminated.filter((s) => s != action.payload) }; // eslint-disable-line
    case ActionType.SINGLE_ELIMINATE:
      // console.log('SINGLE_ELIMINATE');
      return { ...state, selected: state.selected, eliminated: state.eliminated.concat(action.payload) }; // prettier-ignore
    case ActionType.SINGLE_CLEAR:
      // console.log('SINGLE_CLEAR');
      const globalStateSingle = { ...state.globalStateSingle, 'selected': {...state.globalStateSingle.selected, [parseInt(action.payload)]: state.selected}, 'eliminated': {...state.globalStateSingle.eliminated, [parseInt(action.payload)]: state.eliminated} }; // eslint-disable-line
      // console.log(state, `--> state [before]`);
      const singleClear = { ...state, globalStateSingle, selected: '', eliminated: [] }; // eslint-disable-line
      // console.log(singleClear, `--> singleClear [return]`);
      return singleClear;
    default:
      return state;
  }
};

export default singleSelectReducer;
