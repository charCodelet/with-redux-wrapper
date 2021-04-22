import React from 'react';
import Stack from '../components/Stack';
import Button from '../components/Button';
import { Box } from '../components/Base';
import { useTransitionStates, TRANSITION_STATES } from './hooks';

export default {
  title: 'Hooks/useTransitionStates'
};

export function BasicExample() {
  const { state: transitionState, toggleTransition } = useTransitionStates({
    duration: 2000
  });

  return (
    <Stack>
      <Button onClick={toggleTransition}> toggle state</Button>
      <span>Current State: {transitionState}</span>
      <Box
        height="100px"
        width="100px"
        bg={getColorByState(transitionState)}
        opacity={
          transitionState === TRANSITION_STATES.UNMOUNTED ||
          transitionState === TRANSITION_STATES.UNMOUNTING
            ? 0
            : 100
        }
        sx={{
          transition: 'opacity 2s linear'
        }}
      />
    </Stack>
  );
}

function getColorByState(state) {
  switch (state) {
    case TRANSITION_STATES.MOUNTED:
      return 'success';
    case TRANSITION_STATES.MOUNTING:
      return 'warning';
    case TRANSITION_STATES.UNMOUNTING:
      return 'danger';
    default:
      return '';
  }
}
