import React from 'react';
import { useRovingTabIndex, useFocusEffect } from 'react-roving-tabindex';
import { BoxForwardRef as Box } from '../Base/Base';
import * as styles from './Button.styles';

function Button({ isDisabled = false, roving = false, ...props }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
    ref,
    isDisabled
  );
  useFocusEffect(focused, ref);
  return (
    <Box
      tx="buttons"
      as="button"
      variant="primary"
      ref={ref}
      tabIndex={roving ? tabIndex : undefined}
      disabled={isDisabled}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      // TODO: __css type does not seem to be correct
      __css={styles.button}
      {...props}
    />
  );
}

export default Button;
