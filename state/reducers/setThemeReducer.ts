import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  theme: string;
}

const initialState = {
  theme: 'default',
};

const setThemeReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.SET_THEME:
      if (action.payload === 'default') {
        return { ...state, theme: 'dark' };
      } else if (action.payload === 'dark') {
        return { ...state, theme: 'beige' };
      } else {
        return { ...state, theme: 'default' };
      }
    default:
      return state;
  }
};

export default setThemeReducer;
