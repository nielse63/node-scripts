import path from 'path';
import fs from 'fs-extra';
import log from 'signale';

const formatEnv = async (filepath) => {
  const content = await fs.readFile(filepath, 'utf8');
  const newContent = content.replace(/'/g, '"');
  await fs.writeFile(filepath, newContent, 'utf8');
  return newContent;
};

const debug = (string) => {
  if (!process.env.DEBUG) return;
  log.debug(string);
};

export default async (cwd = process.cwd(), options = {}) => {
  // create options object with defaults
  const config = { ...options };
  if (options.debug) {
    config.quiet = true;
    process.env.DEBUG = true;
  }

  // define shared variables
  const envPath = path.join(cwd, '.env');
  const envSamplePath = path.join(cwd, '.env.sample');
  debug(`envPath: ${envPath}`);
  debug(`envSamplePath: ${envSamplePath}`);

  if (!fs.existsSync(envPath)) {
    debug('.env file not found - returning');
    return;
  }
  debug(`formatting ${envPath}`);
  const content = await formatEnv(envPath);
  debug(`copying to ${envSamplePath}`);
  await fs.writeFile(envSamplePath, content, 'utf8');
  if (!config.quiet) {
    log.success('.env updated');
  }
};
