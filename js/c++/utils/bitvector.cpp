#include "bitvector.h"
#include "base64.h"
#include <algorithm>
#include <stdexcept>
#include <sstream>

BitVector::BitVector(const std::string b64_data) {
    length = b64_data.length() * 6;
    data.reserve(length/bitvec_data_s + 1);

    bitvec_data_t scratch = 0;
    size_t bitvec_index = 0;
    for (size_t i = 0; i < b64_data.length(); ++i) {
        size_t char_num = Base64::digitsMap.find(b64_data[i])->second;
        unsigned int pre_pos = bitvec_index % bitvec_data_s;
        scratch |= char_num << pre_pos;
        bitvec_index += 6;  // b64 is 6 bits per character.
        unsigned int post_pos = bitvec_index % bitvec_data_s;
        if (post_pos < pre_pos) { //we have to have filled up the integer
            data.push_back(scratch);
            scratch = (char_num >> (6 - post_pos));
        }
        if (i == b64_data.length()-1 && post_pos != 0) {
            data.push_back(scratch);
        }
    }
}

BitVector::BitVector(bitvec_data_t num, size_t length) {
    if (length < 0) {
        throw std::range_error("BitVector must have nonnegative length.");
    }
    data.push_back(num);
    this->length = length;
}

/** Return value of bit at index idx.
 *
 * @param {Number} idx - The index to read
 *
 * @returns The bit value at position idx
 */
bool BitVector::read_bit(size_t idx) const {
    if (idx < 0 || idx >= length) {
        std::stringstream ss;
        ss << "Cannot read bit outside the range of the BitVector. (" << idx << " > " << length << ")";
        throw std::range_error(ss.str());
    }
    return (data[idx / bitvec_data_s] & (1 << (idx % bitvec_data_s))) == 0 ? 0 : 1;
}

/** Returns an integer value (if possible) made from the range of bits [start, end). Undefined behavior if the range to read is too big.
 *
 * @param {Number} start - The index to start slicing from. Inclusive.
 * @param {Number} end - The index to end slicing at. Exclusive.
 *
 * @returns An integer representation of the sliced bits.
 */
bitvec_data_t BitVector::slice(size_t start, size_t end) const {
    if (end < start) {
        throw std::range_error("Cannot slice a range where the end is before the start.");
    } else if (end == start) {
        return 0;
    } else if (end - start > bitvec_data_s) {
        //requesting a slice of longer than the size of a single data element (safe integer "length")
        std::stringstream ss;
        ss << "Cannot slice a range of longer than " << bitvec_data_s << " bits (unsafe to store in an integer).";
        throw std::range_error(ss.str());
    }
    bitvec_data_t res = 0;
    if ((end-1) / bitvec_data_s == start / bitvec_data_s) {
        //the range is within 1 uint32 section - do some relatively fast bit twiddling
        //res = (this.bits[Math.floor(start / 32)] & ~((((~0) << ((end - 1))) << 1) | ~((~0) << (start)))) >>> (start % 32);

        bitvec_data_t mask = (~(((~0) << ((end - 1) % bitvec_data_s + 1)))) & ((~0) << (start % bitvec_data_s));
        res = (data[start / bitvec_data_s] & mask) >> (start % bitvec_data_s);
    }
    else {
        //the number of bits in the uint32s
        //let start_pos = (start % 32);
        //let int_idx = Math.floor(start/32);
        //res = (this.bits[int_idx] & ((~0) << (start))) >>> (start_pos);
        //res |= (this.bits[int_idx + 1] & ~((~0) << (end))) << (32 - start_pos);

        unsigned int start_pos = start % bitvec_data_s;
        unsigned int int_idx = start / bitvec_data_s;
        res = (data[int_idx] & ((~0) << start_pos)) >> start_pos;
        // IMPORTANT: (end % bitvec_data_s) is never zero.
        res |= (data[int_idx + 1] & ~((~0) << (end % bitvec_data_s))) << (bitvec_data_s - start_pos);
    }
    return res;

    // General code - slow
    // for (let i = start; i < end; i++) {
    //     res |= (get_bit(i) << (i - start));
    // }
}

/** Assign bit at index idx to 1.
 *
 * @param {Number} idx - The index to set.
 */
void BitVector::set_bit(size_t idx) {
    if (idx < 0 || idx >= length) {
        throw std::range_error("Cannot set bit outside the range of the BitVector.");
    }
    data[idx / bitvec_data_s] |= (1 << (idx % bitvec_data_s));
}

/** Assign bit at index idx to 0.
 *
 * @param {Number} idx - The index to clear.
 */
void BitVector::clear_bit(size_t idx) {
    if (idx < 0 || idx >= length) {
        throw std::range_error("Cannot clear bit outside the range of the BitVector.");
    }
    data[idx / bitvec_data_s] &= ~(1 << (idx % bitvec_data_s));
}

/** Creates a string version of the bit vector in B64. Does not keep the order of elements a sensible human readable format.
 *
 * @returns A b64 string representation of the BitVector.
 */
std::string BitVector::toB64() const {
    if (length == 0) {
        return "";
    }
    std::stringstream b64_str;
    size_t i = 0;
    while (i < length) {
        b64_str << Base64::fromIntN(this->slice(i, i + 6), 1);
        i += 6;
    }

    return b64_str.str();
}

/** Returns a BitVector in bitstring format. Probably only useful for dev debugging.
 *
 * @returns A bit string representation of the BitVector. Goes from higher-indexed bits to lower-indexed bits. (n ... 0)
 */
std::string BitVector::toString() const {
    std::stringstream ret_str;
    for (size_t i = length; i != 0; --i) {
        ret_str << (this->read_bit(i-1) ? "1": "0");
    }
    return ret_str.str();
}

/** Returns a BitVector in bitstring format. Probably only useful for dev debugging.
 *
 * @returns A bit string representation of the BitVector. Goes from lower-indexed bits to higher-indexed bits. (0 ... n)
 */
std::string BitVector::toStringR() const {
    std::stringstream ret_str;
    for (size_t i = 0; i < length; ++i) {
        ret_str << (this->read_bit(i) ? "1": "0");
    }
    return ret_str.str();
}

void BitVector::append(const BitVector& other) {
    data.reserve(data.size() + other.data.size());

    size_t other_index = 0;
    if (this->length % bitvec_data_s != 0) {
        // fill in the last block.
        bitvec_data_t scratch = data[data.size() - 1];
        size_t bits_remaining = bitvec_data_s - (this->length % bitvec_data_s);

        size_t n = std::min(other.length, bits_remaining);
        scratch |= (other.slice(0, n) << (this->length % bitvec_data_s));
        data[data.size() - 1] = scratch;
        other_index += n;
    }
    while (other_index != other.length) {
        size_t n = std::min(other.length - other_index, (size_t)bitvec_data_s);
        data.push_back(other.slice(other_index, other_index + n));
        other_index += n;
    }
    this->length += other.length;
}

void BitVector::append(const std::string b64_data) {
    BitVector tmp(b64_data);
    this->append(tmp);
}

void BitVector::append(bitvec_data_t num, size_t length) {
    BitVector tmp(num, length);
    this->append(tmp);
}
