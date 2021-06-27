let getUrl = window.location;
const url_base = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

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

// Base64.fromInt(-2147483648); // gives "200000"
// Base64.toInt("200000"); // gives -2147483648

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

/** A utility function that reloads the page forcefully. 
 * 
 */
async function hardReload() {
    //https://gist.github.com/rmehner/b9a41d9f659c9b1c3340
    const dbs = await window.indexedDB.databases();
    await dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) });

    location.reload();
}
