const ZeroRoot = require('zero-system/src/ZeroRoot');
const SystemCollector = require('zero-system/src/SystemCollector');

/**
 * @returns {ZeroRoot}
 */
module.exports = function boot() {
  const root = new ZeroRoot(__dirname, '~/custom/server');
  
  SystemCollector.addPath(__dirname);

  root.boot();
  return root;
}