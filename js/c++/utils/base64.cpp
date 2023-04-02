#include "base64.h"

namespace Base64 {

    std::string fromIntV(unsigned int int32) {
        std::string result;
        while (true) {
            result = digits[int32 & 0x3f] + result;
            int32 >>= 6;
            if (int32 == 0) { break; }
        }
        return result;
    }

    std::string fromIntN(unsigned int int32, int n) {
        std::string result;
        for (int i = 0; i < n; ++i) {
            result = digits[int32 & 0x3f] + result;
            int32 >>= 6;
        }
        return result;
    }

    unsigned int toInt(std::string digits) {
        unsigned int result = 0;
        for (size_t i = 0; i < digits.length(); ++i) {
            result = (result << 6) + digitsMap.find(digits[i])->second;
        }
        return result;
    }

    int toIntSigned(std::string digits) {
        int result = 0;
        if (digits.length() > 0 && digitsMap.find(digits[0])->second & 0x20) {
            result = -1;
        }
        for (size_t i = 0; i < digits.length(); ++i) {
            result = (result << 6) + digitsMap.find(digits[i])->second;
        }
        return result;
    }
}
