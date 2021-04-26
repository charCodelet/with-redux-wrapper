import { focusRing } from '../shared/mixins';

export const button = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  px: 3,
  py: 2,
  fontSize: 3,
  transition: 'background .2s,border .2s,box-shadow .2s,color .2s',
  ':focus': {
    // disable default focus ring
    outline: 'none'
  },
  ':focus::after': {
    ...focusRing()
  },
  ':disabled': {
    pointerEvents: 'none',
    bg: 'n.300',
    borderColor: 'n.300',
    color: 'n.600',
    boxShadow: 'none'
  }
} as const;
