const path = require('path');
const { constants: fsConstants, promises: fs } = require('fs');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const execa = require('execa');

/**
 * An error resulting from incorrect usage.
 *
 * This error type is used to distinguish user errors from developer errors, so that the stack
 * trace can be omitted when it's not useful.
 */
class UsageError extends Error {}

/**
 *  Build a single demo.
 *
 * @param {string} demoName - The name of the demo.
 * @param {string} demoPath - The absolute path to the demo JavaScript file.
 */
async function buildDemo(demoName, demoPath) {
  const demoDirectoryPath = path.resolve(__dirname, '..', 'docs', demoName);

  try {
    fs.access(demoDirectoryPath, fsConstants.W_OK);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(demoDirectoryPath, { recursive: true });
      console.warn(
        `WARNING: Creating directory '${demoDirectoryPath}'. HTML files (for the demo root and for this page) must be manually updated as well.`,
      );
    } else if (error.code === 'EACCES') {
      throw UsageError(
        `Missing write permission for directory '${demoDirectoryPath}'`,
      );
    } else {
      throw error;
    }
  }

  const demoBundlePath = path.join(demoDirectoryPath, 'bundle.js');

  console.log(`Building ${demoName}`);
  await execa(
    path.resolve(__dirname, '..', 'node_modules', '.bin', 'browserify'),
    [demoPath, '-o', demoBundlePath],
  );
}

/**
 * Build a demo, or build all demos
 */
async function main() {
  const { argv } = yargs(hideBin(process.argv))
    .usage('$0 [demo-name]', 'Build a demo, or build all demos.', (_yargs) =>
      _yargs
        .option('all', {
          conflicts: 'demo-name',
          description: 'Build all demos.',
          type: 'boolean',
        })
        .positional('demo-name', {
          describe: 'The name of the demo to build.',
          type: 'string',
        }),
    )
    .version(false)
    .strict();

  const { all, demoName } = argv;

  const demoSourceDir = path.join(__dirname, 'src');

  if (all) {
    const filenames = await fs.readdir(demoSourceDir);
    const demoFilenames = filenames.filter((filename) =>
      filename.endsWith('.js'),
    );

    if (demoFilenames.length === 0) {
      throw new Error('No demo files found');
    }

    for (const demoFilename of demoFilenames) {
      const demoPath = path.join(demoSourceDir, demoFilename);
      const currentDemoName = demoFilename.substring(
        0,
        demoFilename.length - 3,
      );
      await buildDemo(currentDemoName, demoPath);
    }
  } else {
    const demoPath = path.join(demoSourceDir, `${demoName}.js`);

    try {
      await fs.access(demoPath, fsConstants.R_OK);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw UsageError(`Demo source not found at path: '${demoPath}'`);
      }
      throw error;
    }

    await buildDemo(demoName, demoPath);
  }
}

main().catch((error) => {
  if (error instanceof UsageError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
