import { Test } from "ts-toolbelt";
import type { BitAnd, BitOr } from "./bit";
import type { Base10To2, Base2To10 } from "./base2";

export type BinAnd<A extends number, B extends number> = Base2To10<
  BitAnd<Base10To2<A>, Base10To2<B>>
>;

export type BinOr<A extends number, B extends number> = Base2To10<
  BitOr<Base10To2<A>, Base10To2<B>>
>;

Test.checks([
  Test.check<BinOr<10, 12>, 14, Test.Pass>(),
  Test.check<BinAnd<10, 12>, 8, Test.Pass>(),
  Test.check<BinAnd<0xaabb, 0xff>, 0xbb, Test.Pass>(),
]);
