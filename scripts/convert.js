const fs = require('fs').promises;
const path = require('path');
const { strict: assert } = require('assert');
const OBJFile = require('obj-file-parser');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const prettier = require('prettier');
const { parse } = require('svg-parser');

/**
 * Parse a material settings file. Each material is returned as a
 * separate entry.
 *
 * @param {string} mtl - The contents of a material settings file.
 * @returns A map of material names to properties.
 */
function parseMTL(mtl) {
  const output = {};
  mtl
    .split('newmtl ')
    .slice(1)
    .forEach(function (block) {
      const lines = block.split('\n');
      const label = lines[0];
      const props = {};
      lines.slice(1).forEach(function (line) {
        // Only a constant illumination model (illum 0) is supported
        if (line.indexOf('illum') === 0) {
          if (!line.startsWith('illum 0')) {
            throw new Error(
              `Only 'illum 0' supported in MTL files, received '${line}'`,
            );
          }
          return;
        }

        const toks = line.split(/\s+/u);
        const lineLabel = toks[0];
        const data = toks.slice(1);
        if (data.length === 1) {
          props[lineLabel] = Number(data[0]);
        } else {
          props[lineLabel] = data.map(function (x) {
            return Number(x);
          });
        }
      });
      output[label] = props;
    });

  return output;
}

/**
 * This is a list of simple and distinct colors. These are used to help identify chunks of the
 * model.
 *
 * These were taken from this blog post: https://sashamaps.net/docs/resources/20-colors/
 */
const distinctiveColors = {
  red: [230, 25, 75],
  green: [60, 180, 75],
  yellow: [255, 255, 25],
  blue: [67, 99, 216],
  orange: [245, 130, 49],
  purple: [145, 30, 180],
  cyan: [66, 212, 244],
  magenta: [240, 50, 230],
  lime: [191, 239, 69],
  pink: [250, 190, 212],
  teal: [70, 153, 144],
  lavender: [220, 190, 255],
  brown: [154, 99, 36],
  beige: [255, 250, 200],
  maroon: [128, 0, 0],
  mint: [170, 255, 195],
  olive: [128, 128, 0],
  apricot: [255, 216, 177],
  navy: [0, 0, 117],
  grey: [169, 169, 169],
  white: [255, 255, 255],
  black: [0, 0, 0],
};

/**
 * Get a color for the given index.
 *
 * @param {number} index - The index of the color to get.
 */
function getColor(index) {
  const distinctiveColorNames = Object.keys(distinctiveColors);
  return distinctiveColorNames[index % distinctiveColorNames.length];
}

const usageDescription = `Convert Maya .obj and .mtl files into our JSON model format.

The polygons in the model are divided into chunks according to the material (i.e. the color) of \
each polygon. The output JSON model includes a list of vertex positions, and a list of chunks of \
polygons.`;

const contiguousOptionDescription = `Set whether the chunks in the output JSON model file should \
be contiguous. If unset, the pieces in each chunk might not be connected. If set, the chunks are \
fully connected, but there will be more chunks overall.`;

async function main() {
  const { argv } = yargs(hideBin(process.argv))
    .usage('$0 [options]', usageDescription, (_yargs) =>
      _yargs
        .option('out', {
          default: path.resolve(__dirname, '../data/fox.json'),
          description: 'The output file path',
          type: 'string',
          normalize: true,
        })
        .option('obj', {
          default: path.resolve(__dirname, '../data/fox.obj'),
          description: 'The input OBJ file path',
          type: 'string',
          normalize: true,
        })
        .option('mtl', {
          default: path.resolve(__dirname, '../data/fox.mtl'),
          description: 'The input MTL file path',
          type: 'string',
          normalize: true,
        })
        .option('gradient', {
          description:
            'The file path for an SVG file to take gradient definitions from',
          type: 'string',
          normalize: true,
        })
        .option('contiguous', {
          default: false,
          description: contiguousOptionDescription,
          type: 'boolean',
        })
        .option('repaint', {
          default: false,
          description:
            'Color and label each chunk with a distinctive color. This can makes chunks easier to identify.',
          type: 'boolean',
        })
        .option('scale', {
          default: 1,
          description: 'Apply a scaling factor to the input model',
          type: 'number',
        })
        .option('translateX', {
          default: 0,
          description: 'Apply a translation to the model in the X axis',
          type: 'number',
        })
        .option('translateY', {
          default: 0,
          description: 'Apply a translation to the model in the Y axis',
          type: 'number',
        })
        .option('translateZ', {
          default: 0,
          description: 'Apply a translation to the model in the Z axis',
          type: 'number',
        }),
    )
    .version(false)
    .strict();

  const {
    contiguous,
    gradient,
    out: outputFilename,
    obj: objFilename,
    mtl: mtlFilename,
    repaint,
    scale,
    translateX,
    translateY,
    translateZ,
  } = argv;

  const [objContents, mtlContents, gradientSvgContents] = await Promise.all([
    fs.readFile(objFilename, 'utf8'),
    fs.readFile(mtlFilename, 'utf8'),
    gradient ? fs.readFile(gradient, 'utf8') : null,
  ]);

  const mtl = parseMTL(mtlContents);
  const objFile = new OBJFile(objContents);
  const data = objFile.parse(objFile);

  /**
   * A single position in 3D space. A position is represented by a tuple of X, Y, and Z
   * coordinates.
   *
   * @typedef {[number, number, number]} Position
   */

  /**
   * An RGB color. The color is represented by a tuple of 3 numbers, which are the red, blue, and
   * green values. Each value is an integer between 0 and 255.
   *
   * @typedef {[number, number, number]} RgbColor
   */

  /**
   * One face of the model. Each face is a triangle, and is represented by three vertices. Each
   * vertex is present in the model's `position` array, and is represented as an index of this
   * array.
   *
   * @typedef {[number, number, number]} Face
   */

  /**
   * A set of faces with the same color.
   *
   * @typedef {object} Chunk
   * @property {RgbColor} color - The color of the chunk.
   * @property {Array<Face>} faces - The faces included in this chunk.
   */

  /**
   * A JSON representation of a 3D model.
   *
   * @typedef Model
   * @property {Array<Position>} positions - The vertex positions of the model.
   * @property {Array<Chunk>} chunks - Sets of faces that share a common color.
   * @property {Array<object>} [gradients] - Gradient definitions (see the types defined in `util.js`
   * for details)
   */

  /**
   * @type {Partial<Model>}
   */
  const output = {
    positions: [],
  };

  const model = data.models[0];
  model.vertices.forEach((v) => {
    output.positions.push([
      (v.x + translateX) * scale,
      (v.y + translateY) * scale,
      (v.z + translateZ) * scale,
    ]);
  });

  const allChunks = [];
  for (const mtlKey of Object.keys(mtl)) {
    const m = mtl[mtlKey];
    if (!m.Kd) {
      throw new Error(`Invalid MTL entry at key '${mtlKey}'`);
    }

    const color = m.Kd.map(function (c) {
      return Math.floor(255 * c);
    });
    m.Kd.forEach((c, i) => {
      if (color[i] === 0) {
        color[i] = Math.floor(255 * c);
      }
    });

    let currentChunks = [];
    model.faces.forEach((f, index) => {
      // Skip faces that don't match the current color
      if (f.material !== mtlKey) {
        return;
      }

      if (f.vertices.length < 3 || f.vertices.length > 4) {
        throw new Error(`Invalid number of vertices: ${f.vertices.length}`);
      }

      const rawVertices = f.vertices.map((vertex) => vertex.vertexIndex - 1);

      // Currently the runtime code only supports triangles. Four-sided polygons are split here
      // into two trianges.
      const triangleVertices =
        rawVertices.length === 3
          ? [rawVertices]
          : [
              rawVertices.slice().toSpliced(3, 1),
              rawVertices.slice().toSpliced(1, 1),
            ];

      for (const currentVertices of triangleVertices) {
        // A polygon represents a single face, including its index in the underlying model and its
        // vertices. This representation is used so that we can preserve the polygon order within
        // each chunk.
        const polygon = { index, vertices: currentVertices };

        // Non-contiguous chunks contain all polygons of a given color
        if (!contiguous) {
          if (currentChunks.length) {
            currentChunks[0].polygons.push(polygon);
          } else {
            currentChunks.push({
              color,
              polygons: [polygon],
              materialName: mtlKey,
            });
          }
          continue;
        }

        // Search the current list of chunks for the current color that include an adjacent polygon.
        // A polygon is adjacent if it shares two vertices.
        const chunksWithAdjacentPolygons = currentChunks.filter((chunk) =>
          chunk.polygons.some(({ vertices }) => {
            const firstSharedVertexIndex = currentVertices.findIndex((vertex) =>
              vertices.includes(vertex),
            );
            const lastSharedVertexIndex = currentVertices.findIndex((vertex) =>
              vertices.includes(vertex),
            );
            return (
              firstSharedVertexIndex &&
              lastSharedVertexIndex &&
              firstSharedVertexIndex !== lastSharedVertexIndex
            );
          }),
        );

        let chunk;
        if (chunksWithAdjacentPolygons.length === 0) {
          // If no chunks with adjacent polygons are found, this polygon forms a new chunk
          chunk = { color, polygons: [] };
          currentChunks.push(chunk);
        } else if (chunksWithAdjacentPolygons.length === 1) {
          // If a single chunk with an adjacent polygon is found, this polygon joins that chunk.
          chunk = chunksWithAdjacentPolygons[0];
        } else {
          // If multiple chunks with an adjacent polygon are found, they are merged together before
          // adding the new polygon.
          chunk = chunksWithAdjacentPolygons[0];
          const chunksToMerge = chunksWithAdjacentPolygons.slice(1);
          for (const chunkToMerge of chunksToMerge) {
            chunk.polygons.push(...chunkToMerge.polygons);
          }

          currentChunks = currentChunks.filter(
            (_chunk) => !chunksToMerge.includes(_chunk),
          );
          // I don't know if order really matters here, but, it has been preserved just in case
          chunk.polygons.sort((faceA, faceB) => faceA.index - faceB.index);
        }

        chunk.polygons.push(polygon);
      }
    });
    allChunks.push(...currentChunks);
  }

  output.chunks = allChunks.map((chunk, index) => {
    const finalChunk = {
      color: chunk.color,
      // The final model includes just the vertices of each face. The index is not needed.
      faces: chunk.polygons.map(({ vertices }) => vertices),
    };

    if (repaint) {
      const colorName = getColor(index);
      finalChunk.name = colorName;
      finalChunk.color = distinctiveColors[colorName];
    }
    return finalChunk;
  });

  if (gradientSvgContents) {
    const svgRoot = parse(gradientSvgContents);
    assert.equal(svgRoot.children.length, 1);

    const svgElement = svgRoot.children[0];
    const { width, height } = svgElement.properties || {};
    assert.equal(typeof width, 'number');
    assert.equal(typeof height, 'number');

    const defsElements = svgElement.children.filter(
      (child) => child.tagName === 'defs',
    );
    assert.equal(defsElements.length, 1);
    const defsElement = defsElements[0];

    // Add padding to reflect that the 3D model has more padding than the SVG
    // These are percentages
    const leftPadding = 10;
    const rightPadding = 10;
    const topPadding = 10;
    const bottomPadding = 10;
    const xScalingRatio = (100 - leftPadding - rightPadding) / 100;
    const yScalingRatio = (100 - topPadding - bottomPadding) / 100;
    const xTranslation = leftPadding;
    const yTranslation = topPadding;

    const gradients = {};
    for (const child of defsElement.children) {
      if (child.tagName === 'linearGradient') {
        const linearGradient = { type: 'linear', stops: [] };
        let id;
        for (const propertyName of Object.keys(child.properties || {})) {
          const value = child.properties[propertyName];
          if (propertyName === 'id') {
            id = value;
          } else if (['x1', 'x2'].includes(propertyName)) {
            assert.equal(typeof value, 'number');
            const percentage =
              (value / width) * 100 * xScalingRatio + xTranslation;
            assert.ok(Number.isFinite(percentage));

            linearGradient[propertyName] = `${percentage}%`;
          } else if (['y1', 'y2'].includes(propertyName)) {
            assert.equal(typeof value, 'number');
            const percentage =
              (value / height) * 100 * yScalingRatio + yTranslation;
            assert.ok(Number.isFinite(percentage));
            linearGradient[propertyName] = `${percentage}%`;
          } else {
            linearGradient[propertyName] = value;
          }
        }
        assert.ok(id);
        const stopNodes = child.children.filter(
          (potentialStopNode) => potentialStopNode.tagName === 'stop',
        );
        for (const stopNode of stopNodes) {
          linearGradient.stops.push(stopNode.properties);
        }
        gradients[id] = linearGradient;
      } else if (child.tagName === 'radialGradient') {
        const radialGradient = { type: 'radial', stops: [] };
        let id;
        for (const propertyName of Object.keys(child.properties || {})) {
          const value = child.properties[propertyName];
          if (propertyName === 'id') {
            id = value;
          } else if (['cx', 'fr', 'fx', 'r'].includes(propertyName)) {
            assert.equal(typeof value, 'number');
            const percentage =
              (value / width) * 100 * xScalingRatio + xTranslation;
            assert.ok(Number.isFinite(percentage));
            radialGradient[propertyName] = `${percentage}%`;
          } else if (['cy', 'fy'].includes(propertyName)) {
            assert.equal(typeof value, 'number');
            const percentage =
              (value / height) * 100 * yScalingRatio + yTranslation;
            assert.ok(Number.isFinite(percentage));
            radialGradient[propertyName] = `${percentage}%`;
          } else {
            radialGradient[propertyName] = value;
          }
        }
        assert.ok(id);
        const stopNodes = child.children.filter(
          (potentialStopNode) => potentialStopNode.tagName === 'stop',
        );
        for (const stopNode of stopNodes) {
          radialGradient.stops.push(stopNode.properties);
        }
        gradients[id] = radialGradient;
      }
    }

    if (Object.keys(gradients).length > 0) {
      output.gradients = gradients;
    } else {
      console.warn('No gradients found');
    }
  }

  const stringifiedOutput = JSON.stringify(output, null, 2);
  const formattedOutput = prettier.format(stringifiedOutput, {
    filepath: outputFilename,
  });
  await fs.writeFile(outputFilename, formattedOutput);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
