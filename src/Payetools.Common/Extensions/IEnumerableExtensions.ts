// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Extension methods for instances of `Iterable<T>`.
 */
export class IterableExtensions {
  /**
   * Provides a new Iterable of tuples, where the first element of the tuple is the original item and the second
   * element is the numeric index of the item, zero-based.
   *
   * @template T - Type of item in original Iterable.
   * @param {Iterable<T>} source - Source Iterable.
   * @returns {Iterable<[T, number]>} - New Iterable of tuples as described above.
   */
  public static withIndex<T>(
    source: Iterable<T>,
  ): Iterable<{ value: T; index: number }> {
    return Array.from(source).map((value, index) => ({ value, index }));
  }
}
