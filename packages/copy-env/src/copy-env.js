import path from 'path';
import fs from 'fs-extra';
import log from 'signale';

const formatEnv = async (filepath) => {
  const content = await fs.readFile(filepath, 'utf8');
  const newContent = content.replace(/'/g, '"');
  await fs.writeFile(filepath, newContent, 'utf8');
  return newContent;
};

export default async (cwd = process.cwd(), options = {}) => {
  // create options object with defaults
  const config = {
    print: process.env.NODE_ENV !== 'test',
    ...options,
  };

  // define shared variables
  const envPath = path.join(cwd, '.env');
  const envSamplePath = path.join(cwd, '.env.sample');

  if (!fs.existsSync(envPath)) return;
  const content = await formatEnv(envPath);
  await fs.writeFile(envSamplePath, content, 'utf8');
  if (config.print) {
    log.success('.env updated');
  }
};
