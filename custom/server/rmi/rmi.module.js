const Server = require('zero-system/src/Nuxt/Socket/Server');
const SystemCollector = require('zero-system/src/SystemCollector');
const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class RMIModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('rmi');
  }

  /**
   * @param {ZeroModule} root 
   */
  constructor(root) {
    super(root);
    this.info = null;
  }

  getInfo() {
    if (this.info === null) {
      this.info = SystemCollector.finds(item => item.hasTag('remote'));
    }
    return this.info;
  }

  /**
   * @param {Server} server 
   */
  setupModuleSocket(server) {
    server.addHandler('rmi.info', (request, client, answer) => {
      answer({
        result: request.data.test + request.data.test,
      });
    });
  }

}