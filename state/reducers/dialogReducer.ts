import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  dialogShow: boolean;
}

const initialState = {
  dialogShow: false,
};

const dialogReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.DIALOG_SHOW:
      return { ...state, dialogShow: !state.dialogShow };
    default:
      return state;
  }
};

export default dialogReducer;
