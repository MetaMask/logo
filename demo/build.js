const execa = require('execa');
const { promises: fs } = require('fs');
const path = require('path');
const { promisify } = require('util');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');
const rimraf = promisify(require('rimraf'));

/**
 * An error resulting from incorrect usage.
 *
 * This error type is used to distinguish user errors from developer errors, so that the stack
 * trace can be omitted when it's not useful.
 */
class UsageError extends Error {}

/**
 *  Build a single demo.
 * @param {string} demoName - The name of the demo.
 */
async function buildDemo(demoName) {
  console.log(`Building ${demoName}`);

  // Clear destination directory
  const demoDirectoryPath = path.join(__dirname, 'dist', demoName);
  await rimraf(demoDirectoryPath);
  await fs.mkdir(demoDirectoryPath);

  // Copy static files
  const demoSourceDirectoryPath = path.join(__dirname, 'src', demoName);
  const files = await fs.readdir(demoSourceDirectoryPath);
  for (const filename of files) {
    // Skip JavaScript files - these should be included in the bundle
    if (filename.endsWith('.js')) {
      continue;
    }

    await fs.copyFile(
      path.join(demoSourceDirectoryPath, filename),
      path.join(demoDirectoryPath, filename),
    );
  }

  // Build JavaScript bundle
  const demoBundlePath = path.join(demoDirectoryPath, 'bundle.js');
  const demoEntrypointPath = path.join(
    demoSourceDirectoryPath,
    `${demoName}.js`,
  );
  await execa(
    path.resolve(__dirname, '..', 'node_modules', '.bin', 'browserify'),
    [demoEntrypointPath, '-o', demoBundlePath],
  );
}

/**
 * Build the main page of the demo.
 * @param {object} [options] - Build options.
 * @param {boolean} [options.clear] - Whether to clear the directory of contents first before building.
 */
async function buildIndex({ clear = false } = {}) {
  const demoSourceDirectory = path.join(__dirname, 'src');
  const files = await fs.readdir(demoSourceDirectory, { withFileTypes: true });
  const filenames = files
    .filter((file) => !file.isDirectory())
    .map((file) => file.name);

  const demoDirectoryPath = path.join(__dirname, 'dist');
  if (clear) {
    await rimraf(demoDirectoryPath);
  }

  try {
    await fs.mkdir(demoDirectoryPath);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  for (const filename of filenames) {
    await fs.copyFile(
      path.join(demoSourceDirectory, filename),
      path.join(demoDirectoryPath, filename),
    );
  }
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
        .option('clear', {
          default: false,
          description: 'Empty the demo directory before building',
          requiresArg: 'all',
          type: 'boolean',
        })
        .positional('demo-name', {
          describe: 'The name of the demo to build.',
          type: 'string',
        }),
    )
    .version(false)
    .strict();

  const { all, clear, demoName } = argv;

  const demoSourceDir = path.join(__dirname, 'src');

  if (all) {
    const files = await fs.readdir(demoSourceDir, { withFileTypes: true });
    const demoNames = files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    if (demoNames.length === 0) {
      throw new UsageError('No demo files found');
    }

    await buildIndex({ clear });
    for (const currentDemoName of demoNames) {
      await buildDemo(currentDemoName);
    }
  } else {
    await buildIndex();
    await buildDemo(demoName);
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
