import fs from 'fs';
import log from 'npmlog';
import os from 'os';
import path from 'path';
import xdgTrashdir from 'xdg-trashdir';
import { getTrashPath, isPathInside, main, rand, trashItem } from '..';

jest.mock('xdg-trashdir');

const homedir = os.homedir();
const root = path.resolve(os.tmpdir(), '@nielse63/trash');
const nested = path.join(root, 'nested');
const tmp1 = path.join(root, 'tmp.txt');
const tmp2 = path.join(nested, 'tmp.txt');
const platform = process.platform;

describe('trash', () => {
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
    it('should print debug statement and return if given file isnt found', async () => {
      const spy = jest.spyOn(log, 'warn').mockImplementation();
      await trashItem('fake.txt');
      expect(spy).toHaveBeenCalledWith('trash', 'fake.txt does not exist');
    });
  });

  describe('main', () => {
    let removeFromTrash;

    beforeAll(async () => {
      await fs.promises.mkdir(root, {
        recursive: true,
      });
    });

    beforeEach(async () => {
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
    });

    afterAll(async () => {
      await fs.promises.rm(root, { recursive: true, force: true });
    });

    it('should print error and return cwd value does not exist', async () => {
      const spy = jest.spyOn(log, 'error').mockImplementation();
      await main(['tmp.txt'], {
        cwd: '/path/to/nowhere',
      });
      expect(spy).toHaveBeenCalledWith(
        'trash',
        `cwd '/path/to/nowhere' does not exist - exiting`
      );
    });

    it('should print error and return if trash directory doesnt exist', async () => {
      const spy = jest.spyOn(log, 'error').mockImplementation();
      await main(['tmp.txt'], {
        trash: 'fake',
      });
      expect(spy).toHaveBeenCalledWith(
        'trash',
        `trash 'fake' does not exist - exiting`
      );
    });

    it('should remove files', async () => {
      expect(fs.existsSync(tmp1)).toBe(true);
      expect(fs.existsSync(tmp2)).toBe(true);
      const output = await main(['tmp.txt', 'nested', 'fake/tmp.txt'], {
        cwd: root,
      });
      expect(fs.existsSync(tmp1)).toBe(false);
      expect(fs.existsSync(nested)).toBe(false);
      expect(fs.existsSync(tmp2)).toBe(false);
      removeFromTrash = output?.map(({ dest }) => dest) || [];
    });

    it('should return expected output', async () => {
      const output = await main(['tmp.txt', 'fake/tmp.txt'], {
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
      await main([tmp1]);
      expect(fs.existsSync(tmp1)).toBe(false);
    });
  });
});
