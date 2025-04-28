import { useCallback, useRef } from "react";

export function useSave(callback: () => void, delay: number) {
  const timerRef = useRef<any>();

  const clearTimer = () => {
    clearTimeout(timerRef.current);
  };

  const setTimer = useCallback(() => {
    clearTimer();

    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  return { onChange: setTimer };
}
