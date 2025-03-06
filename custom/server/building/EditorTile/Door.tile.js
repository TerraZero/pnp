module.exports = class DoorTile {

  /**
   * @param {import('../Collector/EditorTile.collector')} collector 
   */
  static define(collector) {
    collector.add('door');
  }

  info = {
    label: 'Door',
    key: 'door',
    group: 'base',
    bg: 'green',
  }

}