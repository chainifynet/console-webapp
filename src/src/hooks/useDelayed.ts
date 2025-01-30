import { useEffect, useState } from "react";
import { usePrevious } from "react-use";

/**
 * Delay for 300ms setting the value when it becomes falsy
 *
 * So we avoid issues with animations on disappearing elements, so imagine val = "hello", and then the delayed val will be "hello"
 * but if val is updated to "" then the delayed val will be "hello" for 300ms and then it will be "".
 */
export function useDelayed<T>(val: T) {
  const prevVal = usePrevious(val);
  const [delayed, setDelayed] = useState(val);

  useEffect(() => {
    if (val) {
      setDelayed(val);
      return;
    }
    let timeout: any;
    if (prevVal && !val) {
      timeout = setTimeout(() => setDelayed(val), 300);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      setDelayed(val);
    };
  }, [prevVal, val]);

  return delayed;
}
