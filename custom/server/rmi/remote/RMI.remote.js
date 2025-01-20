const RemoteSystem = require('zero-system/src/RemoteSystem');

module.exports = class RMIRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('rmi');
  }

  /**
   * @param {import('zero-system/src/RemoteSystem')} system 
   */
  static async onBoot(system) {
    system.addResolver(this.resolver, 2000);
    system.socket.socket.on('rmi:info:response', (response) => {
      console.log(response);
    });
  }

  /**
   * @param {string} id 
   * @returns {?Object}
   */
  static async resolver(id) {
    RemoteSystem.instance.socket.request('rmi:info:request');
    return { t: 'not found', id };
  }

}