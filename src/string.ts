import type { Sub } from "./sub";

export type StringLength<
  S extends string,
  Acc extends number[] = []
> = S extends `${string}${infer Rest}`
  ? StringLength<Rest, [0, ...Acc]>
  : Acc["length"];

export type SplitStringIntoChars<S extends string> =
  S extends `${infer Char}${infer Rest}`
    ? [Char, ...SplitStringIntoChars<Rest>]
    : [];

export type Repeat<
  S extends string,
  N extends number,
  Acc extends string = ""
> = N extends 0 ? Acc : Repeat<S, Sub<N, 1>, `${Acc}${S}`>;

export type StringToNumber<T extends string> =
  T extends `${infer N extends number}` ? N : 0;

export type ReverseString<
  S extends string,
  Acc extends string = ""
> = S extends `${infer Char}${infer Rest}`
  ? ReverseString<Rest, `${Char}${Acc}`>
  : Acc;

export type Pad0<S extends string, N extends number> = StringLength<S> extends N
  ? S
  : Pad0<`0${S}`, N>;

export type RemovePad0<S extends string> = S extends `0${infer Rest}`
  ? RemovePad0<Rest>
  : S extends ""
  ? "0"
  : S;
