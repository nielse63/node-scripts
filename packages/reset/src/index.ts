import trash from '@nielse63/trash';
import cp from 'child_process';
import { cosmiconfig } from 'cosmiconfig';
import fg from 'fast-glob';
import log from 'npmlog';
import path from 'path';

type ResetOptions = {
  paths?: string | string[];
  config?: string;
};

export const getResetConfig = async (rootDir: string): Promise<string[]> => {
  const explorer = cosmiconfig('reset');
  const response = await explorer.search(rootDir);
  if (!response) {
    log.error('reset', 'No reset config found');
    return [];
  }
  const {
    config: { paths },
  } = response;
  const patterns = paths.map((p: string) => {
    if (/^[a-zA-Z]/.test(p)) {
      return `**/${p}`;
    }
    return p;
  });
  const output = await fg(patterns, {
    onlyFiles: false,
    absolute: true,
    dot: true,
    ignore: ['**/node_modules/**/*'],
  });
  return output;
};

export const reset = async (options: ResetOptions) => {
  const { config } = options;
  if (!options.paths && !config) {
    log.error('reset', 'No paths or config provided');
    return;
  }
  let paths: string[] = [];
  if (options.paths && options.paths.length) {
    paths =
      (await fg(options.paths, {
        onlyFiles: false,
        absolute: true,
        dot: true,
      })) || [];
  }
  if (config) {
    const pathsFromConfig: string[] = await getResetConfig(
      path.dirname(config)
    );
    if (pathsFromConfig && Array.isArray(pathsFromConfig)) {
      paths.push(...pathsFromConfig);
    }
  }
  paths = [...new Set(paths)];
  if (!paths.length) {
    log.warn('reset', 'No paths found');
    return;
  }
  const pathsList = paths
    .map((p) => `- ${path.relative(process.cwd(), p)}`)
    .join('\n');
  log.info('reset', `Removing paths:\n${pathsList}`);
  const deletedFiles = await trash(paths);
  const trashFiles = deletedFiles?.map(({ dest }) => dest) || [];
  if (!trashFiles || !trashFiles.length) return;
  cp.spawn('rm', ['-rf', ...trashFiles], {
    detached: true,
    stdio: 'ignore',
  });
};

export default reset;
