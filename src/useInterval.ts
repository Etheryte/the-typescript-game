import React, { useState, useEffect, useRef } from "react";

// See https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
export default function useInterval<T extends Function>(callback: T, delay) {
  const savedCallback = useRef<T>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
