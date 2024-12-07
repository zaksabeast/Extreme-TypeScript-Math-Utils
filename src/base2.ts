import { Test } from "ts-toolbelt";
import type { Add } from "./add";
import type { Sub } from "./sub";
import type { GreaterThanOrEq } from "./greaterThan";
import type { BitOr } from "./bit";
import type { ReverseString, SplitStringIntoChars } from "./string";

type PowerList = [
  1,
  2,
  4,
  8,
  16,
  32,
  64,
  128,
  256,
  512,
  1024,
  2048,
  4096,
  8192,
  16384,
  32768,
  65536,
  131072,
  262144,
  524288,
  1048576,
  2097152,
  4194304,
  8388608,
  16777216,
  33554432,
  67108864,
  134217728,
  268435456,
  536870912,
  1073741824,
  2147483648,
  4294967296
];

type ExponentToBase2 = [
  "00000000000000000000000000000001",
  "00000000000000000000000000000010",
  "00000000000000000000000000000100",
  "00000000000000000000000000001000",
  "00000000000000000000000000010000",
  "00000000000000000000000000100000",
  "00000000000000000000000001000000",
  "00000000000000000000000010000000",
  "00000000000000000000000100000000",
  "00000000000000000000001000000000",
  "00000000000000000000010000000000",
  "00000000000000000000100000000000",
  "00000000000000000001000000000000",
  "00000000000000000010000000000000",
  "00000000000000000100000000000000",
  "00000000000000001000000000000000",
  "00000000000000010000000000000000",
  "00000000000000100000000000000000",
  "00000000000001000000000000000000",
  "00000000000010000000000000000000",
  "00000000000100000000000000000000",
  "00000000001000000000000000000000",
  "00000000010000000000000000000000",
  "00000000100000000000000000000000",
  "00000001000000000000000000000000",
  "00000010000000000000000000000000",
  "00000100000000000000000000000000",
  "00001000000000000000000000000000",
  "00010000000000000000000000000000",
  "00100000000000000000000000000000",
  "01000000000000000000000000000000",
  "10000000000000000000000000000000"
];

type HighestPowerOf2<
  N extends number,
  Index extends number = 0
> = Index extends 32
  ? 31
  : GreaterThanOrEq<PowerList[Index], N> extends true
  ? PowerList[Index] extends N
    ? Index
    : Sub<Index, 1>
  : HighestPowerOf2<N, Add<Index, 1>>;

export type Base10To2<
  Num extends number,
  Acc extends string = "00000000000000000000000000000000"
> = Num extends 0
  ? Acc
  : Base10To2<
      Sub<Num, PowerList[HighestPowerOf2<Num>]>,
      BitOr<Acc, ExponentToBase2[HighestPowerOf2<Num>]>
    >;

type _Base2To10<
  Base2 extends string[],
  Index extends number = 0,
  Acc extends number = 0
> = Base2[Index] extends undefined
  ? Acc
  : Base2[Index] extends "1"
  ? _Base2To10<Base2, Add<Index, 1>, Add<Acc, PowerList[Index]>>
  : _Base2To10<Base2, Add<Index, 1>, Acc>;

export type Base2To10<Base2 extends string> = _Base2To10<
  SplitStringIntoChars<ReverseString<Base2>>
>;

Test.checks([
  Test.check<Base10To2<12>, "1100", Test.Pass>(),
  Test.check<Base10To2<31>, "11111", Test.Pass>(),
  Test.check<Base10To2<5>, "101", Test.Pass>(),
  Test.check<Base10To2<0xaabb>, "1010101010111011", Test.Pass>(),
  Test.check<
    Base10To2<0xffffffff>,
    "11111111111111111111111111111111",
    Test.Pass
  >(),

  Test.check<Base2To10<"1100">, 12, Test.Pass>(),
  Test.check<Base2To10<"11111">, 31, Test.Pass>(),
  Test.check<Base2To10<"101">, 5, Test.Pass>(),
  Test.check<
    Base2To10<"11111111111111111111111111111111">,
    0xffffffff,
    Test.Pass
  >(),
]);
