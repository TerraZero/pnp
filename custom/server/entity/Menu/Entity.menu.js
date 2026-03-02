const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityMenu {

  /**
   * @param {import('../../menu/Menu.collector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  menus() {
    const menus = [];
    SystemCollector.finds(item => item.hasTag('entity')).forEach(item => {
      const entity = item.getObject();
      
      if (typeof entity.info === 'function') {
        const info = item.getObject().info();
        if (info.menu) {
          info.menu.url = '/eldritch/' + item.getAttribute('entity_type') + '/list';
          menus.push(info.menu);
        }
      }
    });
    return menus;
  }

}