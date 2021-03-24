global.console = {
  ...global.console,
  ...{
    warn: jest.fn(),
    error: jest.fn(),
    log: console.log,
    info: console.info,
    debug: console.debug,
  },
};
