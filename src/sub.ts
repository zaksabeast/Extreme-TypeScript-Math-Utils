import { Test } from "ts-toolbelt";
import type { Digit } from "./digit";
import type { Pad0, RemovePad0, StringToNumber, ReverseString } from "./string";
import type { GreaterThanOrEq } from "./greaterThan";

type DigitSubMapWithoutBorrow = {
  "0": {
    "0": ["0", "0"];
    "1": ["9", "1"];
    "2": ["8", "1"];
    "3": ["7", "1"];
    "4": ["6", "1"];
    "5": ["5", "1"];
    "6": ["4", "1"];
    "7": ["3", "1"];
    "8": ["2", "1"];
    "9": ["1", "1"];
  };
  "1": {
    "0": ["1", "0"];
    "1": ["0", "0"];
    "2": ["9", "1"];
    "3": ["8", "1"];
    "4": ["7", "1"];
    "5": ["6", "1"];
    "6": ["5", "1"];
    "7": ["4", "1"];
    "8": ["3", "1"];
    "9": ["2", "1"];
  };
  "2": {
    "0": ["2", "0"];
    "1": ["1", "0"];
    "2": ["0", "0"];
    "3": ["9", "1"];
    "4": ["8", "1"];
    "5": ["7", "1"];
    "6": ["6", "1"];
    "7": ["5", "1"];
    "8": ["4", "1"];
    "9": ["3", "1"];
  };
  "3": {
    "0": ["3", "0"];
    "1": ["2", "0"];
    "2": ["1", "0"];
    "3": ["0", "0"];
    "4": ["9", "1"];
    "5": ["8", "1"];
    "6": ["7", "1"];
    "7": ["6", "1"];
    "8": ["5", "1"];
    "9": ["4", "1"];
  };
  "4": {
    "0": ["4", "0"];
    "1": ["3", "0"];
    "2": ["2", "0"];
    "3": ["1", "0"];
    "4": ["0", "0"];
    "5": ["9", "1"];
    "6": ["8", "1"];
    "7": ["7", "1"];
    "8": ["6", "1"];
    "9": ["5", "1"];
  };
  "5": {
    "0": ["5", "0"];
    "1": ["4", "0"];
    "2": ["3", "0"];
    "3": ["2", "0"];
    "4": ["1", "0"];
    "5": ["0", "0"];
    "6": ["9", "1"];
    "7": ["8", "1"];
    "8": ["7", "1"];
    "9": ["6", "1"];
  };
  "6": {
    "0": ["6", "0"];
    "1": ["5", "0"];
    "2": ["4", "0"];
    "3": ["3", "0"];
    "4": ["2", "0"];
    "5": ["1", "0"];
    "6": ["0", "0"];
    "7": ["9", "1"];
    "8": ["8", "1"];
    "9": ["7", "1"];
  };
  "7": {
    "0": ["7", "0"];
    "1": ["6", "0"];
    "2": ["5", "0"];
    "3": ["4", "0"];
    "4": ["3", "0"];
    "5": ["2", "0"];
    "6": ["1", "0"];
    "7": ["0", "0"];
    "8": ["9", "1"];
    "9": ["8", "1"];
  };
  "8": {
    "0": ["8", "0"];
    "1": ["7", "0"];
    "2": ["6", "0"];
    "3": ["5", "0"];
    "4": ["4", "0"];
    "5": ["3", "0"];
    "6": ["2", "0"];
    "7": ["1", "0"];
    "8": ["0", "0"];
    "9": ["9", "1"];
  };
  "9": {
    "0": ["9", "0"];
    "1": ["8", "0"];
    "2": ["7", "0"];
    "3": ["6", "0"];
    "4": ["5", "0"];
    "5": ["4", "0"];
    "6": ["3", "0"];
    "7": ["2", "0"];
    "8": ["1", "0"];
    "9": ["0", "0"];
  };
};

type DigitSubMapWithBorrow = {
  "0": {
    "0": ["9", "1"];
    "1": ["8", "1"];
    "2": ["7", "1"];
    "3": ["6", "1"];
    "4": ["5", "1"];
    "5": ["4", "1"];
    "6": ["3", "1"];
    "7": ["2", "1"];
    "8": ["1", "1"];
    "9": ["0", "1"];
  };
  "1": DigitSubMapWithoutBorrow["0"];
  "2": DigitSubMapWithoutBorrow["1"];
  "3": DigitSubMapWithoutBorrow["2"];
  "4": DigitSubMapWithoutBorrow["3"];
  "5": DigitSubMapWithoutBorrow["4"];
  "6": DigitSubMapWithoutBorrow["5"];
  "7": DigitSubMapWithoutBorrow["6"];
  "8": DigitSubMapWithoutBorrow["7"];
  "9": DigitSubMapWithoutBorrow["8"];
};

type SubDigitWithoutBorrow<
  A extends Digit,
  B extends Digit
> = DigitSubMapWithoutBorrow[A][B];

type SubDigitWithBorrow<
  A extends Digit,
  B extends Digit
> = DigitSubMapWithBorrow[A][B];

type SubDigit<
  A extends Digit,
  B extends Digit,
  Borrow extends "0" | "1" = "0"
> = Borrow extends "0" ? SubDigitWithoutBorrow<A, B> : SubDigitWithBorrow<A, B>;

// Assumptions:
// - The strings are the same length, padded with 0s
// - The strings are in reverse order
//
// What this means:
// - We don't have to worry about adding a number to an empty string
// - Empty checks only need to happen on one string
// - We can add from the leftmost digit to the rightmost digit (which works with TS inference)
type SubStrings<
  A extends string,
  B extends string,
  Borrow extends "0" | "1" = "0",
  Acc extends string = ""
> = A extends `${infer ADigit extends Digit}${infer A2}`
  ? B extends `${infer BDigit extends Digit}${infer B2}`
    ? A2 extends ""
      ? // End of the string, add final digits
        `${SubDigit<ADigit, BDigit, Borrow>[1]}${SubDigit<
          ADigit,
          BDigit,
          Borrow
        >[0]}${Acc}`
      : // More digits to add
        SubStrings<
          A2,
          B2,
          SubDigit<ADigit, BDigit, Borrow>[1],
          `${SubDigit<ADigit, BDigit, Borrow>[0]}${Acc}`
        >
    : never
  : never;

export type _Sub<A extends number, B extends number> = RemovePad0<
  SubStrings<ReverseString<Pad0<`${A}`, 16>>, ReverseString<Pad0<`${B}`, 16>>>
>;

export type Sub<A extends number, B extends number> = GreaterThanOrEq<
  A,
  B
> extends true
  ? StringToNumber<_Sub<A, B>>
  : StringToNumber<`-${_Sub<B, A>}`>;

Test.checks([
  Test.check<Sub<0, 0>, 0, Test.Pass>(),
  Test.check<Sub<321, 123>, 198, Test.Pass>(),
  Test.check<Sub<12, 22>, -10, Test.Pass>(),
]);
