const expandTilde = require('expand-tilde');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const originalDatabasePath = expandTilde("~/Library/Messages/chat.db");

module.exports = () => {
  const tempdir = os.tmpdir()
  const cachedDatabasePath = path.join(tempdir, 'cache.db');

  if (fs.existsSync(cachedDatabasePath)) {
    fs.unlinkSync(cachedDatabasePath);
  }

  fs.copySync(originalDatabasePath, cachedDatabasePath);

  return cachedDatabasePath;
}
