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

    for await (const token of parser) {
      switch (token.type) {
      case 'create':
        console.log(`Created ${token.path}`);
        break;
    
      case 'update':
        console.log(`Updated ${token.path}`);
        break;
    
      case 'delete':
        console.log(`Deleted ${token.path}`);
        break;
      }
    }
  } finally {
    fs.unlinkSync('source/file1');
    fs.unlinkSync('source/file2');
    fs.rmdirSync('source');
  }
}

main();