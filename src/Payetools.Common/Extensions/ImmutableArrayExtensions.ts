// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Extension methods for ImmutableArray<T>.
 */
export class ImmutableArrayExtensions {
  /**
   * Replaces the last item in the array returning a new immutable array.
   *
   * @param array - List to be updated.
   * @param index - Index of items to be replaced.
   * @param newValue - New value to inserted in place of the current last value.
   * @typeparam T - Type of object that the list contains.
   * @returns A new ImmutableArray<T> with the last item in the array updated.
   */
  static replaceAt<T>(array: T[], index: number, newValue: T): T[] {
    array[index] = newValue;
    return array;
  }
}
