import trash from '@nielse63/trash';
import cp from 'child_process';
import { cosmiconfig } from 'cosmiconfig';
import fg from 'fast-glob';
import log from 'npmlog';
import { getResetConfig, reset } from '..';

jest.mock('cosmiconfig');
jest.mock('fast-glob');
jest.mock('npmlog');
jest.mock('path');
jest.mock('child_process');
jest.mock('@nielse63/trash');

describe('@nielse63/reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getResetConfig', () => {
    it('should return an empty array if no config is found', async () => {
      (cosmiconfig as jest.Mock).mockReturnValue({
        search: jest.fn().mockResolvedValue(null),
      });
      const result = await getResetConfig('/some/root/dir');
      expect(result).toEqual([]);
      expect(log.error).toHaveBeenCalledWith('reset', 'No reset config found');
    });

    it('should return paths if config is found', async () => {
      (cosmiconfig as jest.Mock).mockReturnValue({
        search: jest.fn().mockResolvedValue({
          config: { paths: ['src', 'test', '123.txt'] },
        }),
      });
      // @ts-expect-error jest mocking error
      (fg as jest.Mock).mockResolvedValue([
        '/some/root/dir/src',
        '/some/root/dir/test',
        '/some/root/dir/123.txt',
      ]);
      const result = await getResetConfig('/some/root/dir');
      expect(result).toEqual([
        '/some/root/dir/src',
        '/some/root/dir/test',
        '/some/root/dir/123.txt',
      ]);
    });
  });

  describe('reset', () => {
    it('should log an error if no paths or config are provided', async () => {
      await reset({});
      expect(log.error).toHaveBeenCalledWith(
        'reset',
        'No paths or config provided'
      );
    });

    it('should handle provided paths', async () => {
      // @ts-expect-error jest mocking error
      (fg as jest.Mock).mockResolvedValue(['/some/path']);
      (trash as jest.Mock).mockResolvedValue([{ dest: '/some/path' }]);
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
      (cosmiconfig as jest.Mock).mockReturnValue({
        search: jest.fn().mockResolvedValue({
          config: { paths: ['src', 'test'] },
        }),
      });
      // @ts-expect-error jest mocking error
      (fg as jest.Mock).mockResolvedValue([
        '/some/root/dir/src',
        '/some/root/dir/test',
      ]);
      (trash as jest.Mock).mockResolvedValue([
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

    it('should print a warning if no paths are provided via config', async () => {
      (cosmiconfig as jest.Mock).mockReturnValue({
        search: jest.fn().mockResolvedValue({
          config: { paths: [] },
        }),
      });
      // @ts-expect-error jest mocking error
      (fg as jest.Mock).mockResolvedValue(null);
      await reset({ config: '/some/root/dir/reset.config.js' });
      expect(log.warn).toHaveBeenCalledWith(
        'reset',
        expect.stringContaining('No paths found')
      );
    });

    it('should handle both paths and config', async () => {
      (cosmiconfig as jest.Mock).mockReturnValue({
        search: jest.fn().mockResolvedValue({
          config: { paths: ['src', 'test'] },
        }),
      });
      // @ts-expect-error jest mocking error
      (fg as jest.Mock)
        .mockResolvedValueOnce(['/some/path'])
        .mockResolvedValueOnce(['/some/root/dir/src', '/some/root/dir/test']);
      (trash as jest.Mock).mockResolvedValue([
        { dest: '/some/path' },
        { dest: '/some/root/dir/src' },
        { dest: '/some/root/dir/test' },
      ]);
      await reset({
        paths: 'src/**',
        config: '/some/root/dir/reset.config.js',
      });
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

    it('should not spawn rm -rf if nothing is returned by `trash`', async () => {
      (cosmiconfig as jest.Mock).mockReturnValue({
        search: jest.fn().mockResolvedValue({
          config: { paths: ['src', 'test'] },
        }),
      });
      // @ts-expect-error jest mocking error
      (fg as jest.Mock).mockResolvedValue([
        '/some/root/dir/src',
        '/some/root/dir/test',
      ]);
      (trash as jest.Mock).mockResolvedValue(null);
      await reset({ config: '/some/root/dir/reset.config.js' });
      expect(cp.spawn).not.toHaveBeenCalled();
    });
  });
});
