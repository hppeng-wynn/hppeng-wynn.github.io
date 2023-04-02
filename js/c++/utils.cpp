#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

#include "utils.h"
#include "utils/math_utils.h"
#include "utils/base64.h"
#include <algorithm>
#include <vector>

namespace utils {

// Permutations in js reference (also cool algorithm):
// Uses Heap's method: https://stackoverflow.com/a/37580979
//      https://en.wikipedia.org/wiki/Heap%27s_algorithm
// Note: different from old wynnbuilder permutation generator (https://stackoverflow.com/a/41068709)
template<typename T>
std::vector<std::vector<T>> perm(std::vector<T> a) {
    std::vector<std::vector<T>> result;
    result.push_back(a);    // copy assignment
    int l = a.size();   // haha signed int
    std::vector<int> c(l, 0);
    int i = 1;
    while (i < l) {
        if (c[i] < i) {
            if (i % 2) {
                // odd.
                std::iter_swap(a.begin()+c[i], a.begin()+i);
            }
            else {
                // even.
                std::iter_swap(a.begin(), a.begin()+i);
            }
            result.push_back(a);
            c[i] += 1;
            i = 1;
        }
        else {
            c[i] = 0;
            i++;
        }
    }
    return result;
}
#ifdef __EMSCRIPTEN__
val __perm_wrap(val a) {
    const size_t l = a["length"].as<size_t>();
    std::vector<val> things;
    for (size_t i = 0; i < l; ++i) {
        things.push_back(a[i]);
    }
    std::vector<std::vector<val>> res = perm(things);
    val return_array = val::array();
    for (auto it = res.begin(); it != res.end(); ++it) {
        auto& subarray = *it;
        val return_subarray = val::array();
        for (auto it2 = subarray.begin(); it2 != subarray.end(); ++it2) {
            return_subarray.call<void>("push", *it2);
        }
        return_array.call<void>("push", return_subarray);
    }
    return return_array;
}
#endif


#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(utils) {
    function("clamp", &clamp);
    function("round_near", &round_near);
    function("b64_fromIntV", &Base64::fromIntV);
    function("b64_fromIntN", &Base64::fromIntN);
    function("b64_toInt", &Base64::toInt);
    function("b64_toIntSigned", &Base64::toIntSigned);
    function("perm", &__perm_wrap);
}
#endif

} // namespace utils
