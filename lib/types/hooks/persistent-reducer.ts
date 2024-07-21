import { Reducer, ReducerState } from "react";

export type ReducerDefaultStateFunction<R extends Reducer<any, any>> =
  () => ReducerState<R>;

export type ReducerDefaultState<R extends Reducer<any, any>> =
  | ReducerState<R>
  | ReducerDefaultStateFunction<R>;
