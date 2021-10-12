import log from 'signale';

interface Config {
  quiet?: boolean;
  debug?: boolean;
}

const defaults: Config = {
  quiet: false,
  debug: false,
};

class Logger {
  config: Config;

  constructor(options: Config = {}) {
    this.config = {
      ...defaults,
      ...options,
    };
    if (this.config.debug) {
      this.config.quiet = false;
    }
  }

  debug(msg: string): void {
    if (this.config.debug) {
      log.debug(msg);
    }
  }

  info(msg: string): void {
    if (!this.config.quiet) {
      log.info(msg);
    }
  }

  success(msg: string): void {
    if (!this.config.quiet) {
      log.success(msg);
    }
  }

  error(msg: string): void {
    if (!this.config.quiet) {
      log.error(msg);
    }
  }

  warn(msg: string): void {
    if (!this.config.quiet) {
      log.warn(msg);
    }
  }
}

export default Logger;
