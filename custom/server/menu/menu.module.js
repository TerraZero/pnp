const ZeroModule = require('zero-system/src/ZeroModule');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class WindowModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('menu').setTag('rmi');
  }

  constructor() {
    super();
    this.menu = null;
  }

  getMenuData() {
    if (this.menu === null) {
      this.menu = {};
      SystemCollector.finds(v => v.hasTag('menu')).forEach(v => {
        this.menu[v.name] = v.getObject().menus();
      });
    }
    return this.menu;
  }

}