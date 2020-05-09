// Tests code snippets in README.md file.
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const codeBlocks = require('gfm-code-blocks');
const m = require('module');

const modulePath = path.join(__dirname, '..');
const readmeFile = path.join(modulePath, 'README.md');
const readmeContents = fs.readFileSync(readmeFile, {
  encoding: 'utf8',
  flag: 'r'
});

async function captureOutput(code) {
  let output = [];

  // So we can access the parser object.
  code = code.replace('let parser = ', 'parser = ');

  const context = {
    parser: null,

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
    }
  };
  vm.createContext(context);
  vm.runInContext(code, context);

  await new Promise((resolve) => {
    context.parser.on('end', resolve);
  });

  return output.join('\n') + '\n';
}

describe('README.md', () => {
  it('main example', async () => {
    let output = await captureOutput(codeBlocks(readmeContents)[0].code);

    let expected = `Updated file LICENSE
Updated file package.json
Deleted package-lock.json
Created directory src/
Created file src/index.js
`;

    assert.strictEqual(output, expected);
  });
});