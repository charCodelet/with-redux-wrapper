/* eslint-disable jsx-a11y/no-autofocus */
import React, { ReactNode, useEffect } from 'react';
import { useOverlay, usePreventScroll, useModal } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { AriaDialogProps } from '@react-types/dialog';
import { FocusScope } from '@react-aria/focus';
import { BoxForwardRef as Box, BoxProps } from '../Base';
import * as styles from './Dialog.styles';
import { TRANSITION_STATES, useTransitionStates } from '../util/hooks';
import { fadeDown, fadeUp } from '../util/animations';

interface DialogExtraProps extends AriaDialogProps {
  children?: ReactNode;
  title?: string;
  /**
   * Whether the dialog should close on outside interactions.
   */
  isDismissable?: boolean;
  /**
   * Whether the dialog can be closed by pressing the escape key.
   */
  isKeyboardDismissDisabled?: boolean;
  /**
   * Whether the dialog is open or not.
   */
  isOpen: boolean;
  /**
   * Event called when the dialog closes.
   */
  onClose: () => void;
  /**
   * Required for useDialog -- AriaDialogProps
   */
}

type DialogProps = BoxProps<'div'> & DialogExtraProps;

function getAnimation(currentState: TRANSITION_STATES): string {
  switch (currentState) {
    case TRANSITION_STATES.MOUNTING:
      return fadeDown;
    case TRANSITION_STATES.UNMOUNTING:
      return fadeUp;
    default:
      return 'none';
  }
}

// Naming this "dialog" for now as there is a good chance
// that this component will be used for both modal and
// non-modal use cases.
function Dialog(props: DialogProps) {
  const { children, isOpen = false } = props;
  const {
    state: transState = TRANSITION_STATES.UNMOUNTED,
    toggleTransition = () => {}
  } = useTransitionStates({ duration: 200 });

  useEffect(() => {
    if (
      (isOpen && transState === TRANSITION_STATES.UNMOUNTED) ||
      (!isOpen && transState === TRANSITION_STATES.MOUNTED)
    ) {
      toggleTransition();
    }
  }, [isOpen, transState, toggleTransition]);

  // Handles interactions outsitde of the modal.
  // e.g. escape key to close
  let ref = React.useRef<HTMLDivElement>(null);
  let { overlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open
  usePreventScroll();
  // let { modalProps } = useModal();
  let { dialogProps } = useDialog(props, ref);

  return transState !== TRANSITION_STATES.UNMOUNTED ? (
    <Box sx={styles.backdrop}>
    <FocusScope contain restoreFocus autoFocus>
      <Box
        // open={isOpen} // TODO: confirm this is not needed
        ref={ref}
        sx={{
          ...styles.modal,
          animation: getAnimation(transState as TRANSITION_STATES)
        }}
        {...overlayProps}
        // {...modalProps}
        {...dialogProps}
      >
        {children}
      </Box>
    </FocusScope>
  </Box>
  ) : null;
}

Dialog.displayName = 'Dialog';

export default Dialog;
