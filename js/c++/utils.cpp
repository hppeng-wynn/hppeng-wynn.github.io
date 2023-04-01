#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

#include "utils.h"
#include <algorithm>

/**
 * Clamp number between low and high values.
 *
 * @param num: value to clamp
 * @param low
 * @param high
 *
 * @return clamped value
 */
float clamp(float num, float low, float high) {
    return std::min(std::max(num, low), high);
}

// Permutations in js reference (also cool algorithm):
// https://stackoverflow.com/a/41068709
//function perm(a){
//    if (a.length == 0) return [[]];
//    var r = [[a[0]]],
//        t = [],
//        s = [];
//    if (a.length == 1) return r;
//    for (var i = 1, la = a.length; i < la; i++){
//        for (var j = 0, lr = r.length; j < lr; j++){
//            r[j].push(a[i]);
//            t.push(r[j]);
//            for(var k = 1, lrj = r[j].length; k < lrj; k++){
//                for (var l = 0; l < lrj; l++) s[l] = r[j][(k+l)%lrj];
//                t[t.length] = s;
//                s = [];
//            }
//        }
//        r = t;
//        t = [];
//    }
//    return r;
//}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(utils) {
    function("clamp", &clamp);
}
#endif
