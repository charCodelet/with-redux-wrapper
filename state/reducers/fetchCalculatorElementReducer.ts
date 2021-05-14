import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface RepositoriesState {
  // eslint-disable-next-line
  calculator: any;
  calculatorModel: any;
}

const initialState = {
  calculator: '', // document.body,
  calculatorModel: '',
};

const fetchCalculatorElementReducer = (state: RepositoriesState = initialState, action: Action): RepositoriesState => {
  switch (action.type) {
    case ActionType.FETCH_CALCULATOR_ELEMENT:
      return { 
        ...state, 
        calculator: action.payload.element,
        calculatorModel: action.payload.model,
      };
    default:
      return state;
  }
};

export default fetchCalculatorElementReducer;
