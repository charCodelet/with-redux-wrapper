import SingleSelect from './SingleSelect';
import MultipleSelect from './MultipleSelect';
import Math from './Math';
import Dropdown from './Dropdown';
import GlobalProvider from './GlobalProvider';
import TextInput from './TextInput';
import ThemeProvider from './ThemeProvider';
import themes from './themes';
import Global from './Global';
import ListOfUnansweredItems from './ListOfUnansweredItems';
import * as components from '@coreym/benchmark';

export default {
  ...components,
  MultipleSelect,
  SingleSelect,
  Dropdown,
  GlobalProvider,
  TextInput,
  Global,
  themes,
  ListOfUnansweredItems,
  ThemeProvider,
  Math
};
