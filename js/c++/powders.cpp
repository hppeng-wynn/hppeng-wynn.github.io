#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

#include "powders.h"
#include "definitions.h"

#include <cstring>

const std::map<std::string, int> powder_IDs = []{
    std::map<std::string, int> m;
    int powder_id = 0;
    for (const auto& x : skp_elements) {
        for (int i = 1; i <= 6; ++i) {
            m[x + std::to_string(i)] = powder_id;
            m[(char)toupper(x[0]) + std::to_string(i)] = powder_id;
            powder_id++;
        }
    }
    return m;
}();

const std::map<int, std::string> powder_names = []{
    std::map<int, std::string> m;
    for (const auto& kv : powder_IDs) {
        m[kv.second] = kv.first;
    }
    return m;
}();

Powder::Powder() {}
Powder::Powder(int min, int max, int conv, int defPlus, int defMinus) :
        min(min), max(max), convert(conv), defPlus(defPlus), defMinus(defMinus) {}

const std::vector<Powder> powder_stats = []{
    auto p = [](int a, int b, int c, int d, int e){ return Powder(a,b,c,d,e); };
    return std::vector<Powder> {
        p(3,6,17,2,1), p(5,8,21,4,2), p(6,10,25,8,3), p(7,10,31,14,5), p(9,11,38,22,9), p(11,13,46,30,13),
        p(1,8,9,3,1), p(1,12,11,5,1), p(2,15,13,9,2), p(3,15,17,14,4), p(4,17,22,20,7), p(5,20,28,28,10),
        p(3,4,13,3,1), p(4,6,15,6,1), p(5,8,17,11,2), p(6,8,21,18,4), p(7,10,26,28,7), p(9,11,32,40,10),
        p(2,5,14,3,1), p(4,8,16,5,2), p(5,9,19,9,3), p(6,9,24,16,5), p(8,10,30,25,9), p(10,12,37,36,13),
        p(2,6,11,3,1), p(3,10,14,6,2), p(4,11,17,10,3), p(5,11,22,16,5), p(7,12,28,24,9), p(8,14,35,34,13)
    };
}();

#ifdef __EMSCRIPTEN__
#include "js_helpers.h"
#include <iostream>

MAP_TO_JS_FUNC(powder_IDs);
MAP_TO_JS_FUNC(powder_names);
VEC_TO_JS_FUNC(powder_stats);

EMSCRIPTEN_BINDINGS(powders) {
    function("powderIDs", &make_powder_IDs);
    function("powderNames", &make_powder_names);
    value_object<Powder>("Powder")
        .field("min", &Powder::min)
        .field("max", &Powder::max)
        .field("convert", &Powder::convert)
        .field("defPlus", &Powder::defPlus)
        .field("defMinus", &Powder::defMinus)
        ;
    function("powderStats", make_powder_stats);
    
}
#endif
