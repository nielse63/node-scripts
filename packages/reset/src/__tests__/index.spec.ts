import { cosmiconfig } from 'cosmiconfig';
import fg from 'fast-glob';
import log from 'npmlog';
import { getResetConfig, reset } from '..';
// import path from 'path';
import trash from '@nielse63/trash';
import cp from 'child_process';

jest.mock('cosmiconfig');
jest.mock('fast-glob');
jest.mock('npmlog');
jest.mock('path');
jest.mock('child_process');
jest.mock('@nielse63/trash');

describe('getResetConfig', () => {
  it('should return an empty array if no config is found', async () => {
    (cosmiconfig as jest.Mock).mockReturnValueOnce({
      search: jest.fn().mockResolvedValueOnce(null),
    });
    const result = await getResetConfig('/some/root/dir');
    expect(result).toEqual([]);
    expect(log.error).toHaveBeenCalledWith('reset', 'No reset config found');
  });

  it('should return paths if config is found', async () => {
    (cosmiconfig as jest.Mock).mockReturnValueOnce({
      search: jest.fn().mockResolvedValueOnce({
        config: { paths: ['src', 'test'] },
      }),
    });
    (fg as unknown as jest.Mock).mockResolvedValueOnce([
      '/some/root/dir/src',
      '/some/root/dir/test',
    ]);
    const result = await getResetConfig('/some/root/dir');
    expect(result).toEqual(['/some/root/dir/src', '/some/root/dir/test']);
  });
});

describe('reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log an error if no paths or config are provided', async () => {
    await reset({});
    expect(log.error).toHaveBeenCalledWith(
      'reset',
      'No paths or config provided'
    );
  });

  it('should handle provided paths', async () => {
    (fg as unknown as jest.Mock).mockResolvedValueOnce(['/some/path']);
    (trash as jest.Mock).mockResolvedValueOnce([{ dest: '/some/path' }]);
    await reset({ paths: 'src/**' });
    expect(log.info).toHaveBeenCalledWith(
      'reset',
      expect.stringContaining('Removing paths:')
    );
    expect(cp.spawn).toHaveBeenCalledWith(
      'rm',
      ['-rf', '/some/path'],
      expect.any(Object)
    );
  });

  it('should handle provided config', async () => {
    (cosmiconfig as jest.Mock).mockReturnValueOnce({
      search: jest.fn().mockResolvedValueOnce({
        config: { paths: ['src', 'test'] },
      }),
    });
    (fg as unknown as jest.Mock).mockResolvedValueOnce([
      '/some/root/dir/src',
      '/some/root/dir/test',
    ]);
    (trash as jest.Mock).mockResolvedValueOnce([
      { dest: '/some/root/dir/src' },
      { dest: '/some/root/dir/test' },
    ]);
    await reset({ config: '/some/root/dir/reset.config.js' });
    expect(log.info).toHaveBeenCalledWith(
      'reset',
      expect.stringContaining('Removing paths:')
    );
    expect(cp.spawn).toHaveBeenCalledWith(
      'rm',
      ['-rf', '/some/root/dir/src', '/some/root/dir/test'],
      expect.any(Object)
    );
  });

  it('should handle both paths and config', async () => {
    (cosmiconfig as jest.Mock).mockReturnValueOnce({
      search: jest.fn().mockResolvedValueOnce({
        config: { paths: ['src', 'test'] },
      }),
    });
    (fg as unknown as jest.Mock)
      .mockResolvedValueOnce(['/some/path'])
      .mockResolvedValueOnce(['/some/root/dir/src', '/some/root/dir/test']);
    (trash as jest.Mock).mockResolvedValueOnce([
      { dest: '/some/path' },
      { dest: '/some/root/dir/src' },
      { dest: '/some/root/dir/test' },
    ]);
    await reset({ paths: 'src/**', config: '/some/root/dir/reset.config.js' });
    expect(log.info).toHaveBeenCalledWith(
      'reset',
      expect.stringContaining('Removing paths:')
    );
    expect(cp.spawn).toHaveBeenCalledWith(
      'rm',
      ['-rf', '/some/path', '/some/root/dir/src', '/some/root/dir/test'],
      expect.any(Object)
    );
  });

  it('should handle no paths found', async () => {
    (cosmiconfig as jest.Mock).mockReturnValueOnce({
      search: jest.fn().mockResolvedValueOnce({
        config: { paths: [] },
      }),
    });
    const spy = jest.spyOn(log, 'warn');
    await reset({ paths: [], config: '/some/root/dir/reset.config.js' });
    expect(spy).toHaveBeenCalledWith('reset', 'No paths found');
  });
});
