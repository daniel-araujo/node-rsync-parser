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