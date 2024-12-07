# Extreme TypeScript Math Utils (Type-Level)

A set of math utilities for the TypeScript type system, inspired by [ts-toolbelt](https://github.com/millsp/ts-toolbelt)'s math utilities. Unlike a traditional math library, this operates purely within the **TypeScript type system** and is not intended for runtime use.

## Features

- Performs type-level math without relying on lookup tables.
- Handles 32-bit integer operations entirely in the type system.
- Breaks past the `-100` to `100` range limitation seen in `ts-toolbelt`.

## Background

`ts-toolbelt` implements math operations using a lookup table to support incrementing and decrementing in the type system, with a limited range of `-100` to `100`. This library explores an alternative approach to handle 32-bit math without a lookup table, aiming to expand the range while maintaining reasonable performance.

## Examples

```ts
Test.check<Add<123, 321>, 444, Test.Pass>();
Test.check<Add<0xffff0000, 0xffff>, 0xffffffff, Test.Pass>();

Test.check<Sub<321, 123>, 198, Test.Pass>();
Test.check<Sub<12, 22>, -10, Test.Pass>();

Test.check<Mult<123, 456>, 56088, Test.Pass>();
Test.check<Mult<0xfffff, 0xfffff>, 0xffffe00001, Test.Pass>(;
```

## Limitations

- **Toy Project**: This is an experimental library and is not suitable for production use.
- **Known Bugs**: There are existing issues and edge cases that may not be handled.

## Disclaimer

This library was created as an experiment in pushing the boundaries of TypeScript's type system. Use it at your own risk!
