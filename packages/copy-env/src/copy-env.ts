import path from 'path';
import fs from 'fs-extra';
import { Logger } from '@nielse63/helpers';

export class CopyEnv extends Logger {
  envPath: string;

  envSamplePath: string;

  constructor(cwd: string, options = {}) {
    super(options);

    this.envPath = path.join(cwd, '.env');
    this.envSamplePath = path.join(cwd, '.env.sample');
  }

  async formatEnv(filepath: string): Promise<string> {
    if (!fs.existsSync(filepath)) {
      this.error(`${filepath} does not exist`);
      return null;
    }
    const content = await fs.readFile(filepath, 'utf8');
    const newContent = content.replace(/'/g, '"');
    await fs.writeFile(filepath, newContent, 'utf8');
    return newContent;
  }

  async run(): Promise<string | null> {
    this.debug(`envPath: ${this.envPath}`);
    this.debug(`envSamplePath: ${this.envSamplePath}`);

    if (!fs.existsSync(this.envPath)) {
      this.debug('.env file not found - returning');
      return null;
    }
    this.debug(`formatting ${this.envPath}`);
    const content = await this.formatEnv(this.envPath);
    this.debug(`copying to ${this.envSamplePath}`);
    await fs.writeFile(this.envSamplePath, content, 'utf8');
    this.success('.env updated');
    return this.envSamplePath;
  }
}

export default async (
  cwd = process.cwd(),
  options = {}
): Promise<string | null> => {
  const copyEnv = new CopyEnv(cwd, options);
  return copyEnv.run();
};
