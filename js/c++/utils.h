#pragma once

/**
 * Generate all permutations of a vector.
 *
 * @param a:    vector containing the elements to permute.
 *
 * @return a vector with all permutations of `a`.
 */
template<typename T>
std::vector<std::vector<T>> perm(std::vector<T> a);
