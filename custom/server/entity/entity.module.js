const ZeroModule = require('zero-system/src/ZeroModule');
const SystemCollector = require('zero-system/src/SystemCollector');
const Mount = require('zero-system/src/Nuxt/Socket/Mount');

module.exports = class EntityModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server')} server 
   */
  async setupModuleSocket(server) {
    server.events.on(Mount.EVENT__MOUNT_GET_REQUEST, ({ request }) => {
      console.log(request.meta);
    });
  }

}