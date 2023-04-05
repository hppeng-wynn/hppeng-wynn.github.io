#pragma once
#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;

#define MAP_TO_JS_FUNC(map_name) \
auto make_ ## map_name () { \
    return map_to_js(map_name); \
}

#define VEC_TO_JS_FUNC(vec_name) \
auto make_ ## vec_name () { \
    return vector_to_js(vec_name); \
}

// NOTE!!! For some stupid reason you can'd declare constants with these...
template<class Container>
val map_to_js(const Container& input_map) {
    static val Map = val::global("Map");
    val retval = Map.new_();
    for (const auto& [k, v] : input_map) {
        retval.call<val>("set", k, v);
    }
    return retval;
}

template<class Container>
val vector_to_js(const Container& input_vec) {
    val retval = val::array();
    for (const auto& x : input_vec) {
        retval.call<void>("push", x);
    }
    return retval;
}

#endif
