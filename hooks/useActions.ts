import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStart, createLaunch, fetchItem2, fetchItem, fetchTabs, getTabNumber, getBlockNumber, multipleSelect, singleSelect, setTheme, getScratch, changeZoom, fetchCalculatorElement } from '../state/action-creators';
// eslint-disable-next-line
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators({fetchStart, createLaunch, fetchItem2, fetchItem, fetchTabs, getTabNumber, getBlockNumber, multipleSelect, singleSelect, setTheme, getScratch, changeZoom, fetchCalculatorElement}, dispatch);
};
