const dryRun = process.argv.includes('--dry-run');
const log = (msg) => {
  console.log(dryRun ? '[DRY RUN]:' : '', msg);
};

module.exports = log;
