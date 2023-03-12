const fs = require('fs');
const path = require('path');
const os = require('os');
const log = require('./log');

const dryRun = process.argv.includes('--dry-run');
const TRASH_PATH = path.join(os.homedir(), '.Trash');
const root = path.resolve(__dirname, '../..');

const trash = async (filepath) => {
  if (!fs.existsSync(filepath)) {
    log(`${filepath} does not exist`);
    return;
  }
  if (fs.existsSync(TRASH_PATH)) {
    const basename = path.basename(filepath);
    const extension = path.extname(basename);
    const filename = basename.replace(new RegExp(`${extension}$`), '');
    let newName = path.join(
      TRASH_PATH,
      filename + '_' + Date.now() + extension
    );
    if (fs.existsSync(newName)) {
      const random = Math.floor(Math.random() * 10000);
      newName = newName.replace(
        new RegExp(`${extension}$`),
        `_${random}${extension}`
      );
    }
    log(
      `Moving ${path.relative(root, filepath)} to ${newName.replace(
        os.homedir(),
        '~'
      )}`
    );
    if (!dryRun) {
      await fs.promises.rename(filepath, newName);
    }
    return;
  }

  log(`permanently deleting ${filepath}`);
  if (dryRun) return;
  await fs.promises.rm(filepath, {
    force: true,
    recursive: true,
  });
};

module.exports = trash;
