module.exports = class WallTile {

  /**
   * @param {import('../Collector/EditorTile.collector')} collector 
   */
  static define(collector) {
    collector.add('wall');
  }

  info = {
    label: 'Wall',
    key: 'wall',
    group: 'base',
    bg: 'black',
  }

  predefine = [
    {
      type: 'wall',
      label: 'A',
    },
    {
      type: 'wall',
      label: 'B',
      bg: 'grey',
    },
  ]

}