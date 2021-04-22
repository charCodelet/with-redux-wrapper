// This is the first phase of trying to normalise animations
// across benchmark.
//
// It will act as a central area to store animations (for
// now). At a later stage this will be refactored to
// provide more elegant animation primitives.

import { keyframes } from '@emotion/react';

// Decoupling animation length into it's own variable as it
// could potentially be migrated into a design token at a
// later stage.
export const durations = {
  normal: '.2s',
  long: '.5s'
};

export const transitions = {
  easeLong: `transform ${durations.long} ease`
};

// Used to gently ease new elements to the screen.
// Fade-in the element and slides it down slightly.
// Use cases:
// - Showing modals
export const fadeDownFrames = keyframes`
from {
  opacity: 0;
  transform: translateY(-20%);
}
to {
  opacity: 1;
  transform: translateY(0);
}`;

export const fadeDown = `${fadeDownFrames} ${durations.normal} ease`;

export const fadeUpFrames = keyframes`
from {
  opacity: 1;
  transform: translateY(0);
}
to {
  opacity: 0;
  transform: translateY(-20%);
}`;

export const fadeUp = `${fadeUpFrames} ${durations.normal} ease`;

// Rotates an element 180 degrees.
// Use cases:
// - Transition down arrow (open) to up (closed).
export const flip = 'rotate(180deg)';
