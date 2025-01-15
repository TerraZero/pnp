module.exports = class EntityStorage {

  /**
   * @param {import('zero-system/src/Collector/ServiceCollector')} collector 
   */
  static define(collector) {
    collector.add('entity.storage')
      .setRemote('service.remote.entity.storage');
  }

  /**
   * @param {import('./RemoteEntityStorage.service')} remote 
   */
  setRemote(remote) {
    this.remote = remote;
  }

  async fromServer(num = 1) {
    console.log('fromServer', num);
    return 'hallo: ' + (num * 2) + await this.remote.fromClient(num);
  }

}