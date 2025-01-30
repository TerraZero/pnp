const ZeroRoot = require('zero-system/src/ZeroRoot');
const SystemCollector = require('zero-system/src/SystemCollector');
const Logger = require('zero-system/src/Log/Logger');

/**
 * @returns {ZeroRoot}
 */
module.exports = function boot() {
  Logger.setDebug(true);
  const root = new ZeroRoot(__dirname, '~/custom/server');
  
  SystemCollector.addModules(__dirname);

  root.boot();
  return root;
}