import { Test } from "ts-toolbelt";
import type { Sub } from "./sub";
import type { BinAnd } from "./bin";

type IsNegative<N extends number> = `${N}` extends `-${infer _}` ? true : false;
type Absolute<N extends number> =
  `${N}` extends `-${infer Digits extends number}` ? Digits : N;

export type ToU32<N extends number> = IsNegative<N> extends true
  ? Sub<0x100000000, Absolute<N>>
  : BinAnd<N, 0xffffffff>;

export type ToU16<N extends number> = BinAnd<ToU32<N>, 0xffff>;
export type ToU8<N extends number> = BinAnd<ToU32<N>, 0xff>;

Test.checks([
  Test.check<IsNegative<1>, false, Test.Pass>(),
  Test.check<IsNegative<-1>, true, Test.Pass>(),

  Test.check<Absolute<1>, 1, Test.Pass>(),
  Test.check<Absolute<-1>, 1, Test.Pass>(),

  Test.check<ToU32<0xaabbccdd>, 0xaabbccdd, Test.Pass>(),
  Test.check<ToU32<-0xaabbccdd>, 0x55443323, Test.Pass>(),

  Test.check<ToU16<0xaabbccdd>, 0xccdd, Test.Pass>(),
  Test.check<ToU16<-0xaabbccdd>, 0x3323, Test.Pass>(),

  Test.check<ToU8<0xaabbccdd>, 0xdd, Test.Pass>(),
  Test.check<ToU8<-0xaabbccdd>, 0x23, Test.Pass>(),
]);
