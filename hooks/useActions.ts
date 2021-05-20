import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStart, createLaunch, fetchItem2, fetchItem, fetchTabs, getTabNumber, getBlockNumber, multipleSelect, setTheme, getScratch, changeZoom, fetchCalculatorElement, dropdownSelect, showDialog, setKeyboard, storeWiris, hasVisitedHelp, collectMouseMovements, saveCanvas, saveKeyboard, collectMouseMovementsInBatch  } from '../state/action-creators';
// eslint-disable-next-line
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators({fetchStart, createLaunch, fetchItem2, fetchItem, fetchTabs, getTabNumber, getBlockNumber, multipleSelect, setTheme, getScratch, changeZoom, fetchCalculatorElement, dropdownSelect, showDialog, setKeyboard, storeWiris, hasVisitedHelp, collectMouseMovements, saveCanvas, saveKeyboard, collectMouseMovementsInBatch }, dispatch);
};
