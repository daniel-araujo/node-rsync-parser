# rsync-parser

Parses the output of rsync when called with the `--itemize-changes` option. This
allows you to programmatically identify files that got created, updated and
deleted. Output can be in the form of strings and streams.


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

// Reads a single token.
let token = await parser.read();
if (token) {
  console.log(`A token of type ${token.type}.`);
}

// Iterates over every token.
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
```

More examples can be found in the `examples` directory.


## Install

```
npm install rsync-parser
```


## Usage

Require the `rsync-parser` module to get access to the
`RsyncItemizeChangesParser` class.

```js
const { RsyncItemizeChangesParser } = require('rsync-parser');
```

You can instantiate `RsyncItemizeChangesParser` either with a string:

```js
exec('rsync --itemize-changes --archive source destination', (err, stdout, stderr) => {
  if (err) {
    return console.error(err);
  }

  let parser = new RsyncItemizeChangesParser(stdout);
});
```

Or with a stream:

```js
let rsync = spawn('rsync', ['--itemize-changes', '--archive', 'source', 'destination']);

let parser = new RsyncItemizeChangesParser(rsync.stdout);
```

You can then call `read` to get tokens. It will return null when no more tokens
are available.

```js
let token;

while (token = await parser.read()) { 
  console.log(token.type);
}
```


## Contributing

The easiest way to contribute is by starring this project on GitHub!

https://github.com/daniel-araujo/node-rsync-parser

If you've found a bug, would like to suggest a feature or need help, feel free to create an issue on GitHub:

https://github.com/daniel-araujo/node-rsync-parser/issues