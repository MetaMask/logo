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

async function main() {
  const { argv } = yargs(hideBin(process.argv))
    .usage(
      '$0 [options]',
      'Convert Maya .obj and .mtl files into our JSON model format.',
      (_yargs) =>
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
          }),
    )
    .version(false)
    .strict();

  const { out: outputFilename, obj: objFilename, mtl: mtlFilename } = argv;

  const [objContents, mtlContents] = await Promise.all([
    fs.readFile(objFilename, 'utf8'),
    fs.readFile(mtlFilename, 'utf8'),
  ]);

  const mtl = parseMTL(mtlContents);
  const objFile = new OBJFile(objContents);
  const data = objFile.parse(objFile);

  const output = {
    positions: [],
    chunks: [],
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

  for (const mtlKey of Object.keys(mtl)) {
    const m = mtl[mtlKey];

    if (m.Ka) {
      const color = m.Kd.map(function (c) {
        return Math.floor(255 * c);
      });
      m.Kd.forEach((c, i) => {
        if (color[i] === 0) {
          color[i] = Math.floor(255 * c);
        }
      });

      const chunk = {
        color,
        faces: [],
      };

      model.faces.forEach((f) => {
        // Only if this face matches the material!
        if (f.material === mtlKey) {
          chunk.faces.push([
            f.vertices[0][VI] - 1,
            f.vertices[1][VI] - 1,
            f.vertices[2][VI] - 1,
          ]);
        }
      });

      output.chunks.push(chunk);
    } else {
      throw new Error(`Invalid MTL entry at key '${mtlKey}'`);
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
