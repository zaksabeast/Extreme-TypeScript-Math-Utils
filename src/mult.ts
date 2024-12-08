import { Test } from "ts-toolbelt";
import type { Digit } from "./digit";
import type { SplitStringIntoChars, Repeat, StringToNumber } from "./string";
import type { Add, SumStrings } from "./add";
import type { BinAnd } from "./bin";

type ProductMap = {
  "0": {
    "0": "0";
    "1": "0";
    "2": "0";
    "3": "0";
    "4": "0";
    "5": "0";
    "6": "0";
    "7": "0";
    "8": "0";
    "9": "0";
  };
  "1": {
    "0": "0";
    "1": "1";
    "2": "2";
    "3": "3";
    "4": "4";
    "5": "5";
    "6": "6";
    "7": "7";
    "8": "8";
    "9": "9";
  };
  "2": {
    "0": "0";
    "1": "2";
    "2": "4";
    "3": "6";
    "4": "8";
    "5": "10";
    "6": "12";
    "7": "14";
    "8": "16";
    "9": "18";
  };
  "3": {
    "0": "0";
    "1": "3";
    "2": "6";
    "3": "9";
    "4": "12";
    "5": "15";
    "6": "18";
    "7": "21";
    "8": "24";
    "9": "27";
  };
  "4": {
    "0": "0";
    "1": "4";
    "2": "8";
    "3": "12";
    "4": "16";
    "5": "20";
    "6": "24";
    "7": "28";
    "8": "32";
    "9": "36";
  };
  "5": {
    "0": "0";
    "1": "5";
    "2": "10";
    "3": "15";
    "4": "20";
    "5": "25";
    "6": "30";
    "7": "35";
    "8": "40";
    "9": "45";
  };
  "6": {
    "0": "0";
    "1": "6";
    "2": "12";
    "3": "18";
    "4": "24";
    "5": "30";
    "6": "36";
    "7": "42";
    "8": "48";
    "9": "54";
  };
  "7": {
    "0": "0";
    "1": "7";
    "2": "14";
    "3": "21";
    "4": "28";
    "5": "35";
    "6": "42";
    "7": "49";
    "8": "56";
    "9": "63";
  };
  "8": {
    "0": "0";
    "1": "8";
    "2": "16";
    "3": "24";
    "4": "32";
    "5": "40";
    "6": "48";
    "7": "56";
    "8": "64";
    "9": "72";
  };
  "9": {
    "0": "0";
    "1": "9";
    "2": "18";
    "3": "27";
    "4": "36";
    "5": "45";
    "6": "54";
    "7": "63";
    "8": "72";
    "9": "81";
  };
};

type SimpleMult<A extends Digit, B extends Digit> = ProductMap[A][B];

type MultList<
  A extends Digit,
  B extends Digit[],
  Acc extends string[] = []
> = B extends [infer BDigit extends Digit, ...infer B2 extends Digit[]]
  ? MultList<A, B2, [SimpleMult<A, BDigit>, ...Acc]>
  : Acc;

type BuildMatrix<
  A extends string,
  B extends string,
  Acc extends string[][] = []
> = A extends `${infer ADigit extends Digit}${infer Rest}`
  ? BuildMatrix<Rest, B, [MultList<ADigit, SplitStringIntoChars<B>>, ...Acc]>
  : Acc;

type AppendLimit =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

type Append0sToList<
  List extends string[],
  Index extends number = 0
> = List extends [infer Head extends string, ...infer Tail extends string[]]
  ? Index extends AppendLimit
    ? [`${Head}${Repeat<"0", Index>}`, ...Append0sToList<Tail, Add<Index, 1>>]
    : []
  : [];

type FlattenMatrix<M extends string[][], Index extends number = 0> = M extends [
  infer Row extends string[],
  ...infer Rows extends string[][]
]
  ? [...Append0sToList<Row, Index>, ...FlattenMatrix<Rows, Add<Index, 1>>]
  : [];

export type MultStrings<A extends string, B extends string> = SumStrings<
  FlattenMatrix<BuildMatrix<A, B>>
>;

export type Mult<A extends number, B extends number> = StringToNumber<
  MultStrings<`${A}`, `${B}`>
>;

export type MultU32<A extends number, B extends number> = BinAnd<
  Mult<A, B>,
  0xffffffff
>;

Test.checks([
  Test.check<Append0sToList<["1", "2", "3"]>, ["1", "20", "300"], Test.Pass>(),
  Test.check<
    BuildMatrix<"123", "456">,
    [["18", "15", "12"], ["12", "10", "8"], ["6", "5", "4"]],
    Test.Pass
  >(),
  Test.check<
    FlattenMatrix<[["18", "15", "12"], ["12", "10", "8"], ["6", "5", "4"]]>,
    ["18", "150", "1200", "120", "1000", "8000", "600", "5000", "40000"],
    Test.Pass
  >(),
  Test.check<MultStrings<"123", "456">, "56088", Test.Pass>(),

  Test.check<Mult<123, 456>, 56088, Test.Pass>(),
  Test.check<Mult<123, 0>, 0, Test.Pass>(),
  Test.check<Mult<0xabc, 0xdef>, 0x959184, Test.Pass>(),
  Test.check<Mult<0xfffff, 0xfffff>, 0xffffe00001, Test.Pass>(),

  Test.check<MultU32<90, 0xb8e38e39>, 10, Test.Pass>(),
]);
