(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const copy = require('copy-to-clipboard')
const createViewer = require('..')
const { svgElementToSvgImageContent } = require('../util')

document.addEventListener('keypress', function (event) {
  if (event.keyCode === 99) { // the c key
    const svg = document.querySelector('svg')
    const content = svgElementToSvgImageContent(svg)
    copy(content)
  }
})

createViewer({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
})

},{"..":3,"../util":13,"copy-to-clipboard":4}],2:[function(require,module,exports){
module.exports={
  "positions": [
    [
      111.0246,
      52.6046,
      46.2259
    ],
    [
      114.025,
      87.6733,
      58.9818
    ],
    [
      66.192,
      80.898,
      55.3943
    ],
    [
      72.1133,
      35.4918,
      30.8714
    ],
    [
      97.8045,
      116.561,
      73.9788
    ],
    [
      16.7623,
      58.0109,
      58.0782
    ],
    [
      52.6089,
      30.3641,
      42.5561
    ],
    [
      106.8814,
      31.9455,
      46.9133
    ],
    [
      113.4846,
      38.6049,
      49.1215
    ],
    [
      108.6633,
      43.2332,
      46.3154
    ],
    [
      101.2166,
      15.9822,
      46.3082
    ],
    [
      16.6605,
      -16.2883,
      93.6187
    ],
    [
      40.775,
      -10.2288,
      85.2764
    ],
    [
      23.9269,
      -2.5103,
      86.7365
    ],
    [
      11.1691,
      -7.0037,
      99.3776
    ],
    [
      9.5692,
      -34.3939,
      141.672
    ],
    [
      12.596,
      7.1655,
      88.741
    ],
    [
      61.1809,
      8.8142,
      76.9968
    ],
    [
      39.7195,
      -28.9271,
      88.9638
    ],
    [
      13.7962,
      -68.5757,
      132.057
    ],
    [
      15.2674,
      -62.32,
      129.688
    ],
    [
      14.8446,
      -52.6096,
      140.113
    ],
    [
      12.8917,
      -49.7716,
      144.741
    ],
    [
      35.6042,
      -71.758,
      81.0639
    ],
    [
      47.4625,
      -68.6061,
      63.3697
    ],
    [
      38.2486,
      -64.7302,
      38.9099
    ],
    [
      -12.8917,
      -49.7716,
      144.741
    ],
    [
      -13.7962,
      -68.5757,
      132.057
    ],
    [
      17.8021,
      -71.758,
      81.0639
    ],
    [
      19.1243,
      -69.0168,
      49.4201
    ],
    [
      38.2486,
      -66.2756,
      17.7762
    ],
    [
      12.8928,
      -36.7035,
      141.672
    ],
    [
      109.284,
      -93.5899,
      27.8243
    ],
    [
      122.118,
      -36.8894,
      35.025
    ],
    [
      67.7668,
      -30.197,
      78.4178
    ],
    [
      33.1807,
      101.852,
      25.3186
    ],
    [
      9.4063,
      -35.5898,
      150.722
    ],
    [
      -9.5692,
      -34.3939,
      141.672
    ],
    [
      -9.4063,
      -35.5898,
      150.722
    ],
    [
      11.4565,
      -37.8994,
      150.722
    ],
    [
      -12.596,
      7.1655,
      88.741
    ],
    [
      -11.1691,
      -7.0037,
      99.3776
    ],
    [
      70.2365,
      62.8362,
      -3.9475
    ],
    [
      47.2634,
      54.294,
      -27.4148
    ],
    [
      28.7302,
      91.7311,
      -24.9726
    ],
    [
      69.1676,
      6.5862,
      -12.7757
    ],
    [
      28.7302,
      49.1003,
      -48.3596
    ],
    [
      31.903,
      5.692,
      -47.822
    ],
    [
      35.0758,
      -34.4329,
      -16.2809
    ],
    [
      115.2841,
      48.6815,
      48.6841
    ],
    [
      110.8428,
      28.4821,
      49.1762
    ],
    [
      -19.1243,
      -69.0168,
      49.4201
    ],
    [
      -38.2486,
      -66.2756,
      17.7762
    ],
    [
      -111.0246,
      52.6046,
      46.2259
    ],
    [
      -72.1133,
      35.4918,
      30.8714
    ],
    [
      -66.192,
      80.898,
      55.3943
    ],
    [
      -114.025,
      87.6733,
      58.9818
    ],
    [
      -97.8045,
      116.561,
      73.9788
    ],
    [
      -52.6089,
      30.3641,
      42.5561
    ],
    [
      -16.7623,
      58.0109,
      58.0782
    ],
    [
      -106.8814,
      31.9455,
      46.9133
    ],
    [
      -108.6633,
      43.2332,
      46.3154
    ],
    [
      -113.4846,
      38.6049,
      49.1215
    ],
    [
      -101.2166,
      15.9822,
      46.3082
    ],
    [
      -16.6605,
      -16.2883,
      93.6187
    ],
    [
      -23.9269,
      -2.5103,
      86.7365
    ],
    [
      -40.775,
      -10.2288,
      85.2764
    ],
    [
      -61.1809,
      8.8142,
      76.9968
    ],
    [
      -39.7195,
      -28.9271,
      88.9638
    ],
    [
      -14.8446,
      -52.6096,
      140.113
    ],
    [
      -15.2674,
      -62.32,
      129.688
    ],
    [
      -47.4625,
      -68.6061,
      63.3697
    ],
    [
      -35.6042,
      -71.758,
      81.0639
    ],
    [
      -38.2486,
      -64.7302,
      38.9099
    ],
    [
      -17.8021,
      -71.758,
      81.0639
    ],
    [
      -12.8928,
      -36.7035,
      141.672
    ],
    [
      -67.7668,
      -30.197,
      78.4178
    ],
    [
      -122.118,
      -36.8894,
      35.025
    ],
    [
      -109.284,
      -93.5899,
      27.8243
    ],
    [
      -33.1807,
      101.852,
      25.3186
    ],
    [
      -11.4565,
      -37.8994,
      150.722
    ],
    [
      -70.2365,
      62.8362,
      -3.9475
    ],
    [
      -28.7302,
      91.7311,
      -24.9726
    ],
    [
      -47.2634,
      54.294,
      -27.4148
    ],
    [
      -69.1676,
      6.5862,
      -12.7757
    ],
    [
      -28.7302,
      49.1003,
      -48.3596
    ],
    [
      -31.903,
      5.692,
      -47.822
    ],
    [
      -35.0758,
      -34.4329,
      -16.2809
    ],
    [
      -115.2841,
      48.6815,
      48.6841
    ],
    [
      -110.8428,
      28.4821,
      49.1762
    ]
  ],
  "chunks": [
    {
      "color": [
        246,
        133,
        27
      ],
      "faces": [
        [
          17,
          33,
          10
        ],
        [
          17,
          18,
          34
        ],
        [
          34,
          33,
          17
        ],
        [
          10,
          6,
          17
        ],
        [
          11,
          15,
          31
        ],
        [
          31,
          18,
          11
        ],
        [
          18,
          12,
          11
        ],
        [
          14,
          16,
          40
        ],
        [
          40,
          41,
          14
        ],
        [
          59,
          5,
          35
        ],
        [
          35,
          79,
          59
        ],
        [
          67,
          63,
          77
        ],
        [
          67,
          77,
          76
        ],
        [
          76,
          68,
          67
        ],
        [
          63,
          67,
          58
        ],
        [
          64,
          68,
          75
        ],
        [
          75,
          37,
          64
        ],
        [
          68,
          64,
          66
        ],
        [
          14,
          41,
          37
        ],
        [
          37,
          15,
          14
        ],
        [
          5,
          59,
          40
        ],
        [
          40,
          16,
          5
        ]
      ]
    },
    {
      "color": [
        228,
        118,
        27
      ],
      "faces": [
        [
          31,
          24,
          18
        ],
        [
          6,
          5,
          16
        ],
        [
          16,
          17,
          6
        ],
        [
          24,
          32,
          33
        ],
        [
          33,
          34,
          24
        ],
        [
          5,
          4,
          35
        ],
        [
          75,
          68,
          71
        ],
        [
          58,
          67,
          40
        ],
        [
          40,
          59,
          58
        ],
        [
          71,
          76,
          77
        ],
        [
          77,
          78,
          71
        ]
      ]
    },
    {
      "color": [
        118,
        61,
        22
      ],
      "faces": [
        [
          0,
          1,
          2
        ],
        [
          2,
          3,
          0
        ],
        [
          4,
          5,
          2
        ],
        [
          6,
          3,
          2
        ],
        [
          2,
          5,
          6
        ],
        [
          7,
          8,
          9
        ],
        [
          10,
          3,
          6
        ],
        [
          10,
          50,
          7
        ],
        [
          7,
          3,
          10
        ],
        [
          7,
          9,
          3
        ],
        [
          49,
          0,
          9
        ],
        [
          3,
          9,
          0
        ],
        [
          53,
          54,
          55
        ],
        [
          55,
          56,
          53
        ],
        [
          57,
          56,
          55
        ],
        [
          58,
          59,
          55
        ],
        [
          55,
          54,
          58
        ],
        [
          60,
          61,
          62
        ],
        [
          63,
          58,
          54
        ],
        [
          63,
          60,
          89
        ],
        [
          60,
          63,
          54
        ],
        [
          60,
          54,
          61
        ],
        [
          88,
          61,
          53
        ],
        [
          54,
          53,
          61
        ],
        [
          2,
          1,
          4
        ],
        [
          55,
          59,
          57
        ]
      ]
    },
    {
      "color": [
        22,
        22,
        22
      ],
      "faces": [
        [
          36,
          15,
          37
        ],
        [
          37,
          38,
          36
        ],
        [
          31,
          39,
          22
        ],
        [
          22,
          21,
          31
        ],
        [
          31,
          15,
          36
        ],
        [
          36,
          39,
          31
        ],
        [
          75,
          69,
          26
        ],
        [
          26,
          80,
          75
        ],
        [
          75,
          80,
          38
        ],
        [
          38,
          37,
          75
        ],
        [
          38,
          80,
          39
        ],
        [
          39,
          36,
          38
        ],
        [
          39,
          80,
          26
        ],
        [
          26,
          22,
          39
        ]
      ]
    },
    {
      "color": [
        215,
        193,
        179
      ],
      "faces": [
        [
          21,
          20,
          24
        ],
        [
          24,
          31,
          21
        ],
        [
          69,
          71,
          70
        ],
        [
          71,
          69,
          75
        ]
      ]
    },
    {
      "color": [
        192,
        173,
        158
      ],
      "faces": [
        [
          19,
          20,
          21
        ],
        [
          21,
          22,
          19
        ],
        [
          20,
          19,
          23
        ],
        [
          23,
          24,
          20
        ],
        [
          23,
          25,
          24
        ],
        [
          19,
          22,
          26
        ],
        [
          26,
          27,
          19
        ],
        [
          23,
          28,
          29
        ],
        [
          23,
          29,
          30
        ],
        [
          25,
          23,
          30
        ],
        [
          29,
          51,
          52
        ],
        [
          52,
          30,
          29
        ],
        [
          27,
          26,
          69
        ],
        [
          69,
          70,
          27
        ],
        [
          70,
          71,
          72
        ],
        [
          72,
          27,
          70
        ],
        [
          72,
          71,
          73
        ],
        [
          51,
          74,
          72
        ],
        [
          52,
          51,
          72
        ],
        [
          73,
          52,
          72
        ],
        [
          19,
          27,
          74
        ],
        [
          74,
          28,
          19
        ],
        [
          51,
          29,
          28
        ],
        [
          28,
          74,
          51
        ],
        [
          74,
          27,
          72
        ],
        [
          28,
          23,
          19
        ]
      ]
    },
    {
      "color": [
        205,
        97,
        22
      ],
      "faces": [
        [
          24,
          34,
          18
        ],
        [
          16,
          13,
          12
        ],
        [
          12,
          17,
          16
        ],
        [
          13,
          16,
          11
        ],
        [
          71,
          68,
          76
        ],
        [
          40,
          67,
          66
        ],
        [
          66,
          65,
          40
        ],
        [
          65,
          64,
          40
        ]
      ]
    },
    {
      "color": [
        35,
        52,
        71
      ],
      "faces": [
        [
          11,
          12,
          13
        ],
        [
          64,
          65,
          66
        ]
      ]
    },
    {
      "color": [
        228,
        117,
        31
      ],
      "faces": [
        [
          14,
          15,
          11
        ],
        [
          11,
          16,
          14
        ],
        [
          17,
          12,
          18
        ],
        [
          41,
          64,
          37
        ],
        [
          67,
          68,
          66
        ]
      ]
    },
    {
      "color": [
        226,
        118,
        27
      ],
      "faces": [
        [
          35,
          4,
          42
        ],
        [
          4,
          1,
          42
        ],
        [
          42,
          43,
          44
        ],
        [
          44,
          35,
          42
        ],
        [
          45,
          43,
          42
        ],
        [
          42,
          10,
          45
        ],
        [
          30,
          32,
          24
        ],
        [
          24,
          25,
          30
        ],
        [
          30,
          33,
          32
        ],
        [
          33,
          30,
          10
        ],
        [
          44,
          43,
          46
        ],
        [
          43,
          45,
          47
        ],
        [
          47,
          46,
          43
        ],
        [
          48,
          47,
          45
        ],
        [
          45,
          30,
          48
        ],
        [
          30,
          45,
          10
        ],
        [
          49,
          42,
          0
        ],
        [
          8,
          7,
          42
        ],
        [
          50,
          42,
          7
        ],
        [
          50,
          10,
          42
        ],
        [
          1,
          0,
          42
        ],
        [
          42,
          9,
          8
        ],
        [
          42,
          49,
          9
        ],
        [
          64,
          41,
          40
        ],
        [
          57,
          59,
          79
        ],
        [
          79,
          81,
          57
        ],
        [
          57,
          81,
          56
        ],
        [
          82,
          79,
          35
        ],
        [
          35,
          44,
          82
        ],
        [
          81,
          79,
          82
        ],
        [
          82,
          83,
          81
        ],
        [
          84,
          63,
          81
        ],
        [
          81,
          83,
          84
        ],
        [
          44,
          46,
          85
        ],
        [
          85,
          82,
          44
        ],
        [
          52,
          73,
          71
        ],
        [
          71,
          78,
          52
        ],
        [
          52,
          78,
          77
        ],
        [
          77,
          63,
          52
        ],
        [
          82,
          85,
          83
        ],
        [
          83,
          85,
          86
        ],
        [
          86,
          84,
          83
        ],
        [
          87,
          52,
          84
        ],
        [
          84,
          86,
          87
        ],
        [
          52,
          63,
          84
        ],
        [
          88,
          53,
          81
        ],
        [
          62,
          81,
          60
        ],
        [
          89,
          60,
          81
        ],
        [
          89,
          81,
          63
        ],
        [
          56,
          81,
          53
        ],
        [
          81,
          62,
          61
        ],
        [
          81,
          61,
          88
        ],
        [
          48,
          87,
          86
        ],
        [
          86,
          47,
          48
        ],
        [
          47,
          86,
          85
        ],
        [
          85,
          46,
          47
        ],
        [
          48,
          30,
          52
        ],
        [
          52,
          87,
          48
        ]
      ]
    }
  ]
}

},{}],3:[function(require,module,exports){
const foxJson = require('./fox.json')
const {
  calculateSizingOptions,
  createLogoViewer,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
} = require('./util.js')

module.exports = createLogo

function createLogo (options = {}) {
  const cameraDistance = options.cameraDistance || 400
  const { height, width } = calculateSizingOptions(options)

  const container = createNode('svg')
  setAttribute(container, 'width', `${width}px`)
  setAttribute(container, 'height', `${height}px`)
  document.body.appendChild(container)

  const modelObj = loadModelFromJson(foxJson)
  const renderFox = createModelRenderer(container, cameraDistance, modelObj)
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect()
    renderFox(rect, lookCurrent, slowDrift)
  }

  return createLogoViewer(container, renderScene, { cameraDistance, ...options })
}

},{"./fox.json":2,"./util.js":13}],4:[function(require,module,exports){
'use strict';

var deselectCurrent = require('toggle-selection');

var defaultMessage = 'Copy to clipboard: #{key}, Enter';

function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text, options) {
  var debug, message, reselectPrevious, range, selection, mark, success = false;
  if (!options) { options = {}; }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement('span');
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = 'unset';
    // prevents scrolling to the end of the page
    mark.style.position = 'fixed';
    mark.style.top = 0;
    mark.style.clip = 'rect(0, 0, 0, 0)';
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = 'pre';
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = 'text';
    mark.style.MozUserSelect = 'text';
    mark.style.msUserSelect = 'text';
    mark.style.userSelect = 'text';

    document.body.appendChild(mark);

    range.selectNode(mark);
    selection.addRange(range);

    var successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('copy command was unsuccessful');
    }
    success = true;
  } catch (err) {
    debug && console.error('unable to copy using execCommand: ', err);
    debug && console.warn('trying IE specific stuff');
    try {
      window.clipboardData.setData('text', text);
      success = true;
    } catch (err) {
      debug && console.error('unable to copy using clipboardData: ', err);
      debug && console.error('falling back to prompt');
      message = format('message' in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == 'function') {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }

  return success;
}

module.exports = copy;

},{"toggle-selection":12}],5:[function(require,module,exports){
module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],6:[function(require,module,exports){
module.exports = invert;

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};
},{}],7:[function(require,module,exports){
var identity = require('./identity');

module.exports = lookAt;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};
},{"./identity":5}],8:[function(require,module,exports){
module.exports = multiply;

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};
},{}],9:[function(require,module,exports){
module.exports = perspective;

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
},{}],10:[function(require,module,exports){
module.exports = rotate;

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};
},{}],11:[function(require,module,exports){
module.exports = transformMat4;

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15]
    w = w || 1.0
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    return out
}
},{}],12:[function(require,module,exports){

module.exports = function () {
  var selection = document.getSelection();
  if (!selection.rangeCount) {
    return function () {};
  }
  var active = document.activeElement;

  var ranges = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' &&
    selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }

    active &&
    active.focus();
  };
};

},{}],13:[function(require,module,exports){
const perspective = require('gl-mat4/perspective')
const multiply = require('gl-mat4/multiply')
const lookAt = require('gl-mat4/lookAt')
const invert = require('gl-mat4/invert')
const rotate = require('gl-mat4/rotate')
const transform = require('gl-vec3/transformMat4')

const SVG_NS = 'http://www.w3.org/2000/svg'

module.exports = {
  calculateSizingOptions,
  createLogoViewer,
  createModelRenderer,
  loadModelFromJson,
  positionsFromModel,
  createPolygonsFromModelJson,
  createStandardModelPolygon,
  createMatrixComputer,
  compareZ,
  createFaceUpdater,
  createNode,
  setAttribute,
  svgElementToSvgImageContent,
  Polygon,
}

function createLogoViewer (container, renderScene, {
  followMouse = false,
  followMotion = false,
  slowDrift = false,
  lazyRender = true,
} = {}) {

  let shouldRender = true
  const mouse = {
    x: 0,
    y: 0,
  }
  const lookCurrent = [0, 0]
  const lookRate = 0.3

  // closes over scene state
  const renderCurrentScene = () => {
    updateLookCurrent()
    renderScene(lookCurrent, slowDrift)
  }

  function setLookAtTarget (target) {
    const bounds = container.getBoundingClientRect()
    mouse.x = 1.0 - ((2.0 * (target.x - bounds.left)) / bounds.width)
    mouse.y = 1.0 - ((2.0 * (target.y - bounds.top)) / bounds.height)
  }

  function stopAnimation () {
    shouldRender = false
  }
  function startAnimation () {
    shouldRender = true
  }
  function setFollowMouse (state) {
    followMouse = state
  }
  function setFollowMotion (state) {
    followMotion = state
  }

  window.addEventListener('mousemove', function (ev) {
    if (!shouldRender) {
      startAnimation()
    }
    if (followMouse) {
      setLookAtTarget({
        x: ev.clientX,
        y: ev.clientY,
      })
      renderCurrentScene()
    }
  })

  window.addEventListener('deviceorientation', function (event) {
    if (!shouldRender) {
      startAnimation()
    }
    if (followMotion) {
      // gamma: left to right
      const leftToRight = event.gamma
      // beta: front back motion
      const frontToBack = event.beta
      // x offset: needed to correct the intial position
      const xOffset = 200
      // y offset: needed to correct the intial position
      const yOffset = -300
      // acceleration
      const acceleration = 10

      setLookAtTarget({
        x: xOffset + (leftToRight * acceleration),
        y: yOffset + (frontToBack * acceleration),
      })
      renderCurrentScene()
    }
  })

  function lookAtAndRender (target) {
    // update look target
    setLookAtTarget(target)
    // this should prolly just call updateLookCurrent or set lookCurrent values to eaxactly lookTarget
    // but im not really sure why its different, so im leaving it alone
    lookCurrent[0] = mouse.x
    lookCurrent[1] = mouse.y + (0.085 / lookRate)
    renderCurrentScene()
  }

  function renderLoop () {
    if (!shouldRender) {
      return
    }
    window.requestAnimationFrame(renderLoop)
    renderCurrentScene()
  }

  function updateLookCurrent () {
    const li = (1.0 - lookRate)
    lookCurrent[0] = (li * lookCurrent[0]) + (lookRate * mouse.x)
    lookCurrent[1] = (li * lookCurrent[1]) + (lookRate * mouse.y) + 0.085
  }

  if (lazyRender) {
    renderCurrentScene()
  } else {
    renderLoop()
  }

  return {
    container,
    lookAt: setLookAtTarget,
    setFollowMouse,
    setFollowMotion,
    stopAnimation,
    startAnimation,
    lookAtAndRender,
    renderCurrentScene,
  }
}

function loadModelFromJson (modelJson, createSvgPolygon = createStandardModelPolygon) {
  const vertCount = modelJson.positions.length
  const positions = new Float32Array(3 * vertCount)
  const transformed = new Float32Array(3 * vertCount)
  const { polygons, polygonsByChunk } = createPolygonsFromModelJson(modelJson, createSvgPolygon)
  positionsFromModel(positions, modelJson)
  const updatePositions = createPositionUpdater(positions, transformed, vertCount)
  const modelObj = { updatePositions, positions, transformed, polygons, polygonsByChunk }
  return modelObj
}

function createModelRenderer (container, cameraDistance, modelObj) {
  const { updatePositions, transformed, polygons } = modelObj

  for (const polygon of polygons) {
    container.appendChild(polygon.svg)
  }

  const computeMatrix = createMatrixComputer(cameraDistance)
  const updateFaces = createFaceUpdater(container, polygons, transformed)

  return (rect, lookPos, slowDrift) => {
    const matrix = computeMatrix(rect, lookPos, slowDrift)
    updatePositions(matrix)
    updateFaces(rect, container, polygons, transformed)
  }
}

function positionsFromModel (positions, modelJson) {
  const pp = modelJson.positions
  let ptr = 0
  for (let i = 0; i < pp.length; ++i) {
    const p = pp[i]
    for (let j = 0; j < 3; ++j) {
      positions[ptr] = p[j]
      ptr += 1
    }
  }
}

function createPolygonsFromModelJson (modelJson, createSvgPolygon) {
  const polygons = []
  const polygonsByChunk = modelJson.chunks.map((chunk) => {
    const { faces } = chunk
    return faces.map((face) => {
      const svgPolygon = createSvgPolygon(chunk)
      const polygon = new Polygon(svgPolygon, face)
      polygons.push(polygon)
      return polygon
    })
  })
  return { polygons, polygonsByChunk }
}

function createStandardModelPolygon (chunk) {
  const color = `rgb(${chunk.color})`
  const svgPolygon = createNode('polygon')
  setAttribute(
    svgPolygon,
    'fill',
    color,
  )
  setAttribute(
    svgPolygon,
    'stroke',
    color,
  )
  setAttribute(
    svgPolygon,
    'points',
    '0,0, 10,0, 0,10',
  )
  return svgPolygon
}

function createMatrixComputer (distance) {
  const objectCenter = new Float32Array(3)
  const up = new Float32Array([0, 1, 0])
  const projection = new Float32Array(16)
  const model = new Float32Array(16)
  const view = lookAt(
    new Float32Array(16),
    new Float32Array([0, 0, distance]),
    objectCenter,
    up,
  )
  const invView = invert(new Float32Array(16), view)
  const invProjection = new Float32Array(16)
  const target = new Float32Array(3)
  const transformedMatrix = new Float32Array(16)

  const X = new Float32Array([1, 0, 0])
  const Y = new Float32Array([0, 1, 0])
  const Z = new Float32Array([0, 0, 1])

  return (rect, lookPos, slowDrift) => {
    const viewportWidth = rect.width
    const viewportHeight = rect.height
    perspective(
      projection,
      Math.PI / 4.0,
      viewportWidth / viewportHeight,
      100.0,
      1000.0,
    )
    invert(invProjection, projection)
    target[0] = lookPos[0]
    target[1] = lookPos[1]
    target[2] = 1.2
    transform(target, target, invProjection)
    transform(target, target, invView)
    lookAt(
      model,
      objectCenter,
      target,
      up,
    )

    // this shouldnt operate directly on the matrix/model,
    // it should likely operate on the lookPos
    // if we do want to operate on the matrix/model, it shouldnt happen here
    if (slowDrift) {
      const time = (Date.now() / 1000.0)
      rotate(model, model, 0.1 + (Math.sin(time / 3) * 0.2), X)
      rotate(model, model, -0.1 + (Math.sin(time / 2) * 0.03), Z)
      rotate(model, model, 0.5 + (Math.sin(time / 3) * 0.2), Y)
    }

    multiply(transformedMatrix, projection, view)
    multiply(transformedMatrix, transformedMatrix, model)

    return transformedMatrix
  }
}

function createPositionUpdater (positions, transformed, vertCount) {
  return (M) => {
    const m00 = M[0]
    const m01 = M[1]
    const m02 = M[2]
    const m03 = M[3]
    const m10 = M[4]
    const m11 = M[5]
    const m12 = M[6]
    const m13 = M[7]
    const m20 = M[8]
    const m21 = M[9]
    const m22 = M[10]
    const m23 = M[11]
    const m30 = M[12]
    const m31 = M[13]
    const m32 = M[14]
    const m33 = M[15]

    for (let i = 0; i < vertCount; ++i) {
      const x = positions[3 * i]
      const y = positions[(3 * i) + 1]
      const z = positions[(3 * i) + 2]

      const tw = (x * m03) + (y * m13) + (z * m23) + m33
      transformed[3 * i] =
        ((x * m00) + (y * m10) + (z * m20) + m30) / tw
      transformed[(3 * i) + 1] =
        ((x * m01) + (y * m11) + (z * m21) + m31) / tw
      transformed[(3 * i) + 2] =
        ((x * m02) + (y * m12) + (z * m22) + m32) / tw
    }
  }
}

function compareZ (a, b) {
  return b.zIndex - a.zIndex
}

function createFaceUpdater (container, polygons, transformed) {
  const toDraw = []
  return (rect) => {
    let i
    const w = rect.width
    const h = rect.height
    toDraw.length = 0
    for (i = 0; i < polygons.length; ++i) {
      const poly = polygons[i]
      const { indices } = poly

      const i0 = indices[0]
      const i1 = indices[1]
      const i2 = indices[2]
      const ax = transformed[3 * i0]
      const ay = transformed[(3 * i0) + 1]
      const bx = transformed[3 * i1]
      const by = transformed[(3 * i1) + 1]
      const cx = transformed[3 * i2]
      const cy = transformed[(3 * i2) + 1]
      const det = ((bx - ax) * (cy - ay)) - ((by - ay) * (cx - ax))
      if (det < 0) {
        continue
      }

      const points = []
      let zmax = -Infinity
      let zmin = Infinity
      const element = poly.svg
      for (let j = 0; j < 3; ++j) {
        const idx = indices[j]
        points.push(
          `${0.5 * w * (1.0 - transformed[3 * idx])},${
            0.5 * h * (1.0 - transformed[(3 * idx) + 1])}`,
        )
        const z = transformed[(3 * idx) + 2]
        zmax = Math.max(zmax, z)
        zmin = Math.min(zmin, z)
      }
      poly.zIndex = zmax + (0.25 * zmin)
      const joinedPoints = points.join(' ')

      if (joinedPoints.indexOf('NaN') === -1) {
        setAttribute(element, 'points', joinedPoints)
      }

      toDraw.push(poly)
    }
    toDraw.sort(compareZ)
    container.innerHTML = ''
    for (i = 0; i < toDraw.length; ++i) {
      container.appendChild(toDraw[i].svg)
    }
  }
}

function calculateSizingOptions (options = {}) {
  let width = options.width || 400
  let height = options.height || 400

  if (!options.pxNotRatio) {
    width = (window.innerWidth * (options.width || 0.25)) | 0
    height = ((window.innerHeight * options.height) || width) | 0

    if ('minWidth' in options && width < options.minWidth) {
      width = options.minWidth
      height = (options.minWidth * options.height / options.width) | 0
    }
  }
  return { width, height }
}

function createNode (type) {
  return document.createElementNS(SVG_NS, type)
}

function setAttribute (node, attribute, value) {
  node.setAttributeNS(null, attribute, value)
}

function svgElementToSvgImageContent (svgElement) {
  const inner = svgElement.innerHTML
  const head = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> ` +
  `<svg width="521px" height="521px" version="1.1" baseProfile="full" xmlns="${SVG_NS}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">`
  const foot = '</svg>'
  const content = head + inner + foot
  return content
}

function Polygon (svg, indices) {
  this.svg = svg
  this.indices = indices
  this.zIndex = 0
}

},{"gl-mat4/invert":6,"gl-mat4/lookAt":7,"gl-mat4/multiply":8,"gl-mat4/perspective":9,"gl-mat4/rotate":10,"gl-vec3/transformMat4":11}]},{},[1]);
