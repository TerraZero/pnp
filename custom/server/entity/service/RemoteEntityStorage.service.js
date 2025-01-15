module.exports = class RemoteEntityStorage {

  /**
   * @param {import('zero-system/src/Collector/ServiceCollector')} collector 
   */
  static define(collector) {
    collector.add('remote.entity.storage');
  }

  /**
   * @param {import('./EntityStorage.service')} remote 
   */
  constructor(remote) {
    this.remote = remote;
  }

  fromClient(num) {
    console.log('fromClient', num);
    return 'client ' + (num * 4);
  }

  async execute(num) {
    console.log(await this.remote.fromServer(num));
  }

}