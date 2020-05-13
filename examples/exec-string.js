const { once } = require('events');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { RsyncItemizeChangesParser } = require('..');

async function main() {
  // Creating source.
  fs.mkdirSync('source');
  fs.writeFileSync('source/file1', '1');
  fs.writeFileSync('source/file2', '2');

  try {
    const { stdout } = await exec('rsync --itemize-changes --archive --dry-run source destination');

    let parser = new RsyncItemizeChangesParser(stdout);

    parser.on('create', (e) => {
      console.log(`Created ${e.type} ${e.path}`);
    });

    await once(parser, 'end');
  } finally {
    fs.unlinkSync('source/file1');
    fs.unlinkSync('source/file2');
    fs.rmdirSync('source');
  }
}

main();