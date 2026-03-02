module.exports = class EntityWindow {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('unit');
  }

  windows() {
    return {
      'unit.select': {
        path: '/unit/select',
        title: 'Select Unit',
        component: 'Control/Unit/Select',
        zui: {
          width: '50%',
          height: '50%',
          position: 'center',
        },
      },
    };
  }

}