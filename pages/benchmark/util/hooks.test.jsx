import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  useNumberGenerator,
  useTransitionStates,
  TRANSITION_STATES as STATES
} from './hooks';

describe('useTransitionStates', () => {
  it('renders with unmounted animated child component by default', () => {
    const { queryByText } = render(
      <UseTransitionStatesTestComponent duration={200} />
    );
    expect(queryByText(STATES.UNMOUNTED)).toBeInTheDocument();
  });

  it('renders with animated component mounted when initial state is set', () => {
    const { queryByText } = render(
      <UseTransitionStatesTestComponent
        duration={200}
        initialState={STATES.MOUNTED}
      />
    );
    expect(queryByText(STATES.MOUNTED)).toBeInTheDocument();
  });

  it('can transition unmounted component to mounted then back to unmounted', async () => {
    const { queryByText, findByText } = render(
      <UseTransitionStatesTestComponent duration={200} />
    );
    expect(queryByText(STATES.UNMOUNTED)).toBeInTheDocument();

    userEvent.click(screen.getByText('Toggle'));
    expect(queryByText(STATES.MOUNTING)).toBeInTheDocument();

    const mounted = await findByText(STATES.MOUNTED);
    expect(mounted).toBeInTheDocument();

    userEvent.click(screen.getByText('Toggle'));
    expect(queryByText(STATES.UNMOUNTING)).toBeInTheDocument();

    const unmounted = await findByText(STATES.UNMOUNTED);
    expect(unmounted).toBeInTheDocument();
  });
});

describe('useNumberGenerator', () => {
  it('can generate 3 numbers sequentially', () => {
    const { queryByText } = render(<UseNumberGeneratorTestComponent />);

    expect(queryByText('0')).toBeInTheDocument();
    expect(queryByText('1')).toBeInTheDocument();
    expect(queryByText('2')).toBeInTheDocument();
  });

  it('can generate 3 numbers sequentially from a seed', () => {
    const { queryByText } = render(
      <UseNumberGeneratorTestComponent seed={5} />
    );

    expect(queryByText('5')).toBeInTheDocument();
    expect(queryByText('6')).toBeInTheDocument();
    expect(queryByText('7')).toBeInTheDocument();
  });
});

function UseNumberGeneratorTestComponent({ seed }) {
  const [getNext] = useNumberGenerator(seed);
  return (
    <>
      <span>{getNext()}</span>
      <span>{getNext()}</span>
      <span>{getNext()}</span>
    </>
  );
}

function UseTransitionStatesTestComponent(props) {
  const { state: transitionState, toggleTransition } = useTransitionStates(
    props
  );
  return (
    <>
      <span>{transitionState}</span>

      <button type="button" onClick={toggleTransition}>
        Toggle
      </button>
    </>
  );
}
