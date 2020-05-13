const { once } = require('events');
const fs = require('fs');
const { spawn } = require('child_process');

const { RsyncItemizeChangesParser } = require('..');

async function main() {
  // Creating source.
  fs.mkdirSync('source');
  fs.writeFileSync('source/file1', '1');
  fs.writeFileSync('source/file2', '2');

  try {
    let rsync = spawn('rsync', ['--itemize-changes', '--dry-run', '--archive', 'source', 'destination']);

    let parser = new RsyncItemizeChangesParser(rsync.stdout);

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