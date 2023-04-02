#pragma once
#include <string>
#include <map>

// Base 64 encoding tools
// https://stackoverflow.com/a/27696695
// Modified for fixed precision

// Base64.fromInt(-2147483648); // gives "200000"
// Base64.toInt("200000"); // gives -2147483648
namespace Base64 {
    const std::string digits =
    //   0       8       16      24      32      40      48      56     63
    //   v       v       v       v       v       v       v       v      v
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";

    const std::map<char, size_t> digitsMap = []{
        std::map<char, size_t> m;
        for (size_t i = 0; i < digits.length(); ++i) {
            m[digits[i]] = i;
        }
        return m;
    }();

    std::string fromIntV(unsigned int i);

    std::string fromIntN(unsigned int i, int n);

    unsigned int toInt(std::string digitsStr);

    int toIntSigned(std::string digitsStr);
}
