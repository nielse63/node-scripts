import signale from 'signale';
import Logger from '../Logger';

jest.mock('signale');

const msg = 'howdy';

describe('Logger', () => {
  describe('scope', () => {
    it('should set scope', () => {
      new Logger({ scope: 'test' });
      expect(signale.scope).toHaveBeenCalledWith('test');
    });

    it('should not set scope', () => {
      new Logger();
      expect(signale.scope).not.toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should print to log when debug is true', () => {
      const cli = new Logger({ debug: true });
      cli.debug(msg);
      expect(signale.debug).toHaveBeenCalledWith(msg);
    });

    it('should not print to log when debug is false', () => {
      const cli = new Logger();
      cli.debug(msg);
      expect(signale.debug).not.toHaveBeenCalled();
    });
  });

  describe.each([['info'], ['success'], ['error'], ['warn']])(
    '%s',
    (method) => {
      it('should print to log when quiet is false', () => {
        const cli = new Logger();
        cli[method](msg);
        expect(signale[method]).toHaveBeenCalledWith(msg);
      });

      it('should not print to log when quiet is true', () => {
        const cli = new Logger({ quiet: true });
        cli[method](msg);
        expect(signale[method]).not.toHaveBeenCalled();
      });
    }
  );
});
