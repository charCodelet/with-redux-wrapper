import { focusRing } from '../shared/mixins';

const yellow = {
  50: '#fffff0',
  100: '#fefcbf',
  200: '#faf089',
  300: '#f6e05e',
  400: '#ecc94b',
  500: '#d69e2e',
  600: '#b7791f',
  700: '#975a16',
  800: '#744210',
  900: '#5F370E'
};

const green = {
  50: '#f0fff4',
  100: '#c6f6d5',
  200: '#9ae6b4',
  300: '#68d391',
  400: '#48bb78',
  500: '#38a169',
  600: '#2f855a',
  700: '#276749',
  800: '#22543d',
  900: '#1C4532'
};

const red = {
  50: '#fff5f5',
  100: '#fed7d7',
  200: '#feb2b2',
  300: '#fc8181',
  400: '#f56565',
  500: '#e53e3e',
  600: '#c53030',
  700: '#9b2c2c',
  800: '#822727',
  900: '#63171b'
};

const whiteAlpha = {
  50: 'rgba(255, 255, 255, 0.04)',
  100: 'rgba(255, 255, 255, 0.06)',
  200: 'rgba(255, 255, 255, 0.08)',
  300: 'rgba(255, 255, 255, 0.16)',
  400: 'rgba(255, 255, 255, 0.24)',
  500: 'rgba(255, 255, 255, 0.36)',
  600: 'rgba(255, 255, 255, 0.48)',
  700: 'rgba(255, 255, 255, 0.64)',
  800: 'rgba(255, 255, 255, 0.80)',
  900: 'rgba(255, 255, 255, 0.92)'
};

const blackAlpha = {
  50: 'rgba(0, 0, 0, 0.04)',
  100: 'rgba(0, 0, 0, 0.06)',
  200: 'rgba(0, 0, 0, 0.08)',
  300: 'rgba(0, 0, 0, 0.16)',
  400: 'rgba(0, 0, 0, 0.24)',
  500: 'rgba(0, 0, 0, 0.36)',
  600: 'rgba(0, 0, 0, 0.48)',
  700: 'rgba(0, 0, 0, 0.64)',
  800: 'rgba(0, 0, 0, 0.80)',
  900: 'rgba(0, 0, 0, 0.92)'
};

const orange = {
  50: '#FFFAF0',
  100: '#FEEBC8',
  200: '#FBD38D',
  300: '#F6AD55',
  400: '#ED8936',
  500: '#DD6B20',
  600: '#C05621',
  700: '#9C4221',
  800: '#7B341E',
  900: '#652B19'
};

const teal = {
  50: '#E6FFFA',
  100: '#B2F5EA',
  200: '#81E6D9',
  300: '#4FD1C5',
  400: '#38B2AC',
  500: '#319795',
  600: '#2C7A7B',
  700: '#285E61',
  800: '#234E52',
  900: '#1D4044'
};

const blue = {
  50: '#E3F2FD',
  100: '#BBDEFB',
  200: '#90CAF9',
  300: '#63b3ed',
  400: '#4299e1',
  500: '#3182ce',
  600: '#2a69ac',
  700: '#1e4e8c',
  800: '#153e75',
  900: '#1a365d'
};

const cyan = {
  50: '#EDFDFD',
  100: '#C4F1F9',
  200: '#9DECF9',
  300: '#76E4F7',
  400: '#0BC5EA',
  500: '#00B5D8',
  600: '#00A3C4',
  700: '#0987A0',
  800: '#086F83',
  900: '#065666'
};

const purple = {
  50: '#faf5ff',
  100: '#e9d8fd',
  200: '#d6bcfa',
  300: '#b794f4',
  400: '#9f7aea',
  500: '#805ad5',
  600: '#6b46c1',
  700: '#553c9a',
  800: '#44337a',
  900: '#322659'
};

const pink = {
  50: '#fff5f7',
  100: '#fed7e2',
  200: '#fbb6ce',
  300: '#f687b3',
  400: '#ed64a6',
  500: '#d53f8c',
  600: '#b83280',
  700: '#97266d',
  800: '#702459',
  900: '#521B41'
};

// primary colors
// https://gka.github.io/palettes/#/9|s|2478cc|ffffe0,ff005e,93003a|0|0
// https://www.colorbox.io/#steps=11#hue_start=206#hue_end=216#hue_curve=easeInBack#sat_start=1#sat_end=100#sat_curve=easeInSine#sat_rate=102#lum_start=100#lum_end=34#lum_curve=easeOutQuad#lock_hex=2478cc#minor_steps_map=0
const p = {
  25: '#fcfeff',
  50: '#f2faff',
  100: '#e0f1ff',
  200: '#c5e3fc',
  300: '#a4d0f6',
  400: '#7cb8ec',
  500: '#509bdf',
  600: '#2478cc',
  700: '#1159a7',
  800: '#043b80',
  900: '#002357'
};

type NeutralColors = {
  0: string;
  25?: string;
  50?: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
};

// neutral
// http://www.colorbox.io/#steps=10#hue_start=0#hue_end=0#hue_curve=easeInQuad#sat_start=0#sat_end=0#sat_curve=easeOutQuad#sat_rate=130#lum_start=94#lum_end=5#lum_curve=easeOutQuad#minor_steps_map=0
const n: NeutralColors = {
  0: '#ffffff',
  25: '#f5f5f5',
  50: '#eeeeee',
  100: '#ebebeb',
  200: '#e4e4e4',
  300: '#d8d8d8',
  400: '#c7c7c7',
  500: '#afafaf',
  600: '#909090',
  700: '#696969',
  800: '#3c3c3c',
  900: '#0d0d0d',
  1000: '#000000'
};

export const colors = {
  // PALETTES
  p, // primary
  n, // neutral
  yellow,
  green,
  whiteAlpha,
  blackAlpha,
  orange,
  red,
  blue,
  cyan,
  purple,
  pink,
  teal,

  // MAIN
  transparent: 'transparent',
  current: 'currentColor',
  bg: n['0'],
  text: n['800'],

  // remove? should keep the neutral colors
  // agnostic
  black: n['1000'],
  white: n['0'],

  // FEEDBACK
  info: cyan['400'],
  primary: p['600'],
  primaryAlt: n['0'],
  secondary: '#D6EBFF', // blue['100'],
  tertiary: blue['50'],
  warning: yellow['300'],
  warningAlt: n['800'],
  success: green['300'],
  successAlt: n['800'],
  danger: red['300']
  //   dangerAlt: n['80'] // TODO: replace this which was commented out
};

export const theme = {
  fontSizes: [12, 16, 18, 24, 32, 48, 64, 96],
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  radii: {
    none: '0',
    default: '0.25rem',
    sm: '2px',
    md: '4px',
    lg: '6px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,.20)',
    md: '0 2px 3px rgba(0,0,0,.25)',
    lg: '0 3px 4px rgba(0,0,0,.25)',
    none: 'none'
  },
  fonts: {
    body: 'Calibri, system-ui, sans-serif',
    mono: 'Menlo, monospace'
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },
  borders: {
    none: 0,
    1: '1px solid',
    2: '2px solid',
    4: '4px solid'
  },

  buttons: {
    primary: {
      border: 2,
      borderColor: 'primary',
      color: 'white',
      bg: 'primary',
      borderRadius: 'md',
      ':hover': {
        bg: 'p.500',
        borderColor: 'p.500',
        boxShadow: 'md'
      },
      ':active': {
        bg: 'p.700',
        borderColor: 'p.700',
        boxShadow: 'none'
      }
    },
    secondary: {
      color: 'primary',
      bg: 'n.0',
      borderRadius: 'md',
      border: 2,
      borderColor: 'n.400',
      ':hover': {
        boxShadow: 'md',
        borderColor: 'primary'
      },
      ':active': {
        bg: 'n.50',
        border: 'n.700',
        boxShadow: 'none'
      }
    },
    tertiary: {
      color: 'primary',
      bg: 'transparent',
      borderRadius: 'md',
      border: 2,
      borderColor: 'transparent',
      ':hover': {
        bg: 'p.100',
        borderColor: 'p.100'
      },
      ':active': {
        bg: 'p.200',
        borderColor: 'p.200'
      },
      ':disabled': {
        bg: 'transparent',
        borderColor: 'transparent'
      },
      ':focus': {
        // disable default focus ring
        outline: 'none'
      },
      ':focus::after': {
        ...focusRing({ inset: '-2px' })
      }
    },
    next: {
      variant: 'buttons.primary',
      fontSize: 3,
      paddingRight: 2,
      paddingLeft: 3,
      fontWeight: 'extrabold',
      borderRadius: 'full',
      ':focus::after': {
        ...focusRing({ borderRadius: 'full' })
      }
    },
    prev: {
      variant: 'buttons.secondary',
      p: 2,
      borderRadius: 'full',
      ':focus::after': {
        ...focusRing({ borderRadius: 'full' })
      }
    },
    bare: {
      color: 'currentColor', // VERIFY: this is to inherit base or parent color, otherwise it takes browser default
      p: 0,
      bg: 'transparent',
      border: 0,
      ':disabled': {
        bg: 'transparent',
        color: 'n.500'
      }
    },
    toolbar: {
      fontSize: 2,
      fontWeight: 'bold',
      color: 'n.800',
      bg: 'transparent',
      border: 1,
      borderColor: 'transparent',
      borderRadius: 'md',
      padding: 1,
      ':hover': {
        bg: 'white',
        boxShadow: 'sm',
        border: 1,
        borderColor: 'n.400'
      },
      ':active': {
        bg: 'n.200',
        border: 'n.700',
        boxShadow: 'none'
      },
      ':focus': {
        outlineOffset: 0
      },
      '&[disabled], &[disabled]:hover': {
        bg: 'transparent',
        // todo: reconcile disabled state (opacity)
        // with other button variants.
        opacity: '.5',
        borderColor: 'transparent',
        pointerEvents: 'none'
      }
    },
    toolbarActive: {
      variant: 'buttons.toolbar',
      bg: 'blue.100',
      borderColor: 'blue.400',
      transition: 'background .2s, border-color .2s, color .2s',
      borderWidth: 1,
      ':hover': {
        bg: 'blue.50',
        borderColor: 'blue.300'
      },
      ':active': {
        bg: 'blue.200',
        borderColor: 'blue.700'
      }
    }
  }
};

export default theme;
