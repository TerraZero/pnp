const Server = require('zero-system/src/Nuxt/Socket/Server');
const SystemItem = require('zero-system/src/SystemItem');
const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class RMIModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('rmi');
  }

  /**
   * @param {Server} server 
   */
  setupModuleSocket(server) {
    server.handler.on(Server.EVENT__SOCKET_CONNECT, this.onSocketConnect.bind(this), ['client']);
  }

  /**
   * @param {Object} event
   * @param {import('zero-system/src/Nuxt/Socket/Item')} client
   */
  onSocketConnect(event, client) {
    client.mount.on('rmi:request', (request) => {

    });
    client.mount.on('rmi:response', (response) => {
      
    });
  } 

}