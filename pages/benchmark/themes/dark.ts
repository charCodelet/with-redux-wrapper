import { colors, theme as base } from './base';

const theme = {
  ...base,
  colors: {
    ...colors,
    n: {
      0: '#000000',
      // 50: '#111111', // todo: used or needed?
      100: '#0d0d0d',
      200: '#3c3c3c',
      300: '#696969',
      400: '#909090',
      500: '#afafaf',
      600: '#c7c7c7',
      700: '#d8d8d8',
      800: '#e4e4e4',
      900: '#ebebeb',
      1000: '#ffffff'
    },
    text: '#ffffff',
    bg: '#000000',
    secondary: '#3c3c3c'
  },
  buttons: {
    ...base.buttons,
    primary: {
      ...base.buttons.primary,
      bg: 'p.900'
    }
  }
};

export default theme;
