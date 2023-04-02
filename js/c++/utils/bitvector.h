#pragma once
#include <string>
#include <vector>

#ifdef __EMSCRIPTEN__
#define bitvec_data_s 32
#define bitvec_data_t uint32_t
#else
#define bitvec_data_s 64
#define bitvec_data_t uint64_t
#endif

class BitVector {

/** A class used to represent an arbitrary length bit vector. Very useful for encoding and decoding.
 *
 */
public:
    /** Constructs an arbitrary-length bit vector.
     * @class
     * @param {String | Number} data - The data to append.
     * @param {Number} length - A set length for the data. Ignored if data is a string.
     *
     * The structure of the Uint32Array should be [[last, ..., first], ..., [last, ..., first], [empty space, last, ..., first]]
     */
    BitVector() {};
    BitVector(const BitVector& other) : data(other.data), length(other.length) {};
    BitVector(const std::string b64_data);
    BitVector(bitvec_data_t num, size_t length);

    /** Return value of bit at index idx.
     *
     * @param {Number} idx - The index to read
     *
     * @returns The bit value at position idx
     */
    bool read_bit(size_t idx) const;

    /** Returns an integer value (if possible) made from the range of bits [start, end). Undefined behavior if the range to read is too big.
     *
     * @param {Number} start - The index to start slicing from. Inclusive.
     * @param {Number} end - The index to end slicing at. Exclusive.
     *
     * @returns An integer representation of the sliced bits.
     */
    bitvec_data_t slice(size_t start, size_t end) const;

    /** Assign bit at index idx to 1.
     *
     * @param {Number} idx - The index to set.
     */
    void set_bit(size_t idx);

    /** Assign bit at index idx to 0.
     *
     * @param {Number} idx - The index to clear.
     */
    void clear_bit(size_t idx);

    /** Creates a string version of the bit vector in B64. Does not keep the order of elements a sensible human readable format.
     *
     * @returns A b64 string representation of the BitVector.
     */
    std::string toB64() const;

    /** Returns a BitVector in bitstring format. Probably only useful for dev debugging.
     *
     * @returns A bit string representation of the BitVector. Goes from higher-indexed bits to lower-indexed bits. (n ... 0)
     */
    std::string toString() const;

    /** Returns a BitVector in bitstring format. Probably only useful for dev debugging.
     *
     * @returns A bit string representation of the BitVector. Goes from lower-indexed bits to higher-indexed bits. (0 ... n)
     */
    std::string toStringR() const;

    /** Appends data to the BitVector.
     *
     * @param {Number | String} data - The data to append.
     * @param {Number} length - The length, in bits, of the new data. This is ignored if data is a string.
     */
    void append(const BitVector& other);
    void append(const std::string b64_data);
    void append(bitvec_data_t num, size_t length);

private:
    std::vector<bitvec_data_t> data;
    size_t length;
};
