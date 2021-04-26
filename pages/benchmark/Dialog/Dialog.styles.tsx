export const backdrop = {
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  background: 'rgba(255,255,255,.8)'
} as const;

export const modal = {
  display: 'block',
  zIndex: 101,
  // maxWidth: '28em',
  borderRadius: 'md',
  //TODO: Use token in future
  boxShadow: '0 0 3em 0.25em rgba(0,0,0,.35), 0 0 0.75em rgba(0,0,0,.35)',
  background: 'white',
  color: 'black',
  // padding: 4
} as const;
