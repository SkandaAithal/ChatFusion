import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useDebugValue,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { isBrowser } from "../utils/auth";
import {
  ReducerDefaultState,
  ReducerDefaultStateFunction,
} from "../types/hooks/persistent-reducer";

const usePersistentReducer = <R extends Reducer<any, any>>(
  reducer: R,
  defaultState: ReducerDefaultState<R>,
  key: string,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
): [ReducerState<R>, Dispatch<ReducerAction<R>>] => {
  const [state, dispatch] = useReducer(reducer, defaultState, (stateArg) => {
    const valueInLocalStorage = isBrowser() ? localStorage.getItem(key) : null;
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultState === "function"
      ? (defaultState as ReducerDefaultStateFunction<R>)()
      : stateArg;
  });

  useDebugValue(`${key}: ${serialize(state)}`);

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      localStorage?.removeItem(prevKey);
    }
    prevKeyRef.current = key;
  }, [key]);

  useEffect(() => {
    localStorage?.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, dispatch];
};

export default usePersistentReducer;
