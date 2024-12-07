import { Test } from "ts-toolbelt";
import type { Digit } from "./digit";
import type { Pad0 } from "./string";

type GreaterThanMap = [
  [false, false, false, false, false, false, false, false, false, false],
  [true, false, false, false, false, false, false, false, false, false],
  [true, true, false, false, false, false, false, false, false, false],
  [true, true, true, false, false, false, false, false, false, false],
  [true, true, true, true, false, false, false, false, false, false],
  [true, true, true, true, true, false, false, false, false, false],
  [true, true, true, true, true, true, false, false, false, false],
  [true, true, true, true, true, true, true, false, false, false],
  [true, true, true, true, true, true, true, true, false, false],
  [true, true, true, true, true, true, true, true, true, false]
];

type _GreaterThan<
  A extends string,
  B extends string,
  OrEqual extends boolean
> = A extends `${infer ADigit extends Digit}${infer ARest}`
  ? B extends `${infer BDigit extends Digit}${infer BRest}`
    ? ADigit extends BDigit
      ? ARest extends ""
        ? OrEqual
        : _GreaterThan<ARest, BRest, OrEqual>
      : GreaterThanMap[ADigit][BDigit]
    : never
  : never;

type __GreaterThan<
  A extends number | string,
  B extends number | string,
  OrEqual extends boolean
> = _GreaterThan<Pad0<`${A}`, 16>, Pad0<`${B}`, 16>, OrEqual>;

export type GreaterThan<
  A extends number | string,
  B extends number | string
> = __GreaterThan<A, B, false>;

export type GreaterThanOrEq<
  A extends number | string,
  B extends number | string
> = __GreaterThan<A, B, true>;

Test.checks([
  Test.check<GreaterThan<0, 0>, false, Test.Pass>(),
  Test.check<GreaterThan<123, 321>, false, Test.Pass>(),
  Test.check<GreaterThan<321, 123>, true, Test.Pass>(),

  Test.check<GreaterThan<"0", "0">, false, Test.Pass>(),
  Test.check<GreaterThan<"123", "321">, false, Test.Pass>(),
  Test.check<GreaterThan<"321", "123">, true, Test.Pass>(),

  Test.check<GreaterThanOrEq<0, 0>, true, Test.Pass>(),
  Test.check<GreaterThanOrEq<1, 12>, false, Test.Pass>(),
  Test.check<GreaterThanOrEq<1, 9>, false, Test.Pass>(),
  Test.check<GreaterThanOrEq<123, 321>, false, Test.Pass>(),
  Test.check<GreaterThanOrEq<321, 123>, true, Test.Pass>(),

  Test.check<GreaterThanOrEq<"0", "0">, true, Test.Pass>(),
  Test.check<GreaterThanOrEq<"123", "321">, false, Test.Pass>(),
  Test.check<GreaterThanOrEq<"321", "123">, true, Test.Pass>(),
]);
