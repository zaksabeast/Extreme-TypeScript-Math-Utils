import { Test } from "ts-toolbelt";
import type { Digit } from "./digit";
import type { Pad0, RemovePad0, StringToNumber, ReverseString } from "./string";

type DigitSumMapWithoutCarry = {
  "0": {
    "0": ["0", "0"];
    "1": ["1", "0"];
    "2": ["2", "0"];
    "3": ["3", "0"];
    "4": ["4", "0"];
    "5": ["5", "0"];
    "6": ["6", "0"];
    "7": ["7", "0"];
    "8": ["8", "0"];
    "9": ["9", "0"];
  };
  "1": {
    "0": ["1", "0"];
    "1": ["2", "0"];
    "2": ["3", "0"];
    "3": ["4", "0"];
    "4": ["5", "0"];
    "5": ["6", "0"];
    "6": ["7", "0"];
    "7": ["8", "0"];
    "8": ["9", "0"];
    "9": ["0", "1"];
  };
  "2": {
    "0": ["2", "0"];
    "1": ["3", "0"];
    "2": ["4", "0"];
    "3": ["5", "0"];
    "4": ["6", "0"];
    "5": ["7", "0"];
    "6": ["8", "0"];
    "7": ["9", "0"];
    "8": ["0", "1"];
    "9": ["1", "1"];
  };
  "3": {
    "0": ["3", "0"];
    "1": ["4", "0"];
    "2": ["5", "0"];
    "3": ["6", "0"];
    "4": ["7", "0"];
    "5": ["8", "0"];
    "6": ["9", "0"];
    "7": ["0", "1"];
    "8": ["1", "1"];
    "9": ["2", "1"];
  };
  "4": {
    "0": ["4", "0"];
    "1": ["5", "0"];
    "2": ["6", "0"];
    "3": ["7", "0"];
    "4": ["8", "0"];
    "5": ["9", "0"];
    "6": ["0", "1"];
    "7": ["1", "1"];
    "8": ["2", "1"];
    "9": ["3", "1"];
  };
  "5": {
    "0": ["5", "0"];
    "1": ["6", "0"];
    "2": ["7", "0"];
    "3": ["8", "0"];
    "4": ["9", "0"];
    "5": ["0", "1"];
    "6": ["1", "1"];
    "7": ["2", "1"];
    "8": ["3", "1"];
    "9": ["4", "1"];
  };
  "6": {
    "0": ["6", "0"];
    "1": ["7", "0"];
    "2": ["8", "0"];
    "3": ["9", "0"];
    "4": ["0", "1"];
    "5": ["1", "1"];
    "6": ["2", "1"];
    "7": ["3", "1"];
    "8": ["4", "1"];
    "9": ["5", "1"];
  };
  "7": {
    "0": ["7", "0"];
    "1": ["8", "0"];
    "2": ["9", "0"];
    "3": ["0", "1"];
    "4": ["1", "1"];
    "5": ["2", "1"];
    "6": ["3", "1"];
    "7": ["4", "1"];
    "8": ["5", "1"];
    "9": ["6", "1"];
  };
  "8": {
    "0": ["8", "0"];
    "1": ["9", "0"];
    "2": ["0", "1"];
    "3": ["1", "1"];
    "4": ["2", "1"];
    "5": ["3", "1"];
    "6": ["4", "1"];
    "7": ["5", "1"];
    "8": ["6", "1"];
    "9": ["7", "1"];
  };
  "9": {
    "0": ["9", "0"];
    "1": ["0", "1"];
    "2": ["1", "1"];
    "3": ["2", "1"];
    "4": ["3", "1"];
    "5": ["4", "1"];
    "6": ["5", "1"];
    "7": ["6", "1"];
    "8": ["7", "1"];
    "9": ["8", "1"];
  };
};

type DigitSumMapWithCarry = {
  "0": DigitSumMapWithoutCarry["1"];
  "1": DigitSumMapWithoutCarry["2"];
  "2": DigitSumMapWithoutCarry["3"];
  "3": DigitSumMapWithoutCarry["4"];
  "4": DigitSumMapWithoutCarry["5"];
  "5": DigitSumMapWithoutCarry["6"];
  "6": DigitSumMapWithoutCarry["7"];
  "7": DigitSumMapWithoutCarry["8"];
  "8": DigitSumMapWithoutCarry["9"];
  "9": {
    "0": ["0", "1"];
    "1": ["1", "1"];
    "2": ["2", "1"];
    "3": ["3", "1"];
    "4": ["4", "1"];
    "5": ["5", "1"];
    "6": ["6", "1"];
    "7": ["7", "1"];
    "8": ["8", "1"];
    "9": ["9", "1"];
  };
};

type AddDigitWithoutCarry<
  A extends Digit,
  B extends Digit
> = DigitSumMapWithoutCarry[A][B];

type AddDigitWithCarry<
  A extends Digit,
  B extends Digit
> = DigitSumMapWithCarry[A][B];

type AddDigit<
  A extends Digit,
  B extends Digit,
  Carry extends "0" | "1" = "0"
> = Carry extends "0" ? AddDigitWithoutCarry<A, B> : AddDigitWithCarry<A, B>;

// Assumptions:
// - The strings are the same length, padded with 0s
// - The strings are in reverse order
//
// What this means:
// - We don't have to worry about adding a number to an empty string
// - Empty checks only need to happen on one string
// - We can add from the leftmost digit to the rightmost digit (which works with TS inference)
type _AddStrings<
  A extends string,
  B extends string,
  Carry extends "0" | "1" = "0",
  Acc extends string = ""
> = A extends `${infer ADigit extends Digit}${infer A2}`
  ? B extends `${infer BDigit extends Digit}${infer B2}`
    ? A2 extends ""
      ? // End of the string, add final digits
        `${AddDigit<ADigit, BDigit, Carry>[1]}${AddDigit<
          ADigit,
          BDigit,
          Carry
        >[0]}${Acc}`
      : // More digits to add
        _AddStrings<
          A2,
          B2,
          AddDigit<ADigit, BDigit, Carry>[1],
          `${AddDigit<ADigit, BDigit, Carry>[0]}${Acc}`
        >
    : never
  : never;

export type AddStrings<A extends string, B extends string> = RemovePad0<
  _AddStrings<ReverseString<Pad0<A, 16>>, ReverseString<Pad0<B, 16>>>
>;

export type Add<A extends number, B extends number> = StringToNumber<
  AddStrings<`${A}`, `${B}`>
>;

export type SumStrings<
  Nums extends string[],
  Acc extends string = "0"
> = Nums extends [infer Num extends string, ...infer Rest extends string[]]
  ? SumStrings<Rest, AddStrings<Acc, Num>>
  : Acc;

Test.checks([
  Test.check<Add<0, 0>, 0, Test.Pass>(),
  Test.check<Add<123, 321>, 444, Test.Pass>(),
  Test.check<Add<0xffff0000, 0xffff>, 0xffffffff, Test.Pass>(),
  Test.check<Add<0xffffffffffff, 0xffffffffffff>, 0x1fffffffffffe, Test.Pass>(),
  Test.check<Add<9007199254740990, 1>, 9007199254740991, Test.Pass>(),

  Test.check<AddStrings<"0", "0">, "0", Test.Pass>(),
  Test.check<AddStrings<"123", "321">, "444", Test.Pass>(),
  Test.check<
    AddStrings<"9007199254740990", "1">,
    "9007199254740991",
    Test.Pass
  >(),

  Test.check<SumStrings<["1", "4", "10"]>, "15", Test.Pass>(),
]);
