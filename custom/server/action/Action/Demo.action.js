const MethodProxy = require('zero-util/src/MethodProxy');

const ActionBase = require('../src/ActionBase');

module.exports = class PagesAction extends ActionBase {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('demo');
  }

  async actions(items) {
    items.push({
      name: 'OPEN: Grid',
      tags: ['open'],
      commands: new MethodProxy({ service: 'remote.router' }).open('CustomGrid', {}, {title: 'Cool Oder'}).chain,
    });
    return items;
  }

}