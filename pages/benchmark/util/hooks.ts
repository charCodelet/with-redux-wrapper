import { useState, useEffect, useCallback, useRef } from 'react';
import { numberGenerator } from './helpers';
import { Maybe } from './types';

// TODO: remove any
export function useArrayToggle(
  initialValue: string[] = []
): [string[], (item: any) => void, () => void] {
  const [state, setState] = useState<string[]>(initialValue);

  // TODO: remove any
  function toggle(item: any) {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item));
    } else {
      setState([...state, item]);
    }
  }

  function reset() {
    setState([]);
  }

  return [state, toggle, reset];
}

export function useToggle(initialState = false): [boolean, () => void] {
  const [state, setState] = useState(initialState);
  const toggle = () => setState(!state);
  return [state, toggle];
}

// TODO: remove any
export const useOutsideClick = (ref, callback: (...props: any) => any) => {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export enum TRANSITION_STATES {
  UNMOUNTED = 'unmounted',
  MOUNTED = 'mounted',
  MOUNTING = 'mounting',
  UNMOUNTING = 'unmounting'
}

export interface UseTransitionStateOptions {
  duration?: number;
  initialState?: TRANSITION_STATES;
}

export function useTransitionStates(options?: UseTransitionStateOptions) {
  const { duration = 1000, initialState = TRANSITION_STATES.UNMOUNTED } =
    options ?? {};
  const [state, setState] = useState(initialState);

  const toggleTransition = useCallback(() => {
    switch (state) {
      case TRANSITION_STATES.UNMOUNTED:
        setState(TRANSITION_STATES.MOUNTING);
        break;
      case TRANSITION_STATES.MOUNTED:
        setState(TRANSITION_STATES.UNMOUNTING);
        break;
      default:
        return;
    }
  }, [state, setState]);

  useEffect(() => {
    if (
      state === TRANSITION_STATES.MOUNTED ||
      state === TRANSITION_STATES.UNMOUNTED
    ) {
      return;
    }

    const id = setTimeout(
      () =>
        setState(
          state === TRANSITION_STATES.MOUNTING
            ? TRANSITION_STATES.MOUNTED
            : TRANSITION_STATES.UNMOUNTED
        ),
      duration
    );

    return () => {
      clearTimeout(id);
    };
  }, [duration, state, setState]);
  return { state, toggleTransition };
}

// Generators a number based on a given starting seed
// not guaranteed to be unique between instances of the hook
// not appropriate for unique ids
// use useId if you need a number generator that returns globally unique ids.
export function useNumberGenerator(seed: number = 0) {
  // we use useRef here instead of useState because we don't want to trigger
  // downstream renders every time we generate a new value
  // this allows us to defer control of renders to the consuming component
  // when a new value is generated
  // https://reactjs.org/docs/hooks-reference.html#useref
  const ref = useRef(numberGenerator(seed));

  useEffect(() => () => {
    ref.current.return();
  });

  const getNext: () => number = () => {
    const next = ref.current.next();
    if (next.done) {
      throw new Error('Can not get next value of disposed numberGenerator');
    }
    return next.value;
  };

  return [getNext];
}

const globalAutoIdGen = numberGenerator(1);

// Generate numeric id from global seed, if argument is provided that will be returned as the id
export function useId(providedId?: Maybe<string | number>) {
  const [id, setId] = useState<Maybe<string | number>>(providedId);

  useEffect(() => {
    if (id) {
      return;
    }

    const { done, value } = globalAutoIdGen.next();

    if (done) {
      throw new Error('useId: generator disposed, can not generate id');
    }

    setId(value as number);
  }, [setId, id]);

  return id;
}
