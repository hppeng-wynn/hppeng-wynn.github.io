let getUrl = window.location;
const url_base = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

//updates all the OGP tags for a webpage. Should be called when build changes
function updateOGP() {
    //update the embed URL
    let url_elem = document.getElementById("ogp-url");
    if (url_elem) {
        url_elem.content = url_base+location.hash;
    }

    //update the embed text content
    let build_elem = document.getElementById("ogp-build-list");
    if (build_elem && player_build) {
        let text = "WynnBuilder build:\n"+
            "> "+player_build.helmet.get("displayName")+"\n"+
            "> "+player_build.chestplate.get("displayName")+"\n"+
            "> "+player_build.leggings.get("displayName")+"\n"+
            "> "+player_build.boots.get("displayName")+"\n"+
            "> "+player_build.ring1.get("displayName")+"\n"+
            "> "+player_build.ring2.get("displayName")+"\n"+
            "> "+player_build.bracelet.get("displayName")+"\n"+
            "> "+player_build.necklace.get("displayName")+"\n"+
            "> "+player_build.weapon.get("displayName")+" ["+player_build.weapon.get("powders").map(x => powderNames.get(x)).join("")+"]";
        build_elem.content = text;
    }
}

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
            if (typeof length === "undefined")
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
            throw new RangeError("Cannot read bit outside the range of the BitVector.");
        }
        return ((this.bits[Math.floor(idx / 32)] & (1 << (idx % 32))) == 0 ? 0 : 1);
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
            b64_str += Base64.fromIntV(this.slice(i, i + 6), 1);
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
     * @param {Number | String} data - The data to append.
     * @param {Number} length - The length, in bits, of the new data. This is ignored if data is a string. Defaults to 32 for numbers.
     */
     append(data, length = 32) {
        if (length < 0) {
            throw new RangeError("BitVector length must increase by a nonnegative number.");
        }

        //actual new data length is needed for resizing purposes 
        if (typeof data === "string") {
            length = data.length * 6;
        }

        let new_length = this.length + length;
        let mult = 1;
        while (mult * this.bits.length * this.bits.BYTES_PER_ELEMENT * 8 < new_length) {
            mult *= 2;
        }

        if (mult > 1) {
            //we have to expand the uint32array repr - double size
            let bit_vec = [];

            for (const uint of this.bits) {
                bit_vec.push(uint);
            }
            if (typeof data === "string") {
                let int = bit_vec[bit_vec.length - 1];
                let bv_idx = this.length;
                let updated_curr = false;
                for (let i = 0; i < data.length; i++) {
                    let char = Base64.toInt(data[i]);
                    let pre_pos = bv_idx % 32;
                    int |= (char << bv_idx);
                    bv_idx += 6;
                    let post_pos = bv_idx % 32;
                    if (post_pos < pre_pos) { //we have to have filled up the integer
                        if (bit_vec.length == this.bits.length && !updated_curr) {
                            bit_vec[bit_vec.length - 1] = int;
                            updated_curr = true;
                        } else {
                            bit_vec.push(int);
                        }
                        int = (char >>> (6 - post_pos));
                    }
    
                    if (i == data.length - 1) {
                        if (bit_vec.length == this.bits.length && !updated_curr) {
                            bit_vec[bit_vec.length - 1] = int;
                        } else if (post_pos != 0) {
                            bit_vec.push(int);
                        }
                    }
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
                bit_vec[bit_vec.length - 1] |= ((int & ~((~0) << length)) << (this.length));
                if (((this.length - 1) % 32 + 1) + length > 32) {
                    bit_vec.push(int >>> (32 - this.length));
                }
            } else {
                throw new TypeError("BitVector must be appended with a Number or a B64 String");
            }

            //pad the end with 0s
            for (let i = bit_vec.length; i < this.bits.length; i++) {
                bit_vec.push(0);
            }
            
            this.bits = new Uint32Array(bit_vec);
        } else {
            //just write to the original bitvec
            let curr_idx = Math.floor(this.length / 32);
            let pos = this.length;
            
            if (typeof data === "string") {
                //daily reminder that shifts are modded by 32
                for (const char of data) {
                    char = Base64.toInt(char);
                    this.bits[curr_idx] |= (char << pos);

                    //if we go to the "next" char, update it
                    if (Math.floor((pos - 1) / 32) < Math.floor((pos + 5) / 32)) {
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
                this.bits[curr_idx] |= ((int & ~((~0) << length)) << (this.length));
                if (((this.length - 1) % 32 + 1) + length > 32) {
                    this.bits[curr_idx + 1] = (int >>> (32 - this.length));
                }
            } else {
                throw new TypeError("BitVector must be appended with a Number or a B64 String");
            }
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

/**
 * Add multiple classes to a html element
 */
function addClasses(elem, classes) {
    for (let _class of classes) {
        elem.classList.add(_class);
    }
    return elem;
}

/** A utility function that reloads the page forcefully. 
 * 
 */
async function hardReload() {
    //https://gist.github.com/rmehner/b9a41d9f659c9b1c3340
    const dbs = await window.indexedDB.databases();
    await dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) });

    location.reload(true);
}


function capitalizeFirst(str) {
    return str[0].toUpperCase() + str.substring(1);
}
