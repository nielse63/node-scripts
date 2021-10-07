import path from 'path';
import fs from 'fs-extra';
import log from 'signale';
import { cache, exec } from '@nielse63/helpers';

let envPath;
let envSamplePath;

const formatEnv = async () => {
  const content = await fs.readFile(envPath, 'utf8');
  const newContent = content.replace(/'/g, '"');
  await fs.writeFile(envPath, newContent, 'utf8');
  return newContent;
};

const copyEnv = async (content) => {
  const newContent = content.replace(/"(.*?)"/g, '""');
  await fs.writeFile(envSamplePath, newContent, 'utf8');
  await exec('git add .env.sample');
};

const didFileChange = async () => {
  const cacheFile = await cache.create('.env');
  const cacheValue = (await fs.readFile(cacheFile, 'utf8')).trim();
  if (!cacheValue) {
    return true;
  }
  const content = (await fs.readFile(envPath, 'utf8')).trim();
  return content !== cacheValue;
};

const writeToCache = async (content) => {
  await cache.write('.env', content);
};

export default async (cwd = process.cwd()) => {
  envPath = path.join(cwd, '.env');
  envSamplePath = path.join(cwd, '.env.sample');

  if (!fs.existsSync(envPath)) return;
  const shouldCopyEnv = await didFileChange();
  if (!shouldCopyEnv) return;
  const content = await formatEnv();
  await copyEnv(content);
  await writeToCache(content);
  log.success('.env updated');
};
