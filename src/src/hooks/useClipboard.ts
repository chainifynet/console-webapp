import { useEffect, useState } from "react";
import { useCopyToClipboard, useTimeoutFn, useToggle } from "react-use";

export function useClipboard(): [boolean, (value: string) => void] {
  const [{ value: copiedValue, error }, copyToClipboard] = useCopyToClipboard();
  const [justCopied, setJustCopied] = useState(false);
  const [on, toggle] = useToggle(false);

  // eslint-disable-next-line no-unused-vars
  const [isReady, cancel, reset] = useTimeoutFn(() => {
    if (justCopied) {
      setJustCopied(false);
    }
  }, 1500);

  useEffect(() => {
    if (copiedValue && !error) {
      setJustCopied(true);
      reset();
    }
    return () => {
      setJustCopied(false);
      reset();
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, copiedValue, error]);

  const doCopy = (value: string) => {
    if (justCopied && value === copiedValue) {
      return;
    }
    copyToClipboard(value);
    toggle();
  };
  return [justCopied, doCopy];
}
