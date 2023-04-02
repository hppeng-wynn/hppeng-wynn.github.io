#include "math_utils.h"
#include <algorithm>
#include <cmath>

/**
 * Clamp number between low and high values.
 *
 * @param num: value to clamp
 * @param low
 * @param high
 *
 * @return clamped value
 */
double clamp(double num, double low, double high) {
    return std::min(std::max(num, low), high);
}

/**
 * Round a value to an integer if it is veeeery close to one.
 * (epsilon=0.00000001)
 *
 * @param value : value to round
 *
 * @return the same value, or rounded to an integer if it is close to one.
 */
double round_near(double value) {
    const double eps = 0.00000001;
    const double rounded = std::round(value);
    if (std::abs(value - rounded) < eps) {
        return rounded;
    }
    return value;
}

/**
 * Compute log_b(n).
 */
double log(double b, double n) {
    return std::log(n) / std::log(b);
}
