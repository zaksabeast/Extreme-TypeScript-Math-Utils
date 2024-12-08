import { Test } from "ts-toolbelt";
import type {
  BitAnd,
  BitOr,
  BitShiftLeftBase2,
  BitShiftRightBase2,
} from "./bit";
import type { Base10To2, Base2To10 } from "./base2";

export type BinAnd<A extends number, B extends number> = Base2To10<
  BitAnd<Base10To2<A>, Base10To2<B>>
>;

export type BinOr<A extends number, B extends number> = Base2To10<
  BitOr<Base10To2<A>, Base10To2<B>>
>;

export type BitShiftLeft<
  Num extends number,
  BitLength extends number,
  Shift extends number
> = Base2To10<BitShiftLeftBase2<Base10To2<Num>, BitLength, Shift>>;

export type BitShiftRight<Num extends number, Shift extends number> = Base2To10<
  BitShiftRightBase2<Base10To2<Num>, Shift>
>;

Test.checks([
  Test.check<BinOr<10, 12>, 14, Test.Pass>(),
  Test.check<BinAnd<10, 12>, 8, Test.Pass>(),
  Test.check<BinAnd<0xaabb, 0xff>, 0xbb, Test.Pass>(),
]);
