# rsync-parser

Parses rsync output generated with the `--itemize-changes` option. This allows
you to programmatically identify files that got created, updated and deleted.


## Example

```js
const { RsyncItemizeChangesParser } = require('rsync-parser');

let parser = new RsyncItemizeChangesParser(`
>f..tp..... LICENSE
>f.st...... package.json
*deleting   package-lock.json
cd+++++++++ src/
>f+++++++++ src/index.js
`);

parser.on('create', (e) => {
  console.log(`Created ${e.type} ${e.path}`);
});

parser.on('update', (e) => {
  console.log(`Updated ${e.type} ${e.path}`);
});

parser.on('delete', (e) => {
  console.log(`Deleted ${e.path}`);
});

parser.on('end', (e) => {
  console.log(`Finished`);
});
```