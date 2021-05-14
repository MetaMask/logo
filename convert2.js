"use strict";
exports.__esModule = true;
var OBJFile = require('obj-file-parser');
var fs = require("fs");
var path = require("path");
var obj = fs.readFileSync("./fox.obj").toString();
var mtlRaw = fs.readFileSync("./fox.mtl").toString('utf8');
function parseMTL(mtl) {
    var output = {};
    mtl.split('newmtl ').slice(1).forEach(function (block) {
        var lines = block.split('\n');
        var label = lines[0];
        var props = {};
        lines.slice(1).forEach(function (line) {
            // Skip illum lines
            if (line.indexOf('illum') === 0) {
                return;
            }
            var toks = line.split(/\s+/);
            var label = toks[0];
            var data = toks.slice(1);
            if (data.length === 1) {
                props[label] = +data[0];
            }
            else {
                props[label] = data.map(function (x) {
                    return Math.sqrt(x).toPrecision(4);
                });
            }
        });
        output[label] = props;
    });
    return output;
}
var mtl = parseMTL(mtlRaw);
var objF = new OBJFile(obj);
var data = objF.parse(objF);
var outpath = path.join(__dirname, 'fox.json');
var output = {
    positions: [],
    chunks: []
};
/*

type colorValue = number; // 0-255
type positionId = number; // Index of that position
type CoordVal = number;

type Position = [CoordVal, CoordVal, CoordVal];
type Face = [positionId, positionId, positionId];

export type EfficientModel = {
  positions: Array<Position>;
  chunks: Array<{
    color: [colorValue, colorValue, colorValue];
    faces: Array<Face>;
  }>;
}

*/
var VI = 'vertexIndex';
var model = data.models[0];
model.vertices.forEach(function (v) {
    output.positions.push([v.x, v.y, v.z]);
});
var _loop_1 = function (mtlKey) {
    var m = mtl[mtlKey];
    if (!m.Ka) {
        console.log('PROBLEM with ' + mtlKey);
        console.dir(m);
    }
    else {
        var color_1 = m.Kd.map(function (c, i) {
            return (255 * c) | 0;
        });
        m.Kd.forEach(function (c, i) {
            if (color_1[i] === 0) {
                color_1[i] = (255 * c) | 0;
            }
        });
        var chunk_1 = {
            color: color_1,
            faces: []
        };
        model.faces.forEach(function (f) {
            // Only if this face matches the material!
            if (f.material === mtlKey) {
                chunk_1.faces.push([
                    f.vertices[0][VI] - 1,
                    f.vertices[1][VI] - 1,
                    f.vertices[2][VI] - 1,
                ]);
                console.log('we pushed some faces, eh?', chunk_1.faces);
            }
            else {
                console.log("I guess " + f.material + " !== " + mtlKey);
            }
        });
        output.chunks.push(chunk_1);
    }
};
for (var mtlKey in mtl) {
    _loop_1(mtlKey);
}
fs.writeFileSync(outpath, JSON.stringify(output, null, 2));
