const { EventEmitter } = require('events');
const { Readable } = require('stream');
const readline = require('readline');

// Private fields.
const EVENTS = Symbol('events');

///////////////////////////////////////////////////////////////////////////////
// Rsync operation types
///////////////////////////////////////////////////////////////////////////////
// A file is being transferred to the remote host (sent).
const RSYNC_TYPE_SENT = '<';

// A file is being transferred to the local host (received).
const RSYNC_TYPE_RECEIVED = '>';

// A local change/creation is occurring for the item (such as the creation of a
// directory or the changing of a symlink, etc.).
const RSYNC_TYPE_CHANGED = 'c';

// The item is a hard link to another item (requires --hard-links).
const RSYNC_TYPE_INFO_HARD_LINK = 'h';

// The item is not being updated (though it might have attributes that are being
// modified).
const RSYNC_TYPE_NONE = '.';

// The rest of the itemized-output area contains a message (e.g. "deleting").
const RSYNC_TYPE_MESSAGE = '*';
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Rsync file types
///////////////////////////////////////////////////////////////////////////////
// File.
const RSYNC_FILE_FILE = 'f';

// Directory.
const RSYNC_FILE_DIRECTORY = 'd';

// Symbolic link.
const RSYNC_FILE_SYMLINK = 'L';

// Device.
const RSYNC_FILE_DEVICE = 'D';

// Special file.
const RSYNC_FILE_SPECIAL = 'S';
///////////////////////////////////////////////////////////////////////////////

function rsyncFileTypeToOurFileType(rsyncFileType) {
  switch (rsyncFileType) {
  case RSYNC_FILE_FILE: return 'file';
  case RSYNC_FILE_DIRECTORY: return 'directory';
  case RSYNC_FILE_SYMLINK: return 'symlink';
  case RSYNC_FILE_DEVICE: return 'device';
  case RSYNC_FILE_SPECIAL: return 'special';
  default: return null;
  }
}

exports.RsyncItemizeChangesParser = class RsyncItemizeChangesParser {
  constructor(stdout) {
    this[EVENTS] = new EventEmitter();

    let rl = readline.createInterface({
      input: typeof stdout !== 'string' ? stdout : Readable.from(stdout),
    });

    rl.on('close', () => {
      // The end.
      this[EVENTS].emit('end', {});
    });

    rl.on('line', (line) => {
      // The general format is like the string YXcstpoguax

      // Y is replaced by the type of update being done.
      let Y = line[0];

      if (Y == RSYNC_TYPE_SENT || Y === RSYNC_TYPE_RECEIVED || Y === RSYNC_TYPE_CHANGED) {
        // File type.
        let X = line[1];

        let fileType = rsyncFileTypeToOurFileType(X);

        if (fileType === null) {
          // Not reporting unknown file types.
          return;
        }

        // Checksum for regular files, a change in some value for symlinks,
        // devices and special files. If it's a plus sign then it means that a
        // file was created.
        let c = line[2];

        // Path is separated by a space from the codes.
        let path = line.substring(line.indexOf(' ') + 1);

        if (c === '+') {
          this[EVENTS].emit('create', {
            local: Y == RSYNC_TYPE_CHANGED,
            sent: Y == RSYNC_TYPE_SENT,
            received: Y === RSYNC_TYPE_RECEIVED,
            path: path,
            type: fileType,
          });
        } else {
          // Different checksum
          let c = line[2];

          // Size change.
          let s = line[3];

          // Timestamp change.
          let t = line[4];

          // Permissions change.
          let p = line[5];

          // Owner change.
          let o = line[6];

          // Group change.
          let g = line[7];

          // ACL change.
          let a = line[9];

          // Extended attributes changed.
          let x = line[10];

          this[EVENTS].emit('update', {
            sent: Y == RSYNC_TYPE_SENT,
            received: Y === RSYNC_TYPE_RECEIVED,
            checksum: c === 'c',
            size: s === 's',
            timestamp: t === 't' || t === 'T',
            permissions: p === 'p',
            owner: o === 'o',
            group: g === 'g',
            acl: a === 'a',
            xattr: x === 'x',
            path: path,
            type: fileType,
          });
        }
      } else if (Y === RSYNC_TYPE_MESSAGE) {
        // Does not follow general format.

        let deletingMessage = line.substring(1, 9);

        if (deletingMessage === 'deleting') {
          let path = line.substring(12);

          this[EVENTS].emit('delete', {
            path: path
          });
        }
      }
    });
  }

  on(type, cb) {
    this[EVENTS].on(type, cb);
  }

  once(type, cb) {
    this[EVENTS].once(type, cb);
  }

  off(type, cb) {
    this[EVENTS].off(type, cb);
  }

  removeListener(type, cb) {
    this[EVENTS].off(type, cb);
  }
};
