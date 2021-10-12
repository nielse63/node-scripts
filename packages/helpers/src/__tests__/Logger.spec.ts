import log from 'signale';
import Logger from '../Logger';

jest.mock('signale');

const msg = 'howdy';

describe('Logger', () => {
  describe('debug', () => {
    it('should print to log when debug is true', () => {
      const cli = new Logger({ debug: true });
      cli.debug(msg);
      expect(log.debug).toHaveBeenCalledWith(msg);
    });

    it('should not print to log when debug is false', () => {
      const cli = new Logger();
      cli.debug(msg);
      expect(log.debug).not.toHaveBeenCalled();
    });
  });

  describe.each([['info'], ['success'], ['error'], ['warn']])(
    '%s',
    (method) => {
      it('should print to log when quiet is false', () => {
        const cli = new Logger();
        cli[method](msg);
        expect(log[method]).toHaveBeenCalledWith(msg);
      });

      it('should not print to log when quiet is true', () => {
        const cli = new Logger({ quiet: true });
        cli[method](msg);
        expect(log[method]).not.toHaveBeenCalled();
      });
    }
  );
});
