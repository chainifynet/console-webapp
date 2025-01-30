import { useCallback, useRef, useState } from "react";
import { useMountedState } from "react-use";

/**
 * Same as `useAsyncFn` but allowing reset the state.
 *
 * Useful for forms where we want to call an API only when the user clicks on a button.
 */
export default function useApi<T>(
  fn: (...args: any[]) => Promise<T>,
  deps = [],
  initialState: State<T> = { value: undefined, error: undefined, loading: false }
): [(...args: any[]) => Promise<T>, State<T>, () => void] {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState(initialState);
  const reset = () => set(initialState);

  const callback = useCallback(
    (...args: any[]) => {
      const callId = ++lastCallId.current;

      if (!state.loading) {
        set((prevState) => ({ ...prevState, loading: true }));
      }

      return fn(...args).then(
        (value: T) => {
          if (isMounted() && callId === lastCallId.current) {
            set({ value, loading: false });
          }
          return value;
        },
        (error: Error) => {
          if (isMounted() && callId === lastCallId.current) {
            set({ error, loading: false });
          }
          throw error;
        }
      );
    },
    [deps]
  );

  return [callback, state, reset];
}

type State<T> = {
  value?: T;
  error?: Error;
  loading: boolean;
};
