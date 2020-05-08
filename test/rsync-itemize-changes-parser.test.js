const assert = require('assert');
const { once } = require('events');
const { RsyncItemizeChangesParser } = require('../src/rsync-itemize-changes-parser');
const { Readable } = require('stream');

describe('RsyncItemizeChangesParser', () => {
  it('can take a stream', async () => {
    let output = `>f+++++++++ rsync-parser/LICENSE
`;
    let parser = new RsyncItemizeChangesParser(Readable.from(output));

    let [e] = await once(parser, 'create');
  });

  describe('create', () => {
    it('emits create for local changes', async () => {
      let output = `cd+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.local, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.sent, false);
    });

    it('emits create for received file', async () => {
      let output = `>f+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.sent, false);
    });

    it('emits create for received file of file type', async () => {
      let output = `>f+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'file');
    });

    it('emits create for received file of directory type', async () => {
      let output = `>d+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'directory');
    });

    it('emits create for received file of symbolic link type', async () => {
      let output = `>L+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'symlink');
    });

    it('emits create for received file of device type', async () => {
      let output = `>D+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'device');
    });

    it('emits create for received file of special type', async () => {
      let output = `>S+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'special');
    });

    it('does not emit create for received file of unknown type', async () => {
      let output = `>a+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 10);

        once(parser, 'create').then(() => {
          reject(new Error('Event was emitted'));
        });
      });
    });

    it('emits create for sent file', async () => {
      let output = `<f+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.received, false);
    });

    it('emits create for sent file of file type', async () => {
      let output = `<f+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'file');
    });

    it('emits create for sent file of directory type', async () => {
      let output = `<d+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'directory');
    });

    it('emits create for sent file of symbolic link type', async () => {
      let output = `<L+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'symlink');
    });

    it('emits create for sent file of device type', async () => {
      let output = `<D+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'device');
    });

    it('emits create for sent file of special type', async () => {
      let output = `<S+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'create');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.local, false);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'special');
    });

    it('emits create for sent file of special type', async () => {
      let output = `<a+++++++++ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 10);

        once(parser, 'create').then(() => {
          reject(new Error('Event was emitted'));
        });
      });
    });
  });

  describe('update', () => {
    it('emits update for sent file', async () => {
      let output = `<f.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'file');
    });

    it('emits update for sent file of file type', async () => {
      let output = `<f.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'file');
    });

    it('emits update for sent file of directory type', async () => {
      let output = `<d.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'directory');
    });

    it('emits update for sent file of symbolic link type', async () => {
      let output = `<L.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'symlink');
    });

    it('emits update for sent file of device type', async () => {
      let output = `<D.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'device');
    });

    it('emits update for sent file of special type', async () => {
      let output = `<S.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.sent, true);
      assert.strictEqual(e.received, false);
      assert.strictEqual(e.type, 'special');
    });

    it('does not emit update for sent file of unknown type', async () => {
      let output = `<a.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 10);

        once(parser, 'update').then(() => {
          reject(new Error('Event was emitted'));
        });
      });
    });

    it('emits update for received file', async () => {
      let output = `>f.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.sent, false);
    });

    it('emits update for received file of file type', async () => {
      let output = `>f.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'file');
    });

    it('emits update for received file of directory type', async () => {
      let output = `>d.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'directory');
    });

    it('emits update for received file of symbolic link type', async () => {
      let output = `>L.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'symlink');
    });

    it('emits update for received file of device type', async () => {
      let output = `>D.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'device');
    });

    it('emits update for received file of special type', async () => {
      let output = `>S.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.received, true);
      assert.strictEqual(e.sent, false);
      assert.strictEqual(e.type, 'special');
    });

    it('does not emit update for received file of unknown type', async () => {
      let output = `>a.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 10);

        once(parser, 'update').then(() => {
          reject(new Error('Event was emitted'));
        });
      });
    });

    it('sets checksum to true if different checksum is reported in update', async () => {
      let output = `>fc.t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.checksum, true);
    });

    it('sets checksum to false if checksum is not reported in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.checksum, false);
    });

    it('sets size to true if different size is reported in update', async () => {
      let output = `>f.st...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.size, true);
    });

    it('sets size to false if different size is not reported in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.size, false);
    });

    it('sets timestamp to true if different timestamp is reported in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.timestamp, true);
    });

    it('sets timestamp to true when transfer time flag T is reported', async () => {
      let output = `>fc.T...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.timestamp, true);
    });

    it('sets timestamp to false if timestamp is not reported in update', async () => {
      let output = `>fc........ rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.timestamp, false);
    });

    it('sets permissions to true if permissions were changed in update', async () => {
      let output = `>f..tp..... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.permissions, true);
    });

    it('sets permissions to false if permissions were not changed in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.permissions, false);
    });

    it('sets owner to true if owner were changed in update', async () => {
      let output = `>f..t.o.... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.owner, true);
    });

    it('sets owner to false if owner were not changed in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.owner, false);
    });

    it('sets group to true if group were changed in update', async () => {
      let output = `>f..t..g... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.group, true);
    });

    it('sets group to false if group were not changed in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.group, false);
    });

    it('sets acl to true if acl were changed in update', async () => {
      let output = `>f..t....a. rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.acl, true);
    });

    it('sets acl to false if acl were not changed in update', async () => {
      let output = `>f..t...... rsync-parser/LICENSE
`;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'update');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
      assert.strictEqual(e.acl, false);
    });
  });

  describe('delete', () => {
    it('emits delete file', async () => {
      let output = `*deleting   rsync-parser/LICENSE
  `;
      let parser = new RsyncItemizeChangesParser(output);

      let [e] = await once(parser, 'delete');

      assert.strictEqual(e.path, 'rsync-parser/LICENSE');
    });
  });
})