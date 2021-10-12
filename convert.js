const fs = require('fs').promises;
const OBJFile = require('obj-file-parser');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const prettier = require('prettier');

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
        // Skip illum lines
        if (line.indexOf('illum') === 0) {
          return;
        }

        const toks = line.split(/\s+/u);
        const lineLabel = toks[0];
        const data = toks.slice(1);
        if (data.length === 1) {
          props[lineLabel] = Number(data[0]);
        } else {
          props[lineLabel] = data.map(function (x) {
            return Math.sqrt(x).toPrecision(4);
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
          default: 'fox.json',
          description: 'The output file path',
          type: 'string',
          normalize: true,
        })
        .option('obj', {
          default: 'fox.obj',
          description: 'The input OBJ file path',
          type: 'string',
          normalize: true,
        })
        .option('mtl', {
          default: 'fox.mtl',
          description: 'The input MTL file path',
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
        }),
    )
    .version(false)
    .strict();

  const {
    contiguous,
    out: outputFilename,
    obj: objFilename,
    mtl: mtlFilename,
    repaint,
  } = argv;

  const [objContents, mtlContents] = await Promise.all([
    fs.readFile(objFilename, 'utf8'),
    fs.readFile(mtlFilename, 'utf8'),
  ]);

  const mtl = parseMTL(mtlContents);
  const objFile = new OBJFile(objContents);
  const data = objFile.parse(objFile);

  const output = {
    positions: [],
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
  const VI = 'vertexIndex';

  const model = data.models[0];
  model.vertices.forEach((v) => {
    output.positions.push([v.x, v.y, v.z]);
  });

  const allChunks = [];
  for (const mtlKey of Object.keys(mtl)) {
    const m = mtl[mtlKey];
    if (!m.Ka) {
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
      if (f.material !== mtlKey) {
        return;
      }

      const xVertex = f.vertices[0][VI] - 1;
      const yVertex = f.vertices[1][VI] - 1;
      const zVertex = f.vertices[2][VI] - 1;

      const polygon = { index, vertices: [xVertex, yVertex, zVertex] };

      if (!contiguous) {
        if (currentChunks.length) {
          currentChunks[0].polygons.push(polygon);
        } else {
          currentChunks.push({ color, polygons: [polygon] });
        }
        return;
      }

      const chunksWithAdjacentPolygons = currentChunks.filter((chunk) =>
        chunk.polygons.some(
          ({ vertices }) =>
            (vertices.includes(xVertex) &&
              (vertices.includes(yVertex) || vertices.includes(zVertex))) ||
            (vertices.includes(yVertex) && vertices.includes(zVertex)),
        ),
      );

      let chunk;
      if (chunksWithAdjacentPolygons.length === 0) {
        chunk = { color, polygons: [] };
        currentChunks.push(chunk);
      } else if (chunksWithAdjacentPolygons.length === 1) {
        chunk = chunksWithAdjacentPolygons[0];
      } else {
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
    });
    allChunks.push(...currentChunks);
  }

  output.chunks = allChunks.map((chunk, index) => {
    const finalChunk = {
      color: chunk.color,
      faces: chunk.polygons.map(({ vertices }) => vertices),
    };

    if (repaint) {
      const colorName = getColor(index);
      finalChunk.name = colorName;
      finalChunk.color = distinctiveColors[colorName];
    }
    return finalChunk;
  });

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
