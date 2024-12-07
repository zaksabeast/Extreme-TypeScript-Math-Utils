# Extreme TypeScript Math Utils (Type-Level)

A set of math utilities for the TypeScript type system, inspired by [ts-toolbelt](https://github.com/millsp/ts-toolbelt)'s math utilities. Unlike a traditional math library, this operates purely within the **TypeScript type system** and is not intended for runtime use.

## Features

- Performs type-level math without relying on lookup tables.
- Handles 32-bit integer operations entirely in the type system.
- Breaks past the `-100` to `100` range limitation seen in `ts-toolbelt`.

## Background

`ts-toolbelt` implements math operations using a lookup table to support incrementing and decrementing in the type system, with a limited range of `-100` to `100`. This library explores an alternative approach to handle 32-bit math without a lookup table, aiming to expand the range while maintaining reasonable performance.

## Limitations

- **Toy Project**: This is an experimental library and is not suitable for production use.
- **Known Bugs**: There are existing issues and edge cases that may not be handled.

## Disclaimer

This library was created as an experiment in pushing the boundaries of TypeScript's type system. Use it at your own risk!
