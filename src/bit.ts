import { Test } from "ts-toolbelt";
import type { Pad0, AutoPad0, RemovePad0, ReverseString } from "./string";
import type { Sub } from "./sub";

type Bit = "0" | "1";

type SingleBitOr<A extends Bit, B extends Bit> = A extends "0"
  ? B extends "0"
    ? "0"
    : "1"
  : "1";

type _BitOr<
  A extends string,
  B extends string,
  Acc extends string = ""
> = A extends `${infer ABit extends Bit}${infer ARest}`
  ? B extends `${infer BBit extends Bit}${infer BRest}`
    ? ARest extends ""
      ? `${Acc}${SingleBitOr<ABit, BBit>}`
      : _BitOr<ARest, BRest, `${Acc}${SingleBitOr<ABit, BBit>}`>
    : never
  : never;

export type BitOr<A extends string, B extends string> = RemovePad0<
  _BitOr<AutoPad0<A, B>, AutoPad0<B, A>>
>;

type SingleBitAnd<A extends Bit, B extends Bit> = A extends "1"
  ? B extends "1"
    ? "1"
    : "0"
  : "0";

type _BitAnd<
  A extends string,
  B extends string,
  Acc extends string = ""
> = A extends `${infer ABit extends Bit}${infer ARest}`
  ? B extends `${infer BBit extends Bit}${infer BRest}`
    ? ARest extends ""
      ? `${Acc}${SingleBitAnd<ABit, BBit>}`
      : _BitAnd<ARest, BRest, `${Acc}${SingleBitAnd<ABit, BBit>}`>
    : never
  : never;

export type BitAnd<A extends string, B extends string> = RemovePad0<
  _BitAnd<AutoPad0<A, B>, AutoPad0<B, A>>
>;

type _BitShiftLeft<
  A extends string,
  N extends number
> = A extends `${infer _Bit}${infer Rest}`
  ? N extends 0
    ? A
    : _BitShiftLeft<`${Rest}0`, Sub<N, 1>>
  : never;

export type BitShiftLeftBase2<
  Num extends string,
  BitLength extends number,
  Shift extends number
> = RemovePad0<_BitShiftLeft<Pad0<Num, BitLength>, Shift>>;

export type BitShiftRightBase2<A extends string, N extends number> = RemovePad0<
  ReverseString<_BitShiftLeft<ReverseString<A>, N>>
>;

Test.checks([
  Test.check<BitOr<"1010", "1100">, "1110", Test.Pass>(),
  Test.check<BitOr<"a", "1100">, never, Test.Pass>(),
  Test.check<BitOr<"1010", "b">, never, Test.Pass>(),

  Test.check<BitAnd<"1010", "1100">, "1000", Test.Pass>(),
  Test.check<BitAnd<"a", "1100">, never, Test.Pass>(),
  Test.check<BitAnd<"1010", "b">, never, Test.Pass>(),

  Test.check<BitAnd<"01010101010111011", "11111111">, "10111011", Test.Pass>(),

  Test.check<BitShiftLeftBase2<"1010", 32, 2>, "101000", Test.Pass>(),
  Test.check<BitShiftRightBase2<"1110", 2>, "11", Test.Pass>(),

  Test.check<
    BitAnd<
      "100000100000000000000000000000000001010",
      "11111111111111111111111111111111"
    >,
    "1010",
    Test.Pass
  >(),
]);
