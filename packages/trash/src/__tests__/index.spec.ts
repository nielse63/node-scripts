import fs from 'fs';
import log from 'npmlog';
import os from 'os';
import path from 'path';
import xdgTrashdir from 'xdg-trashdir';
import { getTrashPath, isPathInside, rand, trash, trashItem } from '..';

jest.mock('xdg-trashdir');
jest.mock('path', () => {
  const actual = jest.requireActual('path');
  return {
    ...actual,
    basename: jest.fn((p) => actual.basename(p)),
    extname: jest.fn((p) => actual.extname(p)),
  };
});
jest.mock('npmlog');

const homedir = os.homedir();
const root = path.resolve(os.tmpdir(), '@nielse63/trash');
const nested = path.join(root, 'nested');
const tmp1 = path.join(root, 'tmp.txt');
const tmp2 = path.join(nested, 'tmp.txt');
const platform = process.platform;

describe('@nielse63/trash', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: platform });
  });

  describe('getTrashPath', () => {
    it('should return the Trash path on macOS (darwin)', async () => {
      const spy = jest.spyOn(path, 'join');
      Object.defineProperty(process, 'platform', { value: 'darwin' });

      const result = await getTrashPath();
      expect(result).toBe(path.join(homedir, '.Trash'));
      expect(spy).toHaveBeenCalledWith(homedir, '.Trash');
    });

    it('should return the XDG trash directory on non-macOS platforms', async () => {
      // @ts-expect-error: the xdgTrashdir object doesn't conform with the mock type
      (xdgTrashdir as jest.Mock).mockResolvedValueOnce(
        '/home/testuser/.local/share/Trash'
      );
      Object.defineProperty(process, 'platform', { value: 'linux' });

      const result = await getTrashPath();
      expect(result).toBe('/home/testuser/.local/share/Trash');
      expect(xdgTrashdir).toHaveBeenCalled();
    });
  });

  describe('isPathInside', () => {
    it('should return true if child is inside parent', () => {
      expect(isPathInside(tmp1, root)).toBe(true);
      expect(isPathInside(tmp2, root)).toBe(true);
    });

    it('should return false when files are on the same directory level', () => {
      const parentPath = path.join(root, 'fake-dir');
      expect(isPathInside(parentPath, parentPath)).toBe(false);
    });

    it('should return false when child is above parent', () => {
      const parentPath = path.join(root, 'fake-dir');
      expect(isPathInside(root, parentPath)).toBe(false);
    });

    it('should return false when child is several levels above parent', () => {
      const parentPath = path.join(root, 'path/to/fake-dir');
      expect(isPathInside(root, parentPath)).toBe(false);
    });

    it('should return false when relation is equal to path.resolve(child)', () => {
      expect(isPathInside('', '')).toBe(false);
    });
  });

  describe('rand', () => {
    it('should return a string of length 8 by default', () => {
      const output = rand();
      expect(output).toBeString();
      expect(output.length).toBe(8);
    });

    it('should return a string of a specified length', () => {
      expect(rand(15).length).toBe(15);
    });
  });

  describe('trashItem', () => {
    const fsRename = fs.promises.rename;

    beforeEach(() => {
      path.basename = jest.fn().mockReturnValue('file.txt');
      path.extname = jest.fn().mockReturnValue('.txt');
      path.join = jest
        .fn()
        .mockReturnValue('/some/trash/file_1234567890_abcdef.txt');
      fs.promises.rename = jest.fn();
    });

    afterAll(() => {
      fs.promises.rename = fsRename;
    });

    it('should log a warning and return an empty destination if the file does not exist', async () => {
      fs.existsSync = jest.fn().mockReturnValue(false);

      const result = await trashItem('/some/nonexistent/file.txt');
      expect(log.warn).toHaveBeenCalledWith(
        'trash',
        '/some/nonexistent/file.txt does not exist'
      );
      expect(result).toEqual({ src: '/some/nonexistent/file.txt', dest: '' });
    });

    it('should move the file to the trash and return the new path if the file exists', async () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      (fs.promises.rename as jest.Mock).mockResolvedValue(undefined);
      path.basename = jest.fn().mockReturnValue('file.txt');
      path.extname = jest.fn().mockReturnValue('.txt');
      path.join = jest
        .fn()
        .mockReturnValue('/some/trash/file_1234567890_abcdef.txt');

      const result = await trashItem('/some/existing/file.txt', '/some/trash');
      expect(log.info).toHaveBeenCalledWith(
        'trash',
        'moving /some/existing/file.txt to /some/trash/file_1234567890_abcdef.txt'
      );
      expect(result).toEqual({
        src: '/some/existing/file.txt',
        dest: '/some/trash/file_1234567890_abcdef.txt',
      });
    });

    it('should log an error if moving the file to the trash fails', async () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      (fs.promises.rename as jest.Mock).mockRejectedValue(
        new Error('rename failed')
      );

      const result = await trashItem('/some/existing/file.txt', '/some/trash');
      expect(log.info).toHaveBeenCalledWith(
        'trash',
        'moving /some/existing/file.txt to /some/trash/file_1234567890_abcdef.txt'
      );
      expect(log.error).toHaveBeenCalledWith('trash', 'Error: rename failed');
      expect(result).toEqual({
        src: '/some/existing/file.txt',
        dest: '/some/trash/file_1234567890_abcdef.txt',
      });
    });
  });

  describe('trash', () => {
    let removeFromTrash;
    let fsExistsSync;

    beforeAll(async () => {
      fsExistsSync = fs.existsSync;
      await fs.promises.mkdir(root, {
        recursive: true,
      });
    });

    beforeEach(async () => {
      jest.clearAllMocks();
      removeFromTrash = [];
      await fs.promises.writeFile(tmp1, '');
      await fs.promises.mkdir(nested, {
        recursive: true,
      });
      await fs.promises.writeFile(tmp2, '');
    });

    afterEach(async () => {
      const promises = (removeFromTrash || []).map((filepath) =>
        fs.promises.rm(filepath, { recursive: true, force: true })
      );
      await Promise.all(promises);
      fs.existsSync = fsExistsSync;
    });

    afterAll(async () => {
      await fs.promises.rm(root, { recursive: true, force: true });
    });

    it('should print error and return cwd value does not exist', async () => {
      fs.existsSync = jest.fn().mockReturnValueOnce(false);
      await trash(['tmp.txt'], {
        cwd: '/path/to/nowhere',
      });
      expect(log.error).toHaveBeenCalledWith(
        'trash',
        `cwd '/path/to/nowhere' does not exist - exiting`
      );
    });

    it('should print error and return if trash directory doesnt exist', async () => {
      fs.existsSync = jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      await trash(['tmp.txt'], {
        trash: 'fake',
      });
      expect(log.error).toHaveBeenCalledWith(
        'trash',
        `trash 'fake' does not exist - exiting`
      );
    });

    it('should handle a string as the filepaths argument', async () => {
      fs.existsSync = jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      await trash('tmp.txt', {
        trash: 'fake',
      });
      expect(log.error).toHaveBeenCalledWith(
        'trash',
        `trash 'fake' does not exist - exiting`
      );
    });

    it('should return expected output', async () => {
      const output = await trash(['tmp.txt', 'fake/tmp.txt'], {
        cwd: root,
      });
      expect(output).toBeArrayOfSize(1);
      const [object] = output;
      expect(object).toEqual({
        src: expect.any(String),
        dest: expect.any(String),
      });
      removeFromTrash = output?.map(({ dest }) => dest) || [];
    });

    it('should be able to accept an empty options object', async () => {
      fs.existsSync = jest.fn().mockReturnValue(false);
      await trash([tmp1]);
      expect(log.error).toHaveBeenCalled();
    });
  });
});
