import SingleSelect from './SingleSelect';
import MultipleSelect from './MultipleSelect';
import Button from './Button';
import {Box, BoxForwardRef} from './Base';
import Math from './Math';
import Dropdown from './Dropdown';
import GlobalProvider from './GlobalProvider';
import TextInput from './TextInput';
import ThemeProvider from './ThemeProvider';
import themes from './themes';
import Global from './Global';
import Dialog from './Dialog';
import ListOfUnansweredItems from './ListOfUnansweredItems';
import Zones from './Zones';
import * as components from '@coreym/benchmark';

export default {
  ...components,
  Box,
  Button,
  BoxForwardRef,
  MultipleSelect,
  SingleSelect,
  Dropdown,
  GlobalProvider,
  TextInput,
  Global,
  Dialog,
  themes,
  ListOfUnansweredItems,
  ThemeProvider,
  Math,
  Zones,
};
