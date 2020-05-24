// This package was originally written for Node.js in JavaScript and was then
// ported to Deno in TypeScript. The Deno version turned out to be more pleasant
// to write for, so now the Node.js version has become a port of the source code
// of the Deno version. This script takes fetches the source code and applies
// the necessary changes to make it work on Node.js. Unit tests are ported as
// well.

const fs = require('fs');
const { spawn } = require('child_process');
const replaceString = require('replace-string');

// Which version to patch.
DENO_RSYNC_PARSER_VERSION = 'v2.1.0';

// Runs a shell command and pipes output to stdout.
async function shell(command) {
  // Preserves stack trace.
  let failure = new Error('Command failed.');

  return new Promise((resolve, reject) => {
    let process = spawn(command, {
      shell: true,
      stdio: 'inherit'
    });

    process.on('error', reject);

    process.on('exit', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(failure);
      }
    });
  });
}


// Patches code and creates files.
let pieces = [
  // rsync_itemize_changes_parser.ts
  async function () {
    let code = await fs.promises.readFile('deno-rsync-parser/rsync_itemize_changes_parser.ts', 'utf-8');

    code = replaceString(
      code,
      'import { StringReader } from "https://deno.land/std@v0.51.0/io/readers.ts"',
      'import { Readable } from "stream";');

    code = replaceString(
      code,
      'from "https://deno.land/std@v0.51.0/io/bufio.ts"',
      'from "./port/read-lines"');

    code = replaceString(
      code,
      'Deno.Reader',
      'Readable');

    code = replaceString(
      code,
      'new StringReader(',
      'Readable.from(');

    await fs.promises.writeFile('src/rsync-itemize-changes-parser.ts', code);
  },

  // mod.ts
  async function () {
    let code = await fs.promises.readFile('deno-rsync-parser/mod.ts', 'utf-8');

    code = replaceString(
      code,
      'from "./rsync_itemize_changes_parser.ts";',
      'from "./rsync-itemize-changes-parser"');

    await fs.promises.writeFile('src/index.ts', code);
  },

  // rsync_itemize_changes_parser.test.ts
  async function () {
    let code = await fs.promises.readFile('deno-rsync-parser/rsync_itemize_changes_parser.test.ts', 'utf-8');

    code = 'import { test } from "./port/test";' + code;

    code = replaceString(
      code,
      'from "https://deno.land/std/testing/asserts.ts";',
      'from "./port/assert";');

    code = replaceString(
      code,
      'import { StringReader } from "https://deno.land/std@v0.51.0/io/readers.ts";',
      'import { Readable } from "stream";');

    code = replaceString(code, 'Deno.test(', 'test(');

    code = replaceString(
      code,
      'from "./rsync_itemize_changes_parser.ts";',
      'from "./rsync-itemize-changes-parser"');

    code = replaceString(
      code,
      'new StringReader(',
      'Readable.from(');

    await fs.promises.writeFile('src/rsync-itemize-changes-parser.test.ts', code);
  }
];

async function main() {
  if (!fs.existsSync('deno-rsync-parser')) {
    await shell('git clone https://github.com/daniel-araujo/deno-rsync-parser.git');
  }

  await shell(`cd deno-rsync-parser; git checkout ${DENO_RSYNC_PARSER_VERSION}`);

  for (let piece of pieces) {
    await piece();
  }

  await shell(`npx tsc`);
}

main();