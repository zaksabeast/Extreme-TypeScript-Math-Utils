import { Test } from "ts-toolbelt";
import type { Pad0, RemovePad0 } from "./string";

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
  _BitOr<Pad0<A, 32>, Pad0<B, 32>>
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
  _BitAnd<Pad0<A, 32>, Pad0<B, 32>>
>;

Test.checks([
  Test.check<BitOr<"1010", "1100">, "1110", Test.Pass>(),
  Test.check<BitOr<"a", "1100">, never, Test.Pass>(),
  Test.check<BitOr<"1010", "b">, never, Test.Pass>(),

  Test.check<BitAnd<"1010", "1100">, "1000", Test.Pass>(),
  Test.check<BitAnd<"a", "1100">, never, Test.Pass>(),
  Test.check<BitAnd<"1010", "b">, never, Test.Pass>(),

  Test.check<BitAnd<"01010101010111011", "11111111">, "10111011", Test.Pass>(),
]);
