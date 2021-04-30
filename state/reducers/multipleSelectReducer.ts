import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  selected: string[];
  eliminated: string[];
  entered: any;
  dropdownSelected: any;
  globalState: any; 
}

const initialState = {
  entered: '',
  dropdownSelected: [],
  selected: [],
  eliminated: [],
  globalState: {},
};

const multipleSelectReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.DROPDOWN_SELECT:
      const dropdownSelectedValue = {
        ...state, 
        dropdownSelected: {
          [action.payload.tabNumber]: [state.dropdownSelected[action.payload.tabNumber], action.payload.optionId]
        },
        globalState: {
          ...state.globalState, 
          dropdownSelected: {
            ...state.globalState.dropdownSelected,
            [action.payload.tabNumber]: [state.dropdownSelected[action.payload.tabNumber], action.payload.optionId]
          },
          selected: state.globalState.selected,        
          eliminated: state.globalState.eliminated,  
          entered: state.globalState.entered,         
        }
      }
      let filterUndefined = dropdownSelectedValue.dropdownSelected[action.payload.tabNumber].map(v => v).filter(v => v);
      console.log(filterUndefined, `--> filterUndefined`);
      dropdownSelectedValue.dropdownSelected[action.payload.tabNumber] = filterUndefined;
      console.log(dropdownSelectedValue, `--> dropdownSelectedValue`);
      return dropdownSelectedValue;
    case ActionType.TEXT_INPUT_VALUE:
      const textInputEntered = {
        ...state, 
        entered: {
          [action.payload.tabNumber]: action.payload.optionId
        },
        globalState: {
          ...state.globalState, 
          entered: {
            ...state.globalState.entered,
            [action.payload.tabNumber]: action.payload.optionId
          },
          selected: state.globalState.selected,        
          eliminated: state.globalState.eliminated,          
        }
      }
      console.log(textInputEntered, `--> textInputEntered`);
      return textInputEntered;
    case ActionType.MULTIPLE_SELECT: 
      const multSelect = { 
        ...state,
        selected: state.selected.concat(action.payload.optionId), 
        eliminated: state.eliminated.filter((s) => s != action.payload.optionId),
        globalState: {
          ...state.globalState, 
          selected: {
            ...state.globalState.selected,
            [action.payload.tabNumber]: state.selected.concat(action.payload.optionId)
          }, 
          eliminated: {
            ...state.globalState.eliminated,
            [action.payload.tabNumber]: state.eliminated.filter((s) => s != action.payload.optionId),
          }
        }
      }
      // console.log(multSelect.globalState, `--> multSelect.globalState`);
      return multSelect;
    case ActionType.MULTIPLE_ELIMINATE:
      const multEliminate = { 
        ...state,
        selected: state.selected.filter((s) => s != action.payload.optionId),
        eliminated: state.eliminated.concat(action.payload.optionId),
        globalState: {
          ...state.globalState, 
          selected: {
            ...state.globalState.selected,
            [action.payload.tabNumber]: state.selected.filter((s) => s != action.payload.optionId),
          }, 
          eliminated: {
            ...state.globalState.eliminated,
            [action.payload.tabNumber]: state.eliminated.concat(action.payload.optionId)
          }
        }
      }
      // console.log(multEliminate.globalState, `--> multEliminate.globalState`);
      return multEliminate;
    case ActionType.MULTIPLE_CLEAR:
      // console.log({ ...state, ...state.globalState, selected: [], eliminated: [] }, `--> { ...state, ...state.globalState, selected: [], eliminated: [] }`);
      const multClear = { 
        ...state, 
        ...state.globalState, 
        selected: [], 
        eliminated: [] 
      };
      // console.log(multClear.globalState.eliminated, `--> eliminated`);
      // console.log(multClear.globalState.selected, `--> selected`);
      console.log(multClear, `--> multClear`);
      return multClear;
    default:
      return state;
  }
};

export default multipleSelectReducer;
