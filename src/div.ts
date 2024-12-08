import { Test } from "ts-toolbelt";

import type { MultU32 } from "./mult";
import type { Sub } from "./sub";
import type { Add } from "./add";
import type { BitShiftRight, BitShiftLeft } from "./bin";
import type { GreaterThanOrEq, GreaterThan } from "./greaterThan";

type OddDivGuard<
  Dividend extends number,
  Quotient extends number
> = GreaterThan<Quotient, Dividend> extends true ? never : Quotient;
type OddDiv<Dividend extends number, Reciprocal extends number> = OddDivGuard<
  Dividend,
  MultU32<Dividend, Reciprocal>
>;

type EvenDivGuard<
  Dividend extends number,
  Shift extends number,
  Quotient extends number
> = BitShiftLeft<Quotient, 32, Shift> extends Dividend ? Quotient : never;

type EvenDiv<Dividend extends number, Shift extends number> = EvenDivGuard<
  Dividend,
  Shift,
  BitShiftRight<Dividend, Shift>
>;

type DivU32By2<Num extends number> = EvenDiv<Num, 1>;
type DivU32By3<Num extends number> = OddDiv<Num, 0xaaaaaaab>;
type DivU32By4<Num extends number> = EvenDiv<Num, 2>;
type DivU32By5<Num extends number> = OddDiv<Num, 0xcccccccd>;
type DivU32By6<Num extends number> = DivU32By2<DivU32By3<Num>>;
type DivU32By7<Num extends number> = OddDiv<Num, 0xb6db6db7>;
type DivU32By8<Num extends number> = EvenDiv<Num, 3>;
type DivU32By9<Num extends number> = OddDiv<Num, 0x38e38e39>;

type DivU32SingleDigit<
  Num extends number,
  Divisor extends number
> = Divisor extends 0
  ? never
  : Divisor extends 1
  ? Num
  : Divisor extends 2
  ? DivU32By2<Num>
  : Divisor extends 3
  ? DivU32By3<Num>
  : Divisor extends 4
  ? DivU32By4<Num>
  : Divisor extends 5
  ? DivU32By5<Num>
  : Divisor extends 6
  ? DivU32By6<Num>
  : Divisor extends 7
  ? DivU32By7<Num>
  : Divisor extends 8
  ? DivU32By8<Num>
  : Divisor extends 9
  ? DivU32By9<Num>
  : never;

type IsValidDivisor<
  Dividend extends number,
  Divisor extends number
> = Divisor extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ? DivU32SingleDigit<Dividend, Divisor> extends never
    ? false
    : true
  : false;

type IsCommonDivisor<
  A extends number,
  B extends number,
  Divisor extends number
> = IsValidDivisor<A, Divisor> extends true
  ? IsValidDivisor<B, Divisor>
  : false;

// This is prone to stack issues.
// Only use with small numbers.
type SubDiv<Dividend extends number, Divisor extends number> = GreaterThanOrEq<
  Dividend,
  Divisor
> extends true
  ? Add<1, SubDiv<Sub<Dividend, Divisor>, Divisor>>
  : 0;

Test.checks([
  Test.check<DivU32SingleDigit<10, 0>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<10, 1>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<20, 2>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<30, 3>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<40, 4>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<50, 5>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<60, 6>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<70, 7>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<80, 8>, 10, Test.Pass>(),
  Test.check<DivU32SingleDigit<90, 9>, 10, Test.Pass>(),

  Test.check<DivU32SingleDigit<0xfffffff0, 0x2>, 0x7ffffff8, Test.Pass>(),

  Test.check<DivU32SingleDigit<10, 0>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<21, 2>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<31, 3>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<41, 4>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<51, 5>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<61, 6>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<71, 7>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<81, 8>, never, Test.Pass>(),
  Test.check<DivU32SingleDigit<91, 9>, never, Test.Pass>(),

  Test.check<IsCommonDivisor<9, 6, 3>, true, Test.Pass>(),
  Test.check<IsCommonDivisor<9, 6, 2>, false, Test.Pass>(),

  Test.check<SubDiv<10, 2>, 5, Test.Pass>(),
]);
