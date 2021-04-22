import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  selected: string[];
  eliminated: string[];
  globalState: any; // eslint-disable-line
}

const initialState = {
  selected: [],
  eliminated: [],
  globalState: {},
};

const multipleSelectReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  // console.log(state, `---------------> state [MULTIPLE_SELECT_REDUCER]`);
  switch (action.type) {
    case ActionType.MULTIPLE_SELECT:
      // console.log('MULTIPLE_SELECT');
      // console.log(state, `--> state`);
      const multSelect = { ...state, selected: state.selected.concat(action.payload), eliminated: state.eliminated.filter((s) => s != action.payload) }; // eslint-disable-line
      // console.log(multSelect, `--> multSelect`);
      return multSelect;
    case ActionType.MULTIPLE_ELIMINATE:
      // console.log('MULTIPLE_ELIMINATE');
      const multEliminate = { ...state, selected: state.selected.filter((s) => s != action.payload), eliminated: state.eliminated.concat(action.payload) }; // prettier-ignore
      // console.log(multEliminate, `--> multEliminate`);
      return multEliminate;
    case ActionType.MULTIPLE_CLEAR:
      // console.log('MULTIPLE_CLEAR');
      const globalState = { ...state.globalState, 'selected': {...state.globalState.selected, [parseInt(action.payload)]: state.selected}, 'eliminated': {...state.globalState.eliminated, [parseInt(action.payload)]: state.eliminated} }; // eslint-disable-line
      // console.log(state, `--> state [before]`);
      const multClear = { ...state, globalState, selected: [], eliminated: [] }; // eslint-disable-line
      // console.log(multClear, `--> multClear [after]`);
      return multClear;
    default:
      return state;
  }
};

export default multipleSelectReducer;
