#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

#include "powders.h"
#include "definitions.h"

#include <cstring>

const std::map<std::string, int> powderIDs = []{
    std::map<std::string, int> m;
    int powder_id = 0;
    for (const auto& x : skp_elements) {
        for (int i = 0; i < 6; ++i) {
            m[x + std::to_string(i)] = i;
            m[(char)toupper(x[0]) + std::to_string(i)] = i;
            powder_id++;
        }
    }
    return m;
}();

const std::map<int, std::string> powderNames = []{
    std::map<int, std::string> m;
    for (const auto& kv : powderIDs) {
        m[kv.second] = kv.first;
    }
    return m;
}();

Powder::Powder(int min, int max, int conv, int defPlus, int defMinus) :
        min(min), max(max), convert(conv), defPlus(defPlus), defMinus(defMinus) {}

const std::vector<Powder> powderStats = []{
    auto _p = [](int a, int b, int c, int d, int e){ return Powder(a,b,c,d,e); };
    return std::vector<Powder> {
        _p(3,6,17,2,1), _p(5,8,21,4,2), _p(6,10,25,8,3), _p(7,10,31,14,5), _p(9,11,38,22,9), _p(11,13,46,30,13),
        _p(1,8,9,3,1), _p(1,12,11,5,1), _p(2,15,13,9,2), _p(3,15,17,14,4), _p(4,17,22,20,7), _p(5,20,28,28,10),
        _p(3,4,13,3,1), _p(4,6,15,6,1), _p(5,8,17,11,2), _p(6,8,21,18,4), _p(7,10,26,28,7), _p(9,11,32,40,10),
        _p(2,5,14,3,1), _p(4,8,16,5,2), _p(5,9,19,9,3), _p(6,9,24,16,5), _p(8,10,30,25,9), _p(10,12,37,36,13),
        _p(2,6,11,3,1), _p(3,10,14,6,2), _p(4,11,17,10,3), _p(5,11,22,16,5), _p(7,12,28,24,9), _p(8,14,35,34,13)
    };
}();

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(powders) {
}
#endif
