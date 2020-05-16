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

You can then register event handlers according to your needs.

```js
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


## Documentation

### Methods

#### `on(type, cb)`

Registers an event handler.

- `type` must be a string. See the [Events](#events)
section for available types.
- `cb` must be a function.

```js
let parser = new RsyncItemizeChangesParser(rsync.stdout);

parser.on('create', (e) => {
  console.log(`Created ${e.type} ${e.path}`);
});
```


#### `off(type, cb)`

Removes an event handler or removes all event handlers for the given type.

- `type` must be a string that identifies the type of event.
- `cb` is the function that was registered with the `on` method. If omitted, all
  event handlers for the given type are deregistered.

```js
let parser = new RsyncItemizeChangesParser(rsync.stdout);

function warn() {
  console.warn('rsync has started deleting files.');

  parser.off('delete', warn);
}

parser.on('delete', warn);
```


#### `once(type, cb)`

Like `on` but the event handler is automatically deregistered after the first
call.

```js
let parser = new RsyncItemizeChangesParser(rsync.stdout);

parser.once('delete', () => {
  // Will only print once.
  console.warn('rsync has started deleting files.');
});
```


#### `addListener(type, cb)`

Alias for `on`.


#### `removeListener(type, cb)`

Alias for `off`. Utilities such as `events.once` only work if this method is present.

```js
const { once } = require('events');

let parser = new RsyncItemizeChangesParser(rsync.stdout);

// Wait until entire output has been parsed.
await once(parser, 'end');
```


### Events

#### `create`

When rsync creates a file. The event object contains the following properties:

```js
{
  // Whether file was created locally. (not sent over the network)
  "local": boolean,
  // Whether file was transferred to the remote host.
  "sent": boolean,
  // Whether file was transferred to the local host.
  "received": boolean,
  // Path to file.
  "path": string,
  // File type. Can be 'file', 'directory', 'symlink', 'device' and 'special'.
  "type": string,
}
```


#### `update`

When rsync deletes a file. The event object contains the following properties:

```js
{
  // Whether file was transferred to the remote host.
  "sent": boolean,
  // Whether file was transferred to the local host.
  "received": boolean,
  // Whether contents differed.
  "checksum": boolean,
  // Whether size was different.
  "size": boolean,
  // Whether timestamp was different.
  "timestamp" boolean,
  // Whether permissions were different.
  "permissions" boolean,
  // Whether owner changed.
  "owner" boolean,
  // Whether group changed.
  "group" boolean,
  // Whether ACL information changed.
  "acl" boolean,
  // Whether extended attributes changed.
  "xattr" boolean,
  // Path to file.
  "path": string,
  // File type. Can be 'file', 'directory', 'symlink', 'device' and 'special'.
  "type": string,
}
```


#### `delete`

When rsync deletes a file. The event object contains the following properties:

```js
{
  // Path to file.
  "path": string,
}
```


### `cannotDelete`

When rsync fails to delete a file. The event object contains the following properties:

```js
{
  // Path to file.
  "path": string,
  // File type. Can be 'file', 'directory', 'symlink', 'device' and 'special'.
  "type": string,
}
```


### `end`

When parsing ends. The event object will be empty.


## Contributing

The easiest way to contribute is by starring this project on GitHub:

https://github.com/daniel-araujo/node-rsync-parser

If you've found a bug, would like to suggest a feature or need help, feel free to create an issue on GitHub:

https://github.com/daniel-araujo/node-rsync-parser/issues