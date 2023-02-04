import signale, { Signale } from 'signale';

interface Config {
  quiet?: boolean;
  debug?: boolean;
  scope?: string;
}

const defaults: Config = {
  quiet: false,
  debug: false,
  scope: '',
};

class Logger {
  config: Config;
  signale: Signale;

  constructor(options: Config = {}) {
    this.config = {
      ...defaults,
      ...options,
    };
    this.signale = signale;
    if (this.config.debug) {
      this.config.quiet = false;
    }
    if (this.config.scope) {
      this.signale.scope(this.config.scope);
    }
  }

  debug(msg: string): void {
    if (this.config.debug) {
      this.signale.debug(msg);
    }
  }

  info(msg: string): void {
    if (!this.config.quiet) {
      this.signale.info(msg);
    }
  }

  success(msg: string): void {
    if (!this.config.quiet) {
      this.signale.success(msg);
    }
  }

  error(msg: string): void {
    if (!this.config.quiet) {
      this.signale.error(msg);
    }
  }

  warn(msg: string): void {
    if (!this.config.quiet) {
      this.signale.warn(msg);
    }
  }
}

export default Logger;
