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
import CryptoJS from "crypto-js";

import { isBrowser } from "../utils/auth";
import {
  ReducerDefaultState,
  ReducerDefaultStateFunction,
} from "../types/hooks/persistent-reducer";

const SECRET_KEY = process.env.NEXT_PUBLIC_LOCAL_STORAGE_SECRET_KEY;

const usePersistentReducer = <R extends Reducer<any, any>>(
  reducer: R,
  defaultState: ReducerDefaultState<R>,
  key: string,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
): [ReducerState<R>, Dispatch<ReducerAction<R>>] => {
  const [state, dispatch] = useReducer(reducer, defaultState, (stateArg) => {
    const valueInLocalStorage = isBrowser() ? localStorage.getItem(key) : null;
    if (valueInLocalStorage) {
      try {
        const bytes = CryptoJS.AES.decrypt(valueInLocalStorage, SECRET_KEY!);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedData) {
          throw new Error("Decryption failed");
        }
        return deserialize(decryptedData);
      } catch (error) {
        return typeof defaultState === "function"
          ? (defaultState as ReducerDefaultStateFunction<R>)()
          : stateArg;
      }
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
    const encryptedData = CryptoJS.AES.encrypt(
      serialize(state),
      SECRET_KEY!
    ).toString();
    localStorage?.setItem(key, encryptedData);
  }, [key, state, serialize]);

  return [state, dispatch];
};

export default usePersistentReducer;
