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
        // console.log(state, ` --> state`);
        // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":"VH504849"} Change Theme ${action?.payload})}`);
        return { ...state, theme: 'dark' };
      } else if (action.payload === 'dark') {
        // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":"VH504849"} Change Theme ${action?.payload})}`);
        return { ...state, theme: 'beige' };
      } else {
        // console.log(`[OBS] booklet position ${new Date()} {"studentId":9925525,"blockId":887,"itemId":4316,"accessionNumber":"VH504849"} Change Theme ${action?.payload})}`);
        return { ...state, theme: 'default' };
      }
    default:
      return state;
  }
};

export default setThemeReducer;
