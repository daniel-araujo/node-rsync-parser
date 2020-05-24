// Tests code snippets in README.md file.
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const codeBlocks = require('gfm-code-blocks');
const m = require('module');

const modulePath = path.join(__dirname, '..');
const readmeFile = path.join(__dirname, '../README.md');
const readmeContents = fs.readFileSync(readmeFile, {
  encoding: 'utf8',
  flag: 'r'
});

async function captureOutput(code) {
  let output = [];

  // Because await is only valid in an async function.
  code = `(async () => { ${code} })().then(resolve).catch(reject)`;

  await new Promise((resolve, reject) => {
    const context = {
      require(s) {
        if (s === 'rsync-parser') {
          return require(modulePath);
        } else {
          throw new Error('Blocked.');
        }
      },

      console: {
        log(a) {
          output.push(a);
        }
      },

      resolve: resolve,
      reject: reject
    };
    vm.createContext(context);
    vm.runInContext(code, context);
  });

  return output.join('\n') + '\n';
}

describe('README.md', () => {
  it('main example', async () => {
    let output = await captureOutput(codeBlocks(readmeContents)[0].code);

    let expected = `A token of type update.
Updated package.json
Deleted package-lock.json
Created src/
Created src/index.js
`;

    assert.strictEqual(output, expected);
  });
});