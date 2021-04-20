export function focusRing(
  {
    borderColor = 'currentColor',
    border = '1px solid',
    borderRadius = 'sm',
    inset = '1px'
  } = {
    borderColor: 'currentColor',
    border: '1px solid',
    borderRadius: 'sm',
    inset: '1px'
  }
) {
  return {
    border: border,
    borderColor: borderColor,
    borderRadius: borderRadius,
    content: '""',
    display: 'block',
    opacity: 1,
    position: 'absolute',
    bottom: inset,
    left: inset,
    right: inset,
    top: inset
  };
}
