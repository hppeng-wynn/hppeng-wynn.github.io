let getUrl = window.location;
const url_base = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

// huge regex :doom:
// replace with navigator.userAgentData.mobile once it has wider support
const isMobile = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}(); // runs immediately, so mobileCheck is a boolean not a function

const zip2 = (a, b) => a.map((k, i) => [k, b[i]]);
const zip3 = (a, b, c) => a.map((k, i) => [k, b[i], c[i]]);

function clamp(num, low, high){
    return Math.min(Math.max(num, low), high);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Permutations in js reference (also cool algorithm):
// https://stackoverflow.com/a/41068709
function perm(a){
    if (a.length == 0) return [[]];
    var r = [[a[0]]],
        t = [],
        s = [];
    if (a.length == 1) return r;
    for (var i = 1, la = a.length; i < la; i++){
        for (var j = 0, lr = r.length; j < lr; j++){
            r[j].push(a[i]);
            t.push(r[j]);
            for(var k = 1, lrj = r[j].length; k < lrj; k++){
                for (var l = 0; l < lrj; l++) s[l] = r[j][(k+l)%lrj];
                t[t.length] = s;
                s = [];
            }
        }
        r = t;
        t = [];
    }
    return r;
}

function round_near(value) {
    let eps = 0.00000001;
    if (Math.abs(value - Math.round(value)) < eps) {
        return Math.round(value);
    }
    return value;
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function setHTML(id, html) {
    document.getElementById(id).innerHTML = html;
}

function setValue(id, value) {
    let el = document.getElementById(id);
    if (el == null) {
        console.log("WARN tried to set text value of id {"+id+"} to ["+value+"] but did not exist!");
        return;
    }
    el.value = value;
    el.dispatchEvent(new Event("change"));
}

function getValue(id) {
    return document.getElementById(id).value;
}

function log(b, n) {
    return Math.log(n) / Math.log(b);
}

// Base 64 encoding tools
// https://stackoverflow.com/a/27696695
// Modified for fixed precision

// Base64.fromInt(-2147483648); // gives "200000"
// Base64.toInt("200000"); // gives -2147483648
Base64 = (function () {
    var digitsStr =
    //   0       8       16      24      32      40      48      56     63
    //   v       v       v       v       v       v       v       v      v
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
    var digits = digitsStr.split('');
    var digitsMap = {};
    for (var i = 0; i < digits.length; i++) {
        digitsMap[digits[i]] = i;
    }
    return {
        fromIntV: function(int32) {
            var result = '';
            while (true) {
                result = digits[int32 & 0x3f] + result;
                int32 >>>= 6;
                if (int32 === 0)
                    break;
            }
            return result;
        },
        fromIntN: function(int32, n) {
            var result = '';
            for (let i = 0; i < n; ++i) {
                result = digits[int32 & 0x3f] + result;
                int32 >>= 6;
            }
            return result;
        },
        toInt: function(digitsStr) {
            var result = 0;
            var digits = digitsStr.split('');
            for (var i = 0; i < digits.length; i++) {
                result = (result << 6) + digitsMap[digits[i]];
            }
            return result;
        },
        toIntSigned: function(digitsStr) {
            var result = 0;
            var digits = digitsStr.split('');
            if (digits[0] && (digitsMap[digits[0]] & 0x20)) {
                result = -1;
            }
            for (var i = 0; i < digits.length; i++) {
                result = (result << 6) + digitsMap[digits[i]];
            }
            return result;
        }
    };
})();


/** A class used to represent an arbitrary length bit vector. Very useful for encoding and decoding.
 *
 */
 class BitVector {

    /** Constructs an arbitrary-length bit vector.
     * @class
     * @param {String | Number} data - The data to append.
     * @param {Number} length - A set length for the data. Ignored if data is a string.
     *
     * The structure of the Uint32Array should be [[last, ..., first], ..., [last, ..., first], [empty space, last, ..., first]]
     */
    constructor(data, length) {
        let bit_vec = [];

        if (typeof data === "string") {
            let int = 0;
            let bv_idx = 0;
            length = data.length * 6;

            for (let i = 0; i < data.length; i++) {
                let char = Base64.toInt(data[i]);
                let pre_pos = bv_idx % 32;
                int |= (char << bv_idx);
                bv_idx += 6;
                let post_pos = bv_idx % 32;
                if (post_pos < pre_pos) { //we have to have filled up the integer
                    bit_vec.push(int);
                    int = (char >>> (6 - post_pos));
                }

                if (i == data.length - 1 && post_pos != 0) {
                    bit_vec.push(int);
                }
            }
        } else if (typeof data === "number") {
            if (typeof length === "undefined") {
                if (data == 0) {
                    length = 0;
                } else {
                    length = Math.ceil(Math.log(data + 1) / Math.log(2)); //+1 to account for powers of 2
                }
            }
            if (length < 0) {
                throw new RangeError("BitVector must have nonnegative length.");
            }

            //convert to int just in case
            data = Math.round(data);

            //range of numbers that won't fit in a uint32
            if (data > 2**32 - 1 || data < -(2 ** 32 - 1)) {
                throw new RangeError("Numerical data has to fit within a 32-bit integer range to instantiate a BitVector.");
            }
            bit_vec.push(data);
        } else {
            throw new TypeError("BitVector must be instantiated with a Number or a B64 String");
        }

        if (bit_vec.length == 0) {
            bit_vec = [0];
        }

        this.length = length;
        this.bits = new Uint32Array(bit_vec);
    }

    /** Return value of bit at index idx.
     *
     * @param {Number} idx - The index to read
     *
     * @returns The bit value at position idx
     */
    read_bit(idx) {
        if (idx < 0 || idx >= this.length) {
            throw new RangeError("Cannot read bit outside the range of the BitVector. ("+idx+" >= "+this.length+")");
        }
        return ((this.bits[Math.floor(idx / 32)] & (1 << idx)) == 0 ? 0 : 1);
    }

    /** Returns an integer value (if possible) made from the range of bits [start, end). Undefined behavior if the range to read is too big.
     *
     * @param {Number} start - The index to start slicing from. Inclusive. 
     * @param {Number} end - The index to end slicing at. Exclusive.
     *
     * @returns An integer representation of the sliced bits.
     */
    slice(start, end) {
        //TO NOTE: JS shifting is ALWAYS in mod 32. a << b will do a << (b mod 32) implicitly.

        if (end < start) {
            throw new RangeError("Cannot slice a range where the end is before the start.");
        } else if (end == start) {
            return 0;
        } else if (end - start > 32) {
            //requesting a slice of longer than 32 bits (safe integer "length")
            throw new RangeError("Cannot slice a range of longer than 32 bits (unsafe to store in an integer).");
        }

        let res = 0;
        if (Math.floor((end - 1) / 32) == Math.floor(start / 32)) {
            //the range is within 1 uint32 section - do some relatively fast bit twiddling
            res = (this.bits[Math.floor(start / 32)] & ~((((~0) << ((end - 1))) << 1) | ~((~0) << (start)))) >>> (start % 32);
        } else {
            //the number of bits in the uint32s
            let start_pos = (start % 32);
            let int_idx = Math.floor(start/32);
            res = (this.bits[int_idx] & ((~0) << (start))) >>> (start_pos);
            res |= (this.bits[int_idx + 1] & ~((~0) << (end))) << (32 - start_pos);
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
    set_bit(idx) {
        if (idx < 0 || idx >= this.length) {
            throw new RangeError("Cannot set bit outside the range of the BitVector.");
        }
        this.bits[Math.floor(idx / 32)] |= (1 << idx % 32);
    }

    /** Assign bit at index idx to 0.
     *
     * @param {Number} idx - The index to clear.
     */
    clear_bit(idx) {
        if (idx < 0 || idx >= this.length) {
            throw new RangeError("Cannot clear bit outside the range of the BitVector.");
        }
        this.bits[Math.floor(idx / 32)] &= ~(1 << idx % 32);
    }

    /** Creates a string version of the bit vector in B64. Does not keep the order of elements a sensible human readable format.
     *
     * @returns A b64 string representation of the BitVector.
     */
    toB64() {
        if (this.length == 0) {
            return "";
        }
        let b64_str = "";
        let i = 0;
        while (i < this.length) {
            b64_str += Base64.fromIntN(this.slice(i, i + 6), 1);
            i += 6;
        }

        return b64_str;
    }

    /** Returns a BitVector in bitstring format. Probably only useful for dev debugging.
     *
     * @returns A bit string representation of the BitVector. Goes from higher-indexed bits to lower-indexed bits. (n ... 0)
     */
    toString() {
        let ret_str = "";
        for (let i = 0; i < this.length; i++) {
            ret_str = (this.read_bit(i) == 0 ? "0": "1") + ret_str;
        }
        return ret_str;
    }

     /** Returns a BitVector in bitstring format. Probably only useful for dev debugging.
     *
     * @returns A bit string representation of the BitVector. Goes from lower-indexed bits to higher-indexed bits. (0 ... n)
     */
    toStringR() {
        let ret_str = "";
        for (let i = 0; i < this.length; i++) {
            ret_str += (this.read_bit(i) == 0 ? "0": "1");
        }
        return ret_str;
    }

    /** Appends data to the BitVector.
     *
     * @param {Number | String | BitVector} data - The data to append.
     * @param {Number} length - The length, in bits, of the new data. This is ignored if data is a string. Defaults to 32 for numbers.
     */
     append(data, length = 32) {
        if (length < 0) {
            throw new RangeError("BitVector length must increase by a nonnegative number.");
        }

        //actual new data length is needed for resizing purposes 
        if (typeof data === "string") {
            length = data.length * 6;
        } else if (data instanceof BitVector) {
            length = data.length;
        }

        let new_length = this.length + length;
        if (this.bits.length * this.bits.BYTES_PER_ELEMENT * 8 < new_length) {
            //resize the internal repr by a factor of 2 before recursive calling
            let bit_vec = Array(2 * this.bits.length).fill(0);
            for (let i = 0; i < this.bits.length; i++) {
                bit_vec[i] = this.bits[i];
            }

            this.bits = new Uint32Array(bit_vec);
            return this.append(data, length);
        }

        //just write to the original bitvec
        let curr_idx = Math.floor(this.length / 32);
        let pos = this.length;
        
        if (typeof data === "string") {
            //daily reminder that shifts are modded by 32
            for (const character of data) {
                let char = Base64.toInt(character);
                this.bits[curr_idx] |= (char << pos);

                //if we go to the "next" char, update it
                if (Math.floor(pos / 32) < Math.floor((pos + 5) / 32)) {
                    this.bits[curr_idx + 1] |= (char >>> (6 - (pos + 6) % 32));
                }

                //update counters
                pos += 6;
                curr_idx = Math.floor(pos / 32);
            }
        } else if (typeof data === "number") {
            //convert to int just in case
            let int = Math.round(data);
                
            //range of numbers that "could" fit in a uint32 -> [0, 2^32) U [-2^31, 2^31)
            if (data > 2**32 - 1 || data < -(2 ** 31)) {
                throw new RangeError("Numerical data has to fit within a 32-bit integer range to instantiate a BitVector.");
            }
            //could be split between multiple new ints
            //reminder that shifts implicitly mod 32
            if (length == 32) {
                this.bits[curr_idx] |= int << (this.length);
            } else {
                this.bits[curr_idx] |= ((int & ~((~0) << length)) << (this.length));
            }

            //overflow part
            if ((pos % 32) + length > 32) {
                this.bits[curr_idx + 1] = (int >>> (32 - this.length));
            }
        } else if (data instanceof BitVector) {
            //fill to end of curr int of existing bv
            let other_pos = (32 - (pos % 32));
            this.bits[curr_idx] |= data.slice(0, other_pos);
            curr_idx += 1;

            //fill full ints
            while (other_pos + 32 < data.length) {
                this.bits[curr_idx] = data.slice(other_pos, other_pos + 32);
                curr_idx += 1;
                other_pos += 32;
            }
            
            //fill from "rest of" length/bv
            this.bits[curr_idx] = data.slice(other_pos, data.length); 
        } else {
            throw new TypeError("BitVector must be appended with a Number or a B64 String");
        }

        //update length
        this.length += length;
    }
};


/*
    Turns a raw stat and a % stat into a final stat on the basis that - raw and >= 100% becomes 0 and + raw and <=-100% becomes negative.
    Pct would be 0.80 for 80%, -1.20 for 120%, etc
    Example Outputs:
    raw: -100
    pct: +0.20, output = -80
    pct: +1.20, output = 0
    pct: -0.20, output = -120
    pct: -1.20, output = -220

    raw: +100
    pct: +0.20, output = 120
    pct: +1.20, output = 220
    pct: -0.20, output = 80
    pct: -1.20, output = -20
*/
function rawToPct(raw, pct){
    final = 0;
    if (raw < 0){
        final = (Math.min(0, raw - (raw * pct) ));
    }else if(raw > 0){
        final = raw + (raw * pct);
    }else{ //do nothing - final's already 0
    }
    return final;
}

/*
 * Clipboard utilities
 * From: https://stackoverflow.com/a/30810322
 */
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if the element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in the top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of the white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

/**
 * Generates a random color using the #(R)(G)(B) format.
 */
function randomColor() {
    return '#' + Math.round(Math.random() * 0xFFFFFF).toString(16);
}

/**
 * Generates a random color, but lightning must be relatively high (>0.5).
 *
 * @returns a random color in RGB 6-bit form.
 */
function randomColorLight() {
    return randomColorHSL([0,1],[0,1],[0.5,1]);
}

/** Generates a random color given HSL restrictions.
 *
 * @returns a random color in RGB 6-bit form.
 */
function randomColorHSL(h,s,l) {
    var letters = '0123456789abcdef';
    let h_var = h[0] + (h[1]-h[0])*Math.random(); //hue
    let s_var = s[0] + (s[1]-s[0])*Math.random(); //saturation
    let l_var = l[0] + (l[1]-l[0])*Math.random(); //lightness
    let rgb = hslToRgb(h_var,s_var,l_var);
    let color = "#";
    for (const c of rgb) {
        color += letters[Math.floor(c/16)] + letters[c%16];
    }
    return color;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255]. Not written by wynnbuilder devs.
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
 function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/** Creates a tooltip.
 *
 * @param {DOM Element} elem - the element to make a tooltip
 * @param {String} element_type - the HTML element type that the tooltiptext should be.
 * @param {String} tooltiptext - the text to display in the tooltip.
 * @param {DOM Element} parent - the parent elem. optional.
 * @param {String[]} classList - a list of classes to add to the element.
 */
function createTooltip(elem, element_type, tooltiptext, parent, classList) {
    elem = document.createElement(element_type);
    elem.classList.add("tooltiptext");
    if (tooltiptext.includes("\n")) {
        let texts = tooltiptext.split("\n");
        for (const t of texts) {
            let child = document.createElement(element_type);
            child.textContent = t;
            elem.appendChild(child);
        }
    } else {
        elem.textContent = tooltiptext;
    }
    for (const c of classList) {
        elem.classList.add(c);
    }
    if (parent) {
        parent.classList.add("tooltip");
        parent.appendChild(elem);
    }
    return elem;
}

/** A generic function that toggles the on and off state of a button.
 *
 * @param {String} button_id - the id name of the button.
 */
function toggleButton(button_id) {
    let elem = document.getElementById(button_id);
    if (elem.tagName === "BUTTON") {
        if (elem.classList.contains("toggleOn")) { //toggle the pressed button off
            elem.classList.remove("toggleOn");
        } else {
            elem.classList.add("toggleOn");
        }
    }
}

/**
 * If the input object is undefined, make it "match" the target type
 * with default value (0 or empty str).
 */
function matchType(object, target) {
    if (typeof object === 'undefined') {
        switch (target) {
            case 'string':
                return "";
            case 'number':
                return 0;
            case 'undefined':
                return undefined;
            default:
                throw new Error(`Incomparable type ${target}`);
        }
    }
    return object;
}

/** A utility function that reloads the page forcefully.
 *
 */
async function hardReload() {
    //https://gist.github.com/rmehner/b9a41d9f659c9b1c3340
    try {
        const dbs = await window.indexedDB.databases();
        await dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) });
    } catch (error) {
        // Hacky patch for firefox...
        console.log(error);
        const db_names = ['item_db', 'ing_db', 'map_db', 'tome_db'];
        await db_names.forEach(db => { window.indexedDB.deleteDatabase(db) });
    }

    location.reload(true);
}


function capitalizeFirst(str) {
    return str[0].toUpperCase() + str.substring(1);
}

/** https://stackoverflow.com/questions/16839698/jquery-getscript-alternative-in-native-javascript
 *  If we ever want to write something that needs to import other js files
 */
const getScript = url => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onerror = reject;

    script.onload = script.onreadystatechange = function () {
        const loadState = this.readyState;

        if (loadState && loadState !== 'loaded' && loadState !== 'complete') return

        script.onload = script.onreadystatechange = null;

        resolve();
    }

    document.head.appendChild(script);
})

/*
GENERIC TEST FUNCTIONS
*/
const TEST_SUCCESS = 1;
const TEST_FAIL = 0;

/** The generic assert function. Fails on all "false-y" values. Useful for non-object equality checks, boolean value checks, and existence checks.
 *
 * @param {*} arg - argument to assert.
 * @param {String} msg - the error message to throw.
 */
 function assert(arg, msg) {
    if (!arg) {
        console.trace(msg ? msg : "Assert failed.");
        return TEST_FAIL;
    }
    return TEST_SUCCESS;
}

/** Asserts object equality of the 2 parameters. For loose and strict asserts, use assert().
 *
 * @param {*} arg1 - first argument to compare.
 * @param {*} arg2 - second argument to compare.
 * @param {String} msg - the error message to throw.
 */
function assert_equals(arg1, arg2, msg) {
    if (!Object.is(arg1, arg2)) {
        console.trace(msg ? msg : "Assert Equals failed. " + arg1 + " is not " + arg2 + ".");
        return TEST_FAIL;
    }
    return TEST_SUCCESS;
}

/** Asserts object inequality of the 2 parameters. For loose and strict asserts, use assert().
 *
 * @param {*} arg1 - first argument to compare.
 * @param {*} arg2 - second argument to compare.
 * @param {String} msg - the error message to throw.
 */
 function assert_not_equals(arg1, arg2, msg) {
    if (Object.is(arg1, arg2)) {
        console.trace(msg ? msg : "Assert Not Equals failed. " + arg1 + " is " + arg2 + ".");
        return TEST_FAIL;
    }
    return TEST_SUCCESS;
}

/** Asserts proximity between 2 arguments. Should be used for any floating point datatype.
 *
 * @param {*} arg1 - first argument to compare.
 * @param {*} arg2 - second argument to compare.
 * @param {Number} epsilon - the margin of error (<= del difference is ok). Defaults to -1E5.
 * @param {String} msg - the error message to throw.
 */
function assert_near(arg1, arg2, epsilon = 1E-5, msg) {
    if (Math.abs(arg1 - arg2) > epsilon) {
        console.trace(msg ? msg : "Assert Near failed. " + arg1 + " is not within " + epsilon + " of " + arg2 + ".");
        return TEST_FAIL;
    }
    return TEST_SUCCESS;
}

/** Asserts that the input argument is null.
 *
 * @param {*} arg - the argument to test for null.
 * @param {String} msg - the error message to throw.
 */
function assert_null(arg, msg) {
    if (arg !== null) {
        console.trace(msg ? msg : "Assert Near failed. " + arg + " is not null.");
        return TEST_FAIL;
    }
    return TEST_SUCCESS;
}

/** Asserts that the input argument is undefined.
 *
 * @param {*} arg - the argument to test for undefined.
 * @param {String} msg - the error message to throw.
 */
 function assert_undefined(arg, msg) {
    if (arg !== undefined) {
        console.trace(msg ? msg : "Assert Near failed. " + arg + " is not undefined.");
        return TEST_FAIL;
    }
    return TEST_SUCCESS;
}

/** Asserts that there is an error when a callback function is run.
 *
 * @param {Function} func_binding - a function binding to run. Can be passed in with func.bind(null, arg1, ..., argn)
 * @param {String} msg - the error message to throw.
 */
function assert_error(func_binding, msg) {
    try {
        func_binding();
    } catch (err) {
        return TEST_SUCCESS;
    }
    console.trace(msg ? msg : "Function didn't throw an error.");
    return TEST_FAIL;
}

/**
 * Deep copy object/array of basic types.
 */
function deepcopy(obj, refs=undefined) {
    if (refs === undefined) {
        refs = new Map();
    }
    if (typeof(obj) !== 'object' || obj === null) { // null or value type
        return obj;
    }
    let ret = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        let val;
        try {
            val = obj[key];
        } catch (exc) {
            console.trace();
            val = undefined;
        }
        if (typeof(obj) === 'object') {
            if (refs.has(val)) {
                ret[key] = refs.get(val);
            }
            else {
                refs.set(val, val);
                ret[key] = deepcopy(val, refs);
            }
        }
        else {
            ret[key] = val;
        }
    }
    return ret;
}
/**
 * 
 */
function gen_slider_labeled({label_name, label_classlist = [], min = 0, max = 100, step = 1, default_val = min, id = undefined, color = "#FFFFFF", classlist = []}) {
    let slider_container = document.createElement("div");
    slider_container.classList.add("col");

    let buf_col = document.createElement("div");
    
    let label = document.createElement("div");
    label.classList.add(...label_classlist);
    label.textContent = label_name + ": " + default_val;

    let slider = gen_slider(min, max, step, default_val, id, color, classlist, label);

    //we set IDs here because the slider's id is potentially only meaningful after gen_slider() is called
    label.id = slider.id + "_label";
    slider_container.id = slider.id + "-container";

    buf_col.append(slider, label);
    slider_container.appendChild(buf_col);

    return slider_container;
}

/** Creates a slider input (input type = range) given styling parameters
 * 
 * @param {Number | String} min - The minimum value for the slider. defaults to 0
 * @param {Number | String} max - The maximum value for the slider. defaults to 100
 * @param {Number | String} step - The granularity between possible values. defaults to 1
 * @param {Number | String} default_val - The default value to set the slider to.
 * @param {String} id - The element ID to use for the slider. defaults to the current date time
 * @param {String} color - The hex color to use for the slider. Needs the # character.
 * @param {Array<String>} classlist - A list of classes to add to the slider.
 * @returns 
 */
function gen_slider(min = 0, max = 100, step = 1, default_val = min, id = undefined, color = "#FFFFFF", classlist = [], label = undefined) {
    //simple attribute vals
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = default_val;
    slider.autocomplete = "off";
    if (id) {
        if (document.getElementById(id)) {
            throw new Error("ID " + id + " already exists within the DOM.")
        } else {
            slider.id = id;
        }
    } else {
        slider.id = new Date().toLocaleTimeString();
    }
    slider.color = color;
    slider.classList.add(...classlist); //special spread operator - 
     //necessary for display purposes
     slider.style.webkitAppearance = "none";
     slider.style.borderRadius = "30px";
     slider.style.height = "0.5rem";
     slider.classList.add("px-0", "slider");

    //set up recoloring
    slider.addEventListener("change", function(e) {
        recolor_slider(slider, label);
    });
    //do recoloring for the default val
    let pct = Math.round(100 * (parseInt(slider.value) - parseInt(slider.min)) / (parseInt(slider.max) - parseInt(slider.min)));
    slider.style.background = `rgba(0, 0, 0, 0) linear-gradient(to right, ${color}, ${color} ${pct}%, #AAAAAA ${pct}%, #AAAAAA 100%)`;  

    //return slider
    return slider;
}

/** Recolors a slider. If the corresponding label exists, also update that.
 * 
 * @param {slider} slider - the slider element
 * @param {label} label - the label element
 */
function recolor_slider(slider, label) {
    let color = slider.color;
    let pct = Math.round(100 * (parseInt(slider.value) - parseInt(slider.min)) / (parseInt(slider.max) - parseInt(slider.min)));
    slider.style.background = `rgba(0, 0, 0, 0) linear-gradient(to right, ${color}, ${color} ${pct}%, #AAAAAA ${pct}%, #AAAAAA 100%)`;  

    if (label) {
        //convention is that the number goes at the end... I parse by separating it at ':'
        label.textContent = label.textContent.split(":")[0] + ": " + slider.value;
    }
} 

/**
 * Shorthand for making an element in html.
 *
 * @param {String} type : type of element
 * @param {List[String]} classlist : css classes for element
 * @param {Map[String, String]} args : Properties for the element
 */
function make_elem(type, classlist = [], args = {}) {
    const ret_elem = document.createElement(type);
    ret_elem.classList.add(...classlist);
    for (const i in args) {
        if (i === 'style') {
            const style_obj = args[i];
            if (typeof style_obj === 'string' || style_obj instanceof String) {
                ret_elem.style = style_obj;
                continue;
            }
            for (const k in style_obj) {
                ret_elem.style[k] = style_obj[k];
            }
            continue;
        }
        ret_elem[i] = args[i];
    }
    return ret_elem;
}

/**
 * Nodes must have:
 * node: {
 *   parents: List[node]
 *   children: List[node]
 * }
 *
 * This function will define: "visited, assigned, scc" properties
 * Assuming a connected graph. (only one root)
 */
function make_SCC_graph(root_node, nodes) {
    for (const node of nodes) {
        node.visited = false;
        node.assigned = false;
        node.scc = null;
    }
    const res = []
    /*
     * SCC graph construction.
     * https://en.wikipedia.org/wiki/Kosaraju%27s_algorithm
     */
    function visit(u, res) {
        if (u.visited) { return; }
        u.visited = true;
        for (const child of u.children) {
            if (!child.visited) { visit(child, res); }
        }
        res.push(u);
    }
    visit(root_node, res);
    res.reverse();
    const sccs = [];
    function assign(node, cur_scc) {
        if (node.assigned) { return; }
        cur_scc.nodes.push(node);
        node.scc = cur_scc;
        node.assigned = true;
        for (const parent of node.parents) {
            assign(parent, cur_scc);
        }
    }
    for (const node of res) {
        if (node.assigned) { continue; }
        const cur_scc = {
            nodes: [],
            children: new Set(),
            parents: new Set()
        };
        assign(node, cur_scc);
        sccs.push(cur_scc);
    }
    for (const scc of sccs) {
        for (const node of scc.nodes) {
            for (const child of node.children) {
                scc.children.add(child.scc);
            }
            for (const parent of node.parents) {
                scc.parents.add(parent.scc);
            }
        }
    }
    return sccs;
}


// Toggles display of a certain element, given the ID.
function toggle_tab(tab) {
    let elem = document.getElementById(tab);
    if (elem.style.display == "none") {
        elem.style.display = "";
    } else {
        elem.style.display = "none";
    }
}

// Toggle display of a certain tab, in a group of tabs, given the target tab ID, and a list of associated tabs.
// Also sets visual display of an element with ID of target + "-btn" to selected.
function show_tab(target, tabs) {
    //hide all tabs, then show the tab of the div clicked and highlight the correct button
    for (const i in tabs) {
        document.getElementById(tabs[i]).style.display = "none";
        document.getElementById(tabs[i] + "-btn").classList.remove("selected-btn");
    }
    document.getElementById(target).style.display = "";
    document.getElementById(target + "-btn").classList.add("selected-btn");
}

// mobile navbar appearance control
let scrollPos = 0
if (screen.width < 992) {
    document.addEventListener('scroll', (e) => {
        if (document.documentElement.scrollTop - scrollPos > 20) {
            document.getElementById("mobile-navbar").style.display = "none";
            document.getElementById("mobile-navbar-dropdown").style.display = "none";
        } else if (document.documentElement.scrollTop - scrollPos < -50 || scrollPos < 70) {
            document.getElementById("mobile-navbar").style.display = "";
        }
        scrollPos = document.documentElement.scrollTop;
    });
}
